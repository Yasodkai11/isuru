import sharp from 'sharp';

async function processLogo() {
  const img = sharp('public/new-logo.jpeg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  const minX = 144;
  const maxX = 1469;
  const minY = 207;
  const maxY = 584;

  const pad = 24;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(info.width - cropX, (maxX - minX + 1) + pad * 2);
  const cropH = Math.min(info.height - cropY, (maxY - minY + 1) + pad * 2);

  // 1. Create transparent version for light backgrounds (Navy + Gold)
  const rgbaLight = Buffer.alloc(cropW * cropH * 4);
  const rgbaDark = Buffer.alloc(cropW * cropH * 4); // For dark backgrounds: ivory/gold text

  for (let cy = 0; cy < cropH; cy++) {
    for (let cx = 0; cx < cropW; cx++) {
      const origX = cropX + cx;
      const origY = cropY + cy;
      const srcIdx = (origY * info.width + origX) * 3;
      const dstIdx = (cy * cropW + cx) * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      const distFromWhite = Math.max(255 - r, 255 - g, 255 - b);

      if (distFromWhite <= 3) {
        rgbaLight[dstIdx] = 0;
        rgbaLight[dstIdx + 1] = 0;
        rgbaLight[dstIdx + 2] = 0;
        rgbaLight[dstIdx + 3] = 0;

        rgbaDark[dstIdx] = 0;
        rgbaDark[dstIdx + 1] = 0;
        rgbaDark[dstIdx + 2] = 0;
        rgbaDark[dstIdx + 3] = 0;
      } else {
        let alpha = 1.0;
        if (distFromWhite < 40) {
          alpha = Math.min(1.0, Math.pow(distFromWhite / 40, 1.1));
        }

        const fgR = Math.max(0, Math.min(255, Math.round((r - (1 - alpha) * 255) / Math.max(alpha, 0.05))));
        const fgG = Math.max(0, Math.min(255, Math.round((g - (1 - alpha) * 255) / Math.max(alpha, 0.05))));
        const fgB = Math.max(0, Math.min(255, Math.round((b - (1 - alpha) * 255) / Math.max(alpha, 0.05))));

        rgbaLight[dstIdx] = fgR;
        rgbaLight[dstIdx + 1] = fgG;
        rgbaLight[dstIdx + 2] = fgB;
        rgbaLight[dstIdx + 3] = Math.round(alpha * 255);

        // For Dark backgrounds:
        // Gold check: gold/champagne diamond and GEMS have strong red/green and lower blue
        const isGold = (fgR > fgB + 25) && (fgG > fgB + 5);
        if (isGold) {
          rgbaDark[dstIdx] = Math.min(255, Math.round(fgR * 1.08));
          rgbaDark[dstIdx + 1] = Math.min(255, Math.round(fgG * 1.05));
          rgbaDark[dstIdx + 2] = fgB;
          rgbaDark[dstIdx + 3] = Math.round(alpha * 255);
        } else {
          // Navy text -> Convert to elegant luminous ivory/warm cream (#FAF6EE)
          rgbaDark[dstIdx] = 250;
          rgbaDark[dstIdx + 1] = 246;
          rgbaDark[dstIdx + 2] = 238;
          rgbaDark[dstIdx + 3] = Math.round(alpha * 255);
        }
      }
    }
  }

  // Save the full logos in webp and png
  await sharp(rgbaLight, { raw: { width: cropW, height: cropH, channels: 4 } })
    .webp({ quality: 95, effort: 6 })
    .toFile('public/isuru_images/logo-isuru.webp');

  await sharp(rgbaLight, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile('public/isuru_images/logo-isuru.png');

  await sharp(rgbaDark, { raw: { width: cropW, height: cropH, channels: 4 } })
    .webp({ quality: 95, effort: 6 })
    .toFile('public/isuru_images/logo-isuru-light.webp');

  await sharp(rgbaDark, { raw: { width: cropW, height: cropH, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile('public/isuru_images/logo-isuru-light.png');

  console.log(`Generated logo-isuru.webp and logo-isuru-light.webp (${cropW}x${cropH})`);

  // Diamond Gem symbol:
  // Isolate ONLY the diamond (excluding any blue pixels of the 'I' serif)
  let gemMinX = info.width, gemMaxX = 0, gemMinY = info.height, gemMaxY = 0;
  for (let y = 207; y <= 276; y++) {
    for (let x = 144; x <= 236; x++) {
      const idx = (y * info.width + x) * 3;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const dist = Math.max(255 - r, 255 - g, 255 - b);
      // Pure gold/bronze/champagne: r must be distinctly greater than b
      const isGemPixel = dist > 8 && (r > b + 15);
      if (isGemPixel) {
        if (x < gemMinX) gemMinX = x;
        if (x > gemMaxX) gemMaxX = x;
        if (y < gemMinY) gemMinY = y;
        if (y > gemMaxY) gemMaxY = y;
      }
    }
  }

  console.log(`Pure gem bounds: (${gemMinX}, ${gemMinY}) to (${gemMaxX}, ${gemMaxY})`);
  const gW = gemMaxX - gemMinX + 1;
  const gH = gemMaxY - gemMinY + 1;
  const gSize = Math.max(gW, gH) + 20;

  const gemSquare = Buffer.alloc(gSize * gSize * 4);
  const offsetX = Math.round((gSize - gW) / 2);
  const offsetY = Math.round((gSize - gH) / 2);

  for (let gy = 0; gy < gH; gy++) {
    for (let gx = 0; gx < gW; gx++) {
      const srcX = gemMinX + gx;
      const srcY = gemMinY + gy;
      const srcIdx = (srcY * info.width + srcX) * 3;
      const dstIdx = ((gy + offsetY) * gSize + (gx + offsetX)) * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      const dist = Math.max(255 - r, 255 - g, 255 - b);
      const isGemPixel = dist > 3 && (r > b + 10);
      if (isGemPixel) {
        let alpha = 1.0;
        if (dist < 35) {
          alpha = Math.min(1.0, Math.pow(dist / 35, 1.1));
        }
        const fgR = Math.max(0, Math.min(255, Math.round((r - (1 - alpha) * 255) / Math.max(alpha, 0.05))));
        const fgG = Math.max(0, Math.min(255, Math.round((g - (1 - alpha) * 255) / Math.max(alpha, 0.05))));
        const fgB = Math.max(0, Math.min(255, Math.round((b - (1 - alpha) * 255) / Math.max(alpha, 0.05))));

        gemSquare[dstIdx] = fgR;
        gemSquare[dstIdx + 1] = fgG;
        gemSquare[dstIdx + 2] = fgB;
        gemSquare[dstIdx + 3] = Math.round(alpha * 255);
      }
    }
  }

  // Save symbol
  await sharp(gemSquare, { raw: { width: gSize, height: gSize, channels: 4 } })
    .webp({ quality: 95, effort: 6 })
    .toFile('public/isuru_images/logo-isuru-symbol.webp');

  await sharp(gemSquare, { raw: { width: gSize, height: gSize, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile('public/isuru_images/logo-isuru-symbol.png');

  // Also generate 512x512 icon.png, 180x180 apple-icon.png, and favicon.ico
  // High resolution square icon with subtle elegant padding
  const highResSize = 512;
  const highResIcon = await sharp(gemSquare, { raw: { width: gSize, height: gSize, channels: 4 } })
    .resize(Math.round(highResSize * 0.85), Math.round(highResSize * 0.85), { fit: 'contain' })
    .extend({
      top: Math.round(highResSize * 0.075),
      bottom: Math.round(highResSize * 0.075),
      left: Math.round(highResSize * 0.075),
      right: Math.round(highResSize * 0.075),
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();

  await sharp(highResIcon).toFile('public/icon.png');
  await sharp(highResIcon).toFile('src/app/icon.png');

  const appleIcon = await sharp(gemSquare, { raw: { width: gSize, height: gSize, channels: 4 } })
    .resize(150, 150, { fit: 'contain' })
    .extend({
      top: 15,
      bottom: 15,
      left: 15,
      right: 15,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();

  await sharp(appleIcon).toFile('public/apple-icon.png');
  await sharp(appleIcon).toFile('src/app/apple-icon.png');

  // Favicon (48x48)
  const favIconBmp = await sharp(gemSquare, { raw: { width: gSize, height: gSize, channels: 4 } })
    .resize(48, 48, { fit: 'contain' })
    .png()
    .toBuffer();
  // We can write it as favicon.ico or png-based ico
  await sharp(favIconBmp).toFile('public/favicon.ico');
  await sharp(favIconBmp).toFile('src/app/favicon.ico');

  console.log(`Generated pure diamond symbol and updated app icons successfully!`);
}

processLogo().catch(console.error);
