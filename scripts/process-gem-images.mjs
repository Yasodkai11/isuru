import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import sharp from "sharp";
import { removeBackground } from "@imgly/background-removal-node";

const USAGE = `Usage: node scripts/process-gem-images.mjs [inputDir] [outputDir] [options]

Cuts gems out of raw photos and exports centred, square, transparent WebP files.

  inputDir             default: isuru_gems_real/images/Gems
  outputDir            default: public/gems-processed

Options:
  --size <px>          output canvas size (default 1600)
  --fill <0-1>         share of the canvas the gem's longest side may occupy (default 0.62)
  --wb <0-1>           white-balance strength, measured from the photo background (default 0.6)
  --no-wb              skip white balance
  --model <name>       small | medium | large (default medium)
  --force              reprocess files whose output is already up to date
  -h, --help`;

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);
const WORK_MAX_PX = 2048;
const ALPHA_SOLID = 128;
const ALPHA_BACKGROUND = 8;
const MAX_PASSES = 3;
const REFINE_PAD = 0.08;
const CONVERGED_SHARE = 0.55;
const MIN_BLOB_SHARE = 0.01;
const MAX_PROBES = 2;
const PROBE_INSET = 0.15;
const PROBE_MAX_SHARE = 0.5;
const MAX_WB_GAIN_DELTA = 0.15;
const SHEET_TILE = 280;
const SHEET_COLS = 6;
const SHEET_BG = { r: 243, g: 238, b: 228 };

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    size: { type: "string", default: "1600" },
    fill: { type: "string", default: "0.62" },
    wb: { type: "string", default: "0.6" },
    "no-wb": { type: "boolean", default: false },
    model: { type: "string", default: "medium" },
    force: { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
});

if (values.help) {
  console.log(USAGE);
  process.exit(0);
}

const inputDir = path.resolve(positionals[0] ?? "isuru_gems_real/images/Gems");
const outputDir = path.resolve(positionals[1] ?? "public/gems-processed");
const size = Number(values.size);
const fill = Number(values.fill);
const wbStrength = values["no-wb"] ? 0 : Number(values.wb);
const model = values.model;

if (!existsSync(inputDir)) {
  console.error(`Input folder not found: ${inputDir}`);
  process.exit(1);
}
if (!(size > 0) || !(fill > 0 && fill <= 1) || !(wbStrength >= 0 && wbStrength <= 1)) {
  console.error(`Invalid --size, --fill or --wb.\n\n${USAGE}`);
  process.exit(1);
}
if (!["small", "medium", "large"].includes(model)) {
  console.error(`--model must be small, medium or large.`);
  process.exit(1);
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, "")
    .replace(/[\s._]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function listImages(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (full === outputDir) continue;
    if (entry.isDirectory()) files.push(...listImages(full));
    else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) files.push(full);
  }
  return files.sort();
}

function outputPathFor(file) {
  const rel = path.relative(inputDir, file);
  const dirs = path.dirname(rel).split(path.sep).filter((d) => d && d !== ".").map(slugify);
  const name = slugify(path.basename(rel, path.extname(rel)));
  return path.join(outputDir, ...dirs, `${name}.webp`);
}

// Bounding box of the largest solid blob, so stray specks (labels, dust, reflections) don't skew the crop.
function largestBlob(alpha, width, height) {
  const labels = new Int32Array(width * height);
  const stack = new Int32Array(width * height);
  let best = null;
  let label = 0;
  for (let start = 0; start < alpha.length; start++) {
    if (labels[start] || alpha[start] <= ALPHA_SOLID) continue;
    label++;
    let top = 0, area = 0;
    let minX = width, minY = height, maxX = -1, maxY = -1;
    stack[top++] = start;
    labels[start] = label;
    while (top) {
      const i = stack[--top];
      const x = i % width, y = (i - x) / width;
      area++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      const neighbours = [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, y > 0 ? i - width : -1, y < height - 1 ? i + width : -1];
      for (const n of neighbours) {
        if (n >= 0 && !labels[n] && alpha[n] > ALPHA_SOLID) {
          labels[n] = label;
          stack[top++] = n;
        }
      }
    }
    if (!best || area > best.area) {
      best = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1, area };
    }
  }
  return best;
}

function padRegion(box, pad, width, height) {
  const dx = Math.round(box.width * pad), dy = Math.round(box.height * pad);
  const left = Math.max(0, box.left - dx), top = Math.max(0, box.top - dy);
  return {
    left,
    top,
    width: Math.min(width, box.left + box.width + dx) - left,
    height: Math.min(height, box.top + box.height + dy) - top,
  };
}

