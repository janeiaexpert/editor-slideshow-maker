import { readFileSync, writeFileSync, cpSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const dir = dirname(fileURLToPath(import.meta.url));
const configPath = join(dir, "dist", "config.json");

const config = JSON.parse(readFileSync(configPath, "utf-8"));

console.log("[fix-nitro-vercel] config.json routes:", JSON.stringify(config.routes, null, 2));

writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");

// Generate .vercel/output/ structure for --prebuilt deploy
const outputDir = join(dir, ".vercel", "output");
const fnsDir = join(outputDir, "functions");
const staticDir = join(outputDir, "static");
const serverFuncDir = join(fnsDir, "__server.func");

mkdirSync(serverFuncDir, { recursive: true });
mkdirSync(staticDir, { recursive: true });

// Copy config.json
writeFileSync(join(outputDir, "config.json"), JSON.stringify(config, null, 2) + "\n");
console.log("[fix-nitro-vercel] wrote .vercel/output/config.json");

// Copy dist/server/ → __server.func/
const serverDir = join(dir, "dist", "server");
for (const entry of ["index.mjs", "package.json", ".vc-config.json"]) {
  const src = join(serverDir, entry);
  if (existsSync(src)) {
    writeFileSync(join(serverFuncDir, entry), readFileSync(src));
  }
}
for (const entry of readdirSync(serverDir)) {
  if (entry.endsWith(".mjs") && !["index.mjs"].includes(entry)) {
    writeFileSync(join(serverFuncDir, entry), readFileSync(join(serverDir, entry)));
  }
}
for (const sub of ["_libs", "_ssr", "node_modules"]) {
  const src = join(serverDir, sub);
  if (existsSync(src)) {
    cpSync(src, join(serverFuncDir, sub), { recursive: true });
  }
}
console.log("[fix-nitro-vercel] wrote .vercel/output/functions/__server.func/");

// API routes are no longer needed — save/load now uses localStorage

// Copy dist/client/ → static/
cpSync(join(dir, "dist", "client"), staticDir, { recursive: true });
console.log("[fix-nitro-vercel] wrote .vercel/output/static/");

console.log("[fix-nitro-vercel] DONE — .vercel/output/ is ready for --prebuilt deploy");
