import fs from "fs";
import path from "path";
import zlib from "zlib";

// CRC32 table for PNG chunks
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const len = data ? data.length : 0;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  typeBuf.copy(chunk, 4);
  if (data) data.copy(chunk, 8);
  const toCrc = Buffer.concat([typeBuf, data || Buffer.alloc(0)]);
  chunk.writeUInt32BE(crc32(toCrc), 8 + len);
  return chunk;
}

function encodeRgbPng(width, height, getPixelRgb, dpi = 300) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bit per channel
  ihdrData[9] = 2; // Color type 2: RGB
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // No interlace
  const ihdrChunk = makeChunk("IHDR", ihdrData);

  // pHYs (DPI metadata: 300 DPI = 11811 pixels/meter)
  const ppm = Math.round((dpi / 25.4) * 1000);
  const physData = Buffer.alloc(9);
  physData.writeUInt32BE(ppm, 0);
  physData.writeUInt32BE(ppm, 4);
  physData[8] = 1; // unit: meter
  const physChunk = makeChunk("pHYs", physData);

  // Raw Scanlines (Filter byte 0 + width * 3 RGB bytes per line)
  const rowBytes = 1 + width * 3;
  const rawData = Buffer.alloc(height * rowBytes);

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const rgb = getPixelRgb(x, y);
      rawData[offset++] = rgb[0];
      rawData[offset++] = rgb[1];
      rawData[offset++] = rgb[2];
    }
  }

  const compressedData = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = makeChunk("IDAT", compressedData);
  const iendChunk = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, physChunk, idatChunk, iendChunk]);
}

// Load QR engine
const qrcodeCode = fs.readFileSync("scripts/lib/qrcode-lib.cjs", "utf8");
const fn = new Function("module", "exports", qrcodeCode + "; return module.exports;");
const qrcode = fn({}, {});

const TARGET_URL = "https://isuruceylon.com";
const OUTPUT_DIR = "public/qr";

const qr = qrcode(0, "H");
qr.addData(TARGET_URL);
qr.make();
const moduleCount = qr.getModuleCount();

console.log("Encoding PNGs for:", TARGET_URL);

// 1. Classic High-Res Print PNG (3000 x 3000 px, 300 DPI)
const TARGET_RES = 3000;
const marginModules = 4;
const totalModules = moduleCount + marginModules * 2;
const cellSize = TARGET_RES / totalModules;

const classicPng = encodeRgbPng(TARGET_RES, TARGET_RES, (x, y) => {
  const col = Math.floor(x / cellSize) - marginModules;
  const row = Math.floor(y / cellSize) - marginModules;
  if (row >= 0 && row < moduleCount && col >= 0 && col < moduleCount) {
    if (qr.isDark(row, col)) {
      return [10, 14, 23]; // Deep obsidian black #0A0E17
    }
  }
  return [255, 255, 255]; // Crisp white background
}, 300);

const classicPath = path.join(OUTPUT_DIR, "isuru-ceylon-qr-classic-3000px.png");
fs.writeFileSync(classicPath, classicPng);
console.log(`Wrote ${classicPath} (${(classicPng.length / 1024).toFixed(1)} KB, 3000x3000px, 300 DPI)`);

// 2. Classic Standard Digital PNG (1200 x 1200 px)
const DIGITAL_RES = 1200;
const cellDigital = DIGITAL_RES / totalModules;
const digitalPng = encodeRgbPng(DIGITAL_RES, DIGITAL_RES, (x, y) => {
  const col = Math.floor(x / cellDigital) - marginModules;
  const row = Math.floor(y / cellDigital) - marginModules;
  if (row >= 0 && row < moduleCount && col >= 0 && col < moduleCount) {
    if (qr.isDark(row, col)) {
      return [10, 14, 23];
    }
  }
  return [255, 255, 255];
}, 72);

const digitalPath = path.join(OUTPUT_DIR, "isuru-ceylon-qr-classic-1200px.png");
fs.writeFileSync(digitalPath, digitalPng);
console.log(`Wrote ${digitalPath} (${(digitalPng.length / 1024).toFixed(1)} KB, 1200x1200px)`);

// 3. Luxury Gold & Obsidian PNG (2400 x 2400 px, 300 DPI)
const LUX_RES = 2400;
const luxMargin = 4;
const luxTotal = moduleCount + luxMargin * 2;
const luxCell = LUX_RES / luxTotal;

const luxuryPng = encodeRgbPng(LUX_RES, LUX_RES, (x, y) => {
  const col = Math.floor(x / luxCell) - luxMargin;
  const row = Math.floor(y / luxCell) - luxMargin;
  
  // Outer subtle margin border
  const borderThick = 24;
  if (x < borderThick || x >= LUX_RES - borderThick || y < borderThick || y >= LUX_RES - borderThick) {
    return [212, 175, 55]; // Gold accent border
  }

  if (row >= 0 && row < moduleCount && col >= 0 && col < moduleCount) {
    if (qr.isDark(row, col)) {
      // Gold metallic gradient modulation
      const gradFactor = 0.8 + 0.3 * ((x + y) / (2 * LUX_RES));
      return [
        Math.min(255, Math.floor(212 * gradFactor)),
        Math.min(255, Math.floor(175 * gradFactor)),
        Math.min(255, Math.floor(55 * gradFactor))
      ];
    }
  }
  // Deep obsidian navy background #080C14
  return [8, 12, 20];
}, 300);

const luxPath = path.join(OUTPUT_DIR, "isuru-ceylon-qr-luxury-2400px.png");
fs.writeFileSync(luxPath, luxuryPng);
console.log(`Wrote ${luxPath} (${(luxuryPng.length / 1024).toFixed(1)} KB, 2400x2400px, 300 DPI)`);
