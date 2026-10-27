import fs from "fs";
import path from "path";

// Load qrcode generator from lib
const qrcodeCode = fs.readFileSync("scripts/lib/qrcode-lib.cjs", "utf8");
const fn = new Function("module", "exports", qrcodeCode + "; return module.exports;");
const qrcode = fn({}, {});

const TARGET_URL = "https://isuruceylon.com";
const OUTPUT_DIR = "public/qr";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generate QR Code with Level H error correction (allows up to 30% center emblem occlusion)
const qr = qrcode(0, "H");
qr.addData(TARGET_URL);
qr.make();

const moduleCount = qr.getModuleCount();
console.log(`Generated QR matrix: ${moduleCount}x${moduleCount} modules with ECC Level H`);

// 1. Classic High-Contrast Vector SVG (for standard print, business card backs, receipts)
function generateClassicSvg() {
  const cellSize = 10;
  const margin = 4; // Quiet zone in modules
  const totalModules = moduleCount + margin * 2;
  const size = totalModules * cellSize;

  let paths = "";
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (qr.isDark(r, c)) {
        const x = (c + margin) * cellSize;
        const y = (r + margin) * cellSize;
        paths += `M${x},${y}h${cellSize}v${cellSize}h-${cellSize}z `;
      }
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="100%" height="100%" fill="#FFFFFF"/>
  <path d="${paths.trim()}" fill="#0A0E17"/>
</svg>`;
}

// 2. Luxury Gold & Sapphire Edition SVG
function generateLuxurySvg() {
  const cellSize = 12;
  const margin = 5;
  const totalModules = moduleCount + margin * 2;
  const size = totalModules * cellSize;
  
  // Calculate center emblem bounding box (approx 20% of area in the center)
  const centerModuleRadius = 3;
  const centerStart = Math.floor(moduleCount / 2) - centerModuleRadius;
  const centerEnd = Math.floor(moduleCount / 2) + centerModuleRadius;

  let modulePaths = "";
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      // Check if module is within center emblem region
      if (r >= centerStart && r <= centerEnd && c >= centerStart && c <= centerEnd) {
        continue; // Leave clean room for luxury gem crest
      }

      if (qr.isDark(r, c)) {
        const x = (c + margin) * cellSize;
        const y = (r + margin) * cellSize;
        
        // Check if inside finder patterns (top-left, top-right, bottom-left 7x7 areas)
        const isFinder = (r < 7 && c < 7) || (r < 7 && c >= moduleCount - 7) || (r >= moduleCount - 7 && c < 7);
        
        if (isFinder) {
          // Sharp precision for finder eyes
          modulePaths += `M${x},${y}h${cellSize}v${cellSize}h-${cellSize}z `;
        } else {
          // Subtle soft corners for modern luxury aesthetic
          const radius = 2;
          modulePaths += `M${x + radius},${y} h${cellSize - 2 * radius} a${radius},${radius} 0 0 1 ${radius},${radius} v${cellSize - 2 * radius} a${radius},${radius} 0 0 1 -${radius},${radius} h-${cellSize - 2 * radius} a${radius},${radius} 0 0 1 -${radius},-${radius} v-${cellSize - 2 * radius} a${radius},${radius} 0 0 1 ${radius},-${radius} z `;
        }
      }
    }
  }

  // Load logo symbol base64 if available
  let logoSymbolBase64 = "";
  try {
    const symbolBuf = fs.readFileSync("public/isuru_images/logo-isuru-symbol.png");
    logoSymbolBase64 = `data:image/png;base64,${symbolBuf.toString("base64")}`;
  } catch (e) {
    console.warn("Could not read logo symbol:", e.message);
  }

  const centerPixelX = (margin + moduleCount / 2) * cellSize;
  const centerPixelY = (margin + moduleCount / 2) * cellSize;
  const badgeRadius = (centerModuleRadius + 1.2) * cellSize;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="luxBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0E1626"/>
      <stop offset="100%" stop-color="#060911"/>
    </radialGradient>
    
    <!-- Gold Metallic Gradients -->
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5C77A"/>
      <stop offset="50%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#AA8224"/>
    </linearGradient>

    <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F3DC9B"/>
      <stop offset="35%" stop-color="#D4AF37"/>
      <stop offset="70%" stop-color="#8C6618"/>
      <stop offset="100%" stop-color="#E5C77A"/>
    </linearGradient>

    <!-- Drop Shadow for Center Emblem -->
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <!-- Deep Obsidian Canvas -->
  <rect width="100%" height="100%" fill="url(#luxBg)" rx="24"/>
  
  <!-- Outer Gold Border -->
  <rect x="8" y="8" width="${size - 16}" height="${size - 16}" rx="18" fill="none" stroke="url(#goldBorder)" stroke-width="1.5" stroke-opacity="0.6"/>

  <!-- QR Modules in Warm Gold -->
  <path d="${modulePaths.trim()}" fill="url(#goldGradient)"/>

  <!-- Center Luxury Crest Emblem -->
  <g filter="url(#shadow)">
    <!-- Center Badge Circular Card -->
    <circle cx="${centerPixelX}" cy="${centerPixelY}" r="${badgeRadius}" fill="#0A0E17" stroke="url(#goldBorder)" stroke-width="2"/>
    <circle cx="${centerPixelX}" cy="${centerPixelY}" r="${badgeRadius - 3.5}" fill="none" stroke="#D4AF37" stroke-width="0.75" stroke-opacity="0.5"/>
    
    ${logoSymbolBase64 ? `
    <!-- Branded Isuru Logo Symbol -->
    <image 
      href="${logoSymbolBase64}" 
      x="${centerPixelX - badgeRadius * 0.65}" 
      y="${centerPixelY - badgeRadius * 0.65}" 
      width="${badgeRadius * 1.3}" 
      height="${badgeRadius * 1.3}" 
      preserveAspectRatio="xMidYMid meet"
    />
    ` : `
    <!-- Fallback Gemstone Facet SVG -->
    <polygon points="${centerPixelX},${centerPixelY - badgeRadius * 0.55} ${centerPixelX + badgeRadius * 0.55},${centerPixelY} ${centerPixelX},${centerPixelY + badgeRadius * 0.55} ${centerPixelX - badgeRadius * 0.55},${centerPixelY}" fill="url(#goldGradient)"/>
    `}
  </g>
</svg>`;
}

