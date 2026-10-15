import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve("public");

function getJpegFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getJpegFiles(fullPath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (ext === ".jpg" || ext === ".jpeg") {
        results.push(fullPath);
      }
    }
  }
  return results;
}

async function convertAll() {
  const files = getJpegFiles(PUBLIC_DIR);
  console.log(`Found ${files.length} JPEG files in public directory.`);

  let totalOriginalBytes = 0;
  let totalWebpBytes = 0;
  const conversions = [];

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const parsed = path.parse(filePath);
    const originalExt = parsed.ext;
    const webpPath = path.join(parsed.dir, `${parsed.name}.webp`);

    const originalStat = fs.statSync(filePath);
    const originalBytes = originalStat.size;
    totalOriginalBytes += originalBytes;

    try {
      await sharp(filePath)
        .rotate()
        .webp({ quality: 85, effort: 4 })
        .toFile(webpPath);

      const webpStat = fs.statSync(webpPath);
      const webpBytes = webpStat.size;
      totalWebpBytes += webpBytes;

      // Delete the original file after successful conversion
      fs.unlinkSync(filePath);

      const savedPercent = (((originalBytes - webpBytes) / originalBytes) * 100).toFixed(1);
      const relOriginal = path.relative(PUBLIC_DIR, filePath);
      const relWebp = path.relative(PUBLIC_DIR, webpPath);
      console.log(`[${i + 1}/${files.length}] Converted: ${relOriginal} -> ${relWebp} (${(originalBytes / 1024).toFixed(1)} KB -> ${(webpBytes / 1024).toFixed(1)} KB, saved ${savedPercent}%)`);

      conversions.push({
        original: relOriginal,
        webp: relWebp,
        originalBytes,
        webpBytes,
      });
    } catch (err) {
      console.error(`Failed to convert ${filePath}:`, err);
      process.exit(1);
    }
  }

  const originalMB = (totalOriginalBytes / (1024 * 1024)).toFixed(2);
  const webpMB = (totalWebpBytes / (1024 * 1024)).toFixed(2);
  const savedMB = ((totalOriginalBytes - totalWebpBytes) / (1024 * 1024)).toFixed(2);
  const totalSavedPercent = (((totalOriginalBytes - totalWebpBytes) / totalOriginalBytes) * 100).toFixed(1);

  console.log(`\n================ SUMMARY ================`);
  console.log(`Converted: ${files.length} files`);
  console.log(`Original total size: ${originalMB} MB`);
  console.log(`WebP total size:     ${webpMB} MB`);
  console.log(`Saved:               ${savedMB} MB (${totalSavedPercent}% reduction)`);
  console.log(`=========================================\n`);
}

convertAll().catch((err) => {
  console.error("Fatal error during conversion:", err);
  process.exit(1);
});
