import { cpSync, existsSync } from "node:fs";

const standaloneDir = ".next/standalone";

if (!existsSync(standaloneDir)) {
  console.error(`${standaloneDir} not found. Run "next build" with output: "standalone" first.`);
  process.exit(1);
}

cpSync("public", `${standaloneDir}/public`, { recursive: true });
cpSync(".next/static", `${standaloneDir}/.next/static`, { recursive: true });

console.log("Copied public/ and .next/static/ into .next/standalone/");