async function segment(rgb, width, height, region) {
  const crop = await sharp(rgb, { raw: { width, height, channels: 3 } }).extract(region).png().toBuffer();
  const cutout = await removeBackground(new Blob([crop], { type: "image/png" }), {
    model,
    output: { format: "image/png" },
  });
  return sharp(Buffer.from(await cutout.arrayBuffer()))
    .ensureAlpha()
    .resize(region.width, region.height, { fit: "fill" })
    .extractChannel(3)
    .raw()
    .toBuffer();
}

// Stones photographed inside a gem box come back as "the box" on the first pass; re-segmenting the crop
// finds the stone. Stops once a pass returns a subject that fills most of its crop.
async function findGem(rgb, width, height) {
  let region = { left: 0, top: 0, width, height };
  let result = null;
  for (let pass = 0; pass < MAX_PASSES; pass++) {
    const alpha = await segment(rgb, width, height, region);
    const blob = largestBlob(alpha, region.width, region.height);
    if (!blob) break;
    const blobShare = (blob.width * blob.height) / (region.width * region.height);
    if (result && blobShare < MIN_BLOB_SHARE) break;
    result = { region, alpha, blob };
    if (pass > 0 && blobShare > CONVERGED_SHARE) break;
    region = padRegion(
      { left: region.left + blob.left, top: region.top + blob.top, width: blob.width, height: blob.height },
      REFINE_PAD,
      width,
      height,
    );
  }
  if (!result) return null;

  // A converged subject can still be the box itself; look inside it for a smaller object that sits
  // fully within the frame. A lone gem fails this test because its facets run off the inset crop.
  for (let probe = 0; probe < MAX_PROBES; probe++) {
    const { region: r, blob } = result;
    const absolute = { left: r.left + blob.left, top: r.top + blob.top, width: blob.width, height: blob.height };
    const inner = padRegion(absolute, -PROBE_INSET, width, height);
    if (inner.width < 32 || inner.height < 32) break;
    const alpha = await segment(rgb, width, height, inner);
    const found = largestBlob(alpha, inner.width, inner.height);
    if (!found) break;
    const edge = Math.max(2, Math.round(Math.min(inner.width, inner.height) * 0.02));
    const touchesEdge =
      found.left < edge ||
      found.top < edge ||
      found.left + found.width > inner.width - edge ||
      found.top + found.height > inner.height - edge;
    const share = (found.width * found.height) / (inner.width * inner.height);
    if (touchesEdge || share > PROBE_MAX_SHARE || share < MIN_BLOB_SHARE) break;
    result = { region: inner, alpha, blob: found };
  }

  const { region: r, alpha, blob } = result;
  const keep = padRegion(blob, 0.03, r.width, r.height);
  const full = Buffer.alloc(width * height);
  for (let y = keep.top; y < keep.top + keep.height; y++) {
    for (let x = keep.left; x < keep.left + keep.width; x++) {
      full[(r.top + y) * width + r.left + x] = alpha[y * r.width + x];
    }
  }
  const bounds = { left: r.left + keep.left, top: r.top + keep.top, width: keep.width, height: keep.height };
  return { alpha: full, bounds, blobPx: Math.max(blob.width, blob.height) };
}

// Gems have no reliable neutral reference, so the cast is measured on the (assumed neutral) backdrop only.
function whiteBalanceGains(rgb, alpha, strength) {
  if (strength === 0) return [1, 1, 1];
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0, p = 0; i < alpha.length; i++, p += 3) {
    if (alpha[i] >= ALPHA_BACKGROUND) continue;
    const pr = rgb[p], pg = rgb[p + 1], pb = rgb[p + 2];
    const hi = Math.max(pr, pg, pb), lo = Math.min(pr, pg, pb);
    if (hi > 250 || lo < 40) continue;
    r += pr; g += pg; b += pb; n++;
  }
  if (n < 500) return [1, 1, 1];
  const means = [r / n, g / n, b / n];
  const grey = (means[0] + means[1] + means[2]) / 3;
  return means.map((m) => {
    const delta = (grey / m - 1) * strength;
    return 1 + Math.max(-MAX_WB_GAIN_DELTA, Math.min(MAX_WB_GAIN_DELTA, delta));
  });
}

