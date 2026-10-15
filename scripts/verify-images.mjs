import fs from "node:fs";
import path from "node:path";

function checkDir(dir) {
  let missing = [];
  let checked = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const res = checkDir(full);
      missing.push(...res.missing);
      checked += res.checked;
    } else if (/\.(ts|tsx|mjs)$/.test(entry.name)) {
      const content = fs.readFileSync(full, "utf8");
      const matches = content.matchAll(/["'`]((\/(?:isuru_images|images)\/[^"'`]+))["'`]/g);
      for (const m of matches) {
        checked++;
        const rawUrl = m[1];
        const urlPath = decodeURIComponent(rawUrl);
        const filePath = path.join("public", urlPath.replace(/^\//, ""));
        if (!fs.existsSync(filePath)) {
          missing.push({ file: full, ref: rawUrl, target: filePath });
        }
      }
    }
  }
  return { missing, checked };
}

const { missing, checked } = checkDir("src");
console.log(`Checked references: ${checked}`);
if (missing.length === 0) {
  console.log("SUCCESS: All image references verified successfully! No 404s.");
} else {
  console.error("Missing files found:", missing);
  process.exit(1);
}
