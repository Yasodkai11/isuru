/**
 * Production HTTP Server for Isuru Gems Next.js Application
 * 
 * Configured for Hostinger Cloud/VPS, LiteSpeed (lsnode), and PM2 deployments.
 * Uses Next.js startServer with pre-compiled standalone configuration to prevent
 * runtime Webpack resolution errors on production environments.
 */

const path = require("path");
const fs = require("fs");

process.env.NODE_ENV = "production";

// Auto-load environment variables from .env.local, .env.production, and .env
const envFiles = [
  path.join(__dirname, ".env.local"),
  path.join(__dirname, ".env.production"),
  path.join(__dirname, ".env"),
];
for (const envFile of envFiles) {
  if (fs.existsSync(envFile)) {
    try {
      const content = fs.readFileSync(envFile, "utf8");
      content.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;
        const equalIdx = trimmed.indexOf("=");
        if (equalIdx > 0) {
          const key = trimmed.slice(0, equalIdx).trim();
          let val = trimmed.slice(equalIdx + 1).trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          if (!(key in process.env)) {
            process.env[key] = val;
          }
        }
      });
    } catch (e) {
      console.warn("> Could not parse env file:", envFile, e);
    }
  }
}

const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

let keepAliveTimeout = parseInt(process.env.KEEP_ALIVE_TIMEOUT || "", 10);
if (Number.isNaN(keepAliveTimeout) || !Number.isFinite(keepAliveTimeout) || keepAliveTimeout < 0) {
  keepAliveTimeout = undefined;
}

const rootDir = path.resolve(__dirname);
const standaloneDir = path.join(rootDir, ".next", "standalone");

// Determine target execution directory:
// 1. If running at project root and .next/standalone exists, delegate to standalone build directory
// 2. If already inside standalone directory (or standard build directory), use current directory
let appDir = rootDir;
if (fs.existsSync(path.join(standaloneDir, ".next", "required-server-files.json"))) {
  appDir = standaloneDir;
}

const reqFilesPath = path.join(appDir, ".next", "required-server-files.json");

if (!fs.existsSync(reqFilesPath)) {
  console.error("> Error: Build output (.next/required-server-files.json) was not found in:", appDir);
  console.error("> Please run 'npm run build' before starting the production server.");
  process.exit(1);
}

// Change working directory to appDir so Next.js locates pages, static assets, and manifests correctly
process.chdir(appDir);

// Load pre-compiled configuration from Next.js build
let nextConfig;
try {
  const requiredFiles = JSON.parse(fs.readFileSync(reqFilesPath, "utf8"));
  nextConfig = requiredFiles.config;
} catch (err) {
  console.error("> Error parsing required-server-files.json:", err);
  process.exit(1);
}

// CRITICAL FIX: Next.js checks __NEXT_PRIVATE_STANDALONE_CONFIG to avoid calling loadWebpackHook()
// at runtime. In standalone builds, webpack is omitted because it is only needed at compile time.
process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(nextConfig);

require("next");
const { startServer } = require("next/dist/server/lib/start-server");

startServer({
  dir: appDir,
  isDev: false,
  config: nextConfig,
  hostname,
  port,
  allowRetry: false,
  keepAliveTimeout,
})
  .then(() => {
    console.log(`> Isuru Gems production server listening on http://${hostname}:${port}`);
  })
  .catch((err) => {
    console.error("> Failed to start Next.js production server:", err);
    process.exit(1);
  });