async function processImage(file, outFile) {
  const work = sharp(file)
    .rotate()
    .resize({ width: WORK_MAX_PX, height: WORK_MAX_PX, fit: "inside", withoutEnlargement: true })
    .toColourspace("srgb")
    .removeAlpha();

  const { data: rgb, info } = await work.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  const gemFound = await findGem(rgb, width, height);
  if (!gemFound || gemFound.bounds.width * gemFound.bounds.height < width * height * 0.0005) {
    return { status: "skipped", note: "no gem detected" };
  }
  const { alpha, bounds, blobPx } = gemFound;

  const gains = whiteBalanceGains(rgb, alpha, wbStrength);
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0, p = 0, q = 0; i < alpha.length; i++, p += 3, q += 4) {
    rgba[q] = Math.min(255, Math.round(rgb[p] * gains[0]));
    rgba[q + 1] = Math.min(255, Math.round(rgb[p + 1] * gains[1]));
    rgba[q + 2] = Math.min(255, Math.round(rgb[p + 2] * gains[2]));
    rgba[q + 3] = alpha[i];
  }

  const inner = Math.round(size * fill);
  const gem = await sharp(rgba, { raw: { width, height, channels: 4 } })
    .extract(bounds)
    .resize({ width: inner, height: inner, fit: "inside" })
    .sharpen({ sigma: 0.6 })
    .png()
    .toBuffer();

  mkdirSync(path.dirname(outFile), { recursive: true });
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: gem, gravity: "center" }])
    .webp({ quality: 90, alphaQuality: 100, effort: 5 })
    .toFile(outFile);

  const notes = [];
  if ((bounds.width * bounds.height) / (width * height) > 0.85) notes.push("subject fills the frame, check the cut-out");
  if (blobPx < inner / 2) notes.push(`gem is only ${blobPx}px in the source, will look soft`);
  return { status: "done", note: notes.join("; ") };
}

async function writeContactSheet(files) {
  if (files.length === 0) return null;
  const rows = Math.ceil(files.length / SHEET_COLS);
  const tiles = await Promise.all(
    files.map(async (file, i) => ({
      input: await sharp(file).resize(SHEET_TILE, SHEET_TILE).png().toBuffer(),
      left: (i % SHEET_COLS) * SHEET_TILE,
      top: Math.floor(i / SHEET_COLS) * SHEET_TILE,
    })),
  );
  const sheet = path.join(outputDir, "_contact-sheet.jpg");
  await sharp({
    create: { width: SHEET_COLS * SHEET_TILE, height: rows * SHEET_TILE, channels: 3, background: SHEET_BG },
  })
    .composite(tiles)
    .jpeg({ quality: 82 })
    .toFile(sheet);
  return sheet;
}

const images = listImages(inputDir);
console.log(`Found ${images.length} images in ${path.relative(process.cwd(), inputDir) || "."}`);

const seen = new Map();
const outputs = [];
const flagged = [];
let done = 0, skipped = 0, duplicates = 0, failed = 0;

for (const [index, file] of images.entries()) {
  const label = `[${index + 1}/${images.length}] ${path.relative(inputDir, file)}`;
  const hash = createHash("sha1").update(readFileSync(file)).digest("hex");
  if (seen.has(hash)) {
    duplicates++;
    console.log(`${label}: duplicate of ${path.relative(inputDir, seen.get(hash))}`);
    continue;
  }
  seen.set(hash, file);

  const outFile = outputPathFor(file);
  if (!values.force && existsSync(outFile) && statSync(outFile).mtimeMs >= statSync(file).mtimeMs) {
    outputs.push(outFile);
    console.log(`${label}: up to date`);
    continue;
  }

  try {
    const { status, note } = await processImage(file, outFile);
    if (status === "done") {
      done++;
      outputs.push(outFile);
      if (note) flagged.push(`${path.relative(process.cwd(), outFile)}: ${note}`);
    } else {
      skipped++;
    }
    console.log(`${label}: ${status}${note ? ` (${note})` : ""}`);
  } catch (error) {
    failed++;
    console.error(`${label}: failed: ${error instanceof Error ? error.message : error}`);
  }
}

const sheet = await writeContactSheet(outputs);

console.log(
  `\nProcessed ${done}, up to date ${outputs.length - done}, skipped ${skipped}, duplicates ${duplicates}, failed ${failed}.`,
);
if (flagged.length) console.log(`\nReview these:\n  ${flagged.join("\n  ")}`);
if (sheet) console.log(`\nContact sheet: ${path.relative(process.cwd(), sheet)}`);
if (failed) process.exitCode = 1;