// 3. Complete Branded Luxury Display Card (800 x 1120 px)
function generateDisplayCardSvg() {
  const cardWidth = 800;
  const cardHeight = 1120;
  
  // High contrast QR code inside the card
  const qrCellSize = 8.5;
  const qrMargin = 3;
  const qrTotalModules = moduleCount + qrMargin * 2;
  const qrPixelSize = qrTotalModules * qrCellSize;

  let qrPaths = "";
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (qr.isDark(r, c)) {
        const x = (c + qrMargin) * qrCellSize;
        const y = (r + qrMargin) * qrCellSize;
        qrPaths += `M${x},${y}h${qrCellSize}v${qrCellSize}h-${qrCellSize}z `;
      }
    }
  }

  const qrBoxX = (cardWidth - qrPixelSize) / 2;
  const qrBoxY = 430;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cardWidth} ${cardHeight}" width="${cardWidth}" height="${cardHeight}">
  <defs>
    <radialGradient id="cardBg" cx="50%" cy="35%" r="80%">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="60%" stop-color="#080C14"/>
      <stop offset="100%" stop-color="#030508"/>
    </radialGradient>

    <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F2DFAB"/>
      <stop offset="50%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#AA8224"/>
    </linearGradient>

    <linearGradient id="goldBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="25%" stop-color="#8C6618"/>
      <stop offset="50%" stop-color="#F5E4B5"/>
      <stop offset="75%" stop-color="#8C6618"/>
      <stop offset="100%" stop-color="#D4AF37"/>
    </linearGradient>

    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#000000" flood-opacity="0.9"/>
    </filter>

    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#cardBg)"/>

  <!-- Ornate Luxury Borders -->
  <rect x="24" y="24" width="${cardWidth - 48}" height="${cardHeight - 48}" fill="none" stroke="url(#goldBorderGrad)" stroke-width="2" rx="4"/>
  <rect x="34" y="34" width="${cardWidth - 68}" height="${cardHeight - 68}" fill="none" stroke="#D4AF37" stroke-width="0.75" stroke-opacity="0.4" rx="2"/>

  <!-- Corner Flourishes -->
  <g stroke="url(#goldText)" stroke-width="1.5" fill="none">
    <path d="M 45 65 L 45 45 L 65 45" />
    <circle cx="45" cy="45" r="3" fill="#D4AF37"/>
    <path d="M ${cardWidth - 45} 65 L ${cardWidth - 45} 45 L ${cardWidth - 65} 45" />
    <circle cx="${cardWidth - 45}" cy="45" r="3" fill="#D4AF37"/>
    <path d="M 45 ${cardHeight - 65} L 45 ${cardHeight - 45} L 65 ${cardHeight - 45}" />
    <circle cx="45" cy="${cardHeight - 45}" r="3" fill="#D4AF37"/>
    <path d="M ${cardWidth - 45} ${cardHeight - 65} L ${cardWidth - 45} ${cardHeight - 45} L ${cardWidth - 65} ${cardHeight - 45}" />
    <circle cx="${cardWidth - 45}" cy="${cardHeight - 45}" r="3" fill="#D4AF37"/>
  </g>

  <!-- Gemstone Crown Icon Top Center -->
  <g transform="translate(${cardWidth / 2}, 110)">
    <polygon points="0,-24 20,-8 14,18 -14,18 -20,-8" fill="url(#goldText)"/>
    <polygon points="0,-16 12,-4 8,12 -8,12 -12,-4" fill="#0E1626"/>
    <circle cx="0" cy="0" r="3" fill="#D4AF37"/>
  </g>

  <!-- Brand Typography -->
  <text x="${cardWidth / 2}" y="180" font-family="'Cinzel', 'Playfair Display', 'Georgia', serif" font-size="34" font-weight="700" letter-spacing="8" fill="url(#goldText)" text-anchor="middle">ISURU CEYLON</text>
  <text x="${cardWidth / 2}" y="215" font-family="'Montserrat', 'Inter', 'Helvetica Neue', sans-serif" font-size="13" font-weight="600" letter-spacing="6" fill="#D4AF37" fill-opacity="0.85" text-anchor="middle">PRECIOUS GEMSTONES • RATNAPURA</text>

  <!-- Divider Line with Diamond -->
  <g transform="translate(${cardWidth / 2}, 245)">
    <line x1="-140" y1="0" x2="-25" y2="0" stroke="url(#goldBorderGrad)" stroke-width="1"/>
    <polygon points="0,-5 5,0 0,5 -5,0" fill="#D4AF37"/>
    <line x1="25" y1="0" x2="140" y2="0" stroke="url(#goldBorderGrad)" stroke-width="1"/>
  </g>

  <!-- Subtitle Heritage & Accreditation -->
  <text x="${cardWidth / 2}" y="295" font-family="'Cinzel', 'Georgia', serif" font-size="16" letter-spacing="3" fill="#E5E7EB" text-anchor="middle">AUTHENTIC UNHEATED CEYLON SAPPHIRES</text>
  <text x="${cardWidth / 2}" y="325" font-family="'Inter', sans-serif" font-size="12" letter-spacing="2" fill="#9CA3AF" text-anchor="middle">ESTABLISHED 1920 • RATNAPURA GEM REGION</text>
  <text x="${cardWidth / 2}" y="350" font-family="'Inter', sans-serif" font-size="11" letter-spacing="1.5" fill="#D4AF37" fill-opacity="0.9" text-anchor="middle">NGJA DEALER REGISTRATION: 202610DL42288</text>

  <!-- QR Code Framing Container -->
  <g filter="url(#cardShadow)">
    <!-- White Plaque for 100% Guaranteed High-Contrast Camera Scan -->
    <rect x="${qrBoxX - 16}" y="${qrBoxY - 16}" width="${qrPixelSize + 32}" height="${qrPixelSize + 32}" fill="#FFFFFF" rx="16" stroke="url(#goldBorderGrad)" stroke-width="3"/>
    
    <!-- QR Code Data Modules -->
    <g transform="translate(${qrBoxX}, ${qrBoxY})">
      <path d="${qrPaths.trim()}" fill="#080C14"/>
    </g>
  </g>

  <!-- Instructions & Call to Action -->
  <text x="${cardWidth / 2}" y="820" font-family="'Cinzel', 'Georgia', serif" font-size="18" font-weight="600" letter-spacing="3" fill="url(#goldText)" text-anchor="middle">SCAN WITH CAMERA</text>
  <text x="${cardWidth / 2}" y="855" font-family="'Inter', sans-serif" font-size="13.5" letter-spacing="1" fill="#D1D5DB" text-anchor="middle">Explore Natural Ceylon Sapphires, Rubies &amp; Rare Spinels</text>
  <text x="${cardWidth / 2}" y="880" font-family="'Inter', sans-serif" font-size="12" letter-spacing="0.5" fill="#9CA3AF" text-anchor="middle">Certified with GIA, GRS &amp; NGJA Authenticity Reports</text>

  <!-- Luxury Pill with Website Domain -->
  <g transform="translate(${cardWidth / 2}, 940)">
    <rect x="-180" y="-22" width="360" height="44" rx="22" fill="#111827" stroke="url(#goldBorderGrad)" stroke-width="1.5"/>
    <text x="0" y="7" font-family="'Inter', monospace" font-size="15" font-weight="700" letter-spacing="3" fill="#FFFFFF" text-anchor="middle">ISURUCEYLON.COM</text>
  </g>

  <!-- Bottom Certificate Guarantee -->
  <text x="${cardWidth / 2}" y="1035" font-family="'Inter', sans-serif" font-size="11" letter-spacing="2" fill="#6B7280" text-anchor="middle">RATNAPURA MINING HERITAGE • DIRECT MINE-TO-MARKET PURITY</text>
</svg>`;
}

// Write files
const classicSvg = generateClassicSvg();
fs.writeFileSync(path.join(OUTPUT_DIR, "isuru-ceylon-qr-classic.svg"), classicSvg);
console.log("Wrote isuru-ceylon-qr-classic.svg");

const luxurySvg = generateLuxurySvg();
fs.writeFileSync(path.join(OUTPUT_DIR, "isuru-ceylon-qr-luxury.svg"), luxurySvg);
console.log("Wrote isuru-ceylon-qr-luxury.svg");

const displayCardSvg = generateDisplayCardSvg();
fs.writeFileSync(path.join(OUTPUT_DIR, "isuru-ceylon-qr-display-card.svg"), displayCardSvg);
console.log("Wrote isuru-ceylon-qr-display-card.svg");

console.log("All QR vector SVG assets successfully generated in public/qr!");
