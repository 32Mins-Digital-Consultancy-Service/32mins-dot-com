/**
 * One-off/maintenance asset optimizer: converts heavy PNG/JPG assets to
 * appropriately-sized WebP. Safe to re-run — it only writes new .webp files
 * (or *.opt.webp for in-place candidates) and never deletes anything.
 *
 *   node scripts/optimize-images.mjs [texturesDir]
 */
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEX = process.argv[2];

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;

async function convert(src, dest, { width, quality = 80 } = {}) {
  if (!existsSync(src)) {
    console.log(`skip (missing): ${src}`);
    return;
  }
  const before = (await stat(src)).size;
  let p = sharp(src);
  if (width) p = p.resize({ width, withoutEnlargement: true });
  await p.webp({ quality, effort: 5 }).toFile(dest);
  const after = (await stat(dest)).size;
  console.log(
    `${path.relative(ROOT, src)} ${kb(before)} -> ${path.relative(ROOT, dest)} ${kb(after)}`,
  );
}

// --- Globe textures (source files downloaded separately) ---
if (TEX) {
  await convert(`${TEX}/earth-blue-marble.jpg`, `${ROOT}/public/textures/earth-day.webp`, { width: 2048, quality: 80 });
  await convert(`${TEX}/earth_clouds.png`, `${ROOT}/public/textures/earth-clouds.webp`, { quality: 78 });
  await convert(`${TEX}/earth-topology.png`, `${ROOT}/public/textures/earth-bump.webp`, { width: 1024, quality: 70 });
}

// --- Sneak peek images (4096x2913 sources -> 1200w) ---
for (let i = 1; i <= 4; i++) {
  await convert(`${ROOT}/src/assets/SneakPeak_image${i}.png`, `${ROOT}/src/assets/SneakPeak_image${i}.webp`, { width: 1200, quality: 78 });
}

// --- Project covers + device mockup (small dims, heavy PNG) ---
for (const name of ["chai_cover", "DigiViscom_cover", "IITMPTF_cover", "nmicps_cover", "rajen_dental_cover", "ShaktiDB_cover", "device"]) {
  await convert(`${ROOT}/src/assets/${name}.png`, `${ROOT}/src/assets/${name}.webp`, { quality: 85 });
}

// --- Brochure spreads ---
await convert(`${ROOT}/public/Outer_Spread.png`, `${ROOT}/public/Outer_Spread.webp`, { width: 2200, quality: 85 });
await convert(`${ROOT}/public/Inner_Spread.png`, `${ROOT}/public/Inner_Spread.webp`, { width: 2200, quality: 85 });

// --- Globe popover logos ---
for (const name of ["GeM", "SI"]) {
  await convert(`${ROOT}/public/${name}.png`, `${ROOT}/public/${name}.webp`, { width: 360, quality: 85 });
}

// --- Oversized existing webp (marquee logos show at ~150px) -> *.opt.webp ---
for (const [file, width] of [
  ["shaktidb.webp", 400],
  ["thsti.webp", 400],
  ["iitmadras.webp", 400],
  ["image1.webp", 900],
  ["image2.webp", 900],
  ["ape.webp", 1200],
]) {
  const src = `${ROOT}/public/${file}`;
  if (!existsSync(src)) continue;
  await convert(src, src.replace(/\.webp$/, ".opt.webp"), { width, quality: 80 });
}

// --- Employee photos -> 640w webp ---
const empDir = `${ROOT}/public/32mins_emp`;
for (const f of await readdir(empDir)) {
  if (!/\.(jpe?g)$/i.test(f)) continue;
  await convert(`${empDir}/${f}`, `${empDir}/${f.replace(/\.(jpe?g)$/i, ".webp")}`, { width: 640, quality: 80 });
}

console.log("done");
