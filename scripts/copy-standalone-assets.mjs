import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";

const standaloneDir = ".next/standalone";

if (!existsSync(standaloneDir)) {
  console.error(`${standaloneDir} not found. Run "next build" with output: "standalone" first.`);
  process.exit(1);
}

// 1. Copy public static assets and .next/static bundle
cpSync("public", `${standaloneDir}/public`, { recursive: true });
cpSync(".next/static", `${standaloneDir}/.next/static`, { recursive: true });

// 2. Copy deployment helpers
const filesToCopy = [
  ".env.example",
  "ecosystem.config.cjs",
  "server.js",
  ".htaccess.example",
  "HOSTINGER_DEPLOYMENT_GUIDE.md",
];

for (const file of filesToCopy) {
  if (existsSync(file)) {
    cpSync(file, `${standaloneDir}/${file}`);
  }
}

// 3. Ensure package.json inside standalone uses "next build" for build step and "node server.js" for serve
const pkgPath = `${standaloneDir}/package.json`;
if (existsSync(pkgPath)) {
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    pkg.scripts = {
      start: "next build",
      serve: "node server.js",
    };
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not patch standalone package.json scripts:", err.message);
  }
}

console.log("Successfully prepared .next/standalone/ for Hostinger deployment!");
