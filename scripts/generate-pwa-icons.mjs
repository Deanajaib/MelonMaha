/**
 * Manual PWA icon generator — NOT part of the build.
 *
 * Rasterizes public/icon-source.svg into the PWA/apple icon PNGs using sharp
 * (a Node library; there is no CLI). Run it by hand after editing the source SVG:
 *
 *   node scripts/generate-pwa-icons.mjs
 *
 * Produces (committed) under public/:
 *   icon-192.png             192x192, transparent (purpose: any)
 *   icon-512.png             512x512, transparent (purpose: any)
 *   icon-maskable-512.png    512x512, opaque #020706, ~20% safe-zone padding (purpose: maskable)
 *   apple-touch-icon.png     180x180, opaque #020706
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC = resolve(ROOT, "public/icon-source.svg");
const OUT = (name) => resolve(ROOT, "public", name);

const BG = { r: 2, g: 7, b: 6, alpha: 1 }; // #020706 opaque

const svg = readFileSync(SRC);

async function render(size) {
  // density scales SVG rasterization so edges stay crisp at the target size.
  return sharp(svg, { density: 512 }).resize(size, size, { fit: "contain" }).png();
}

async function transparentIcon(size, name) {
  await (await render(size)).toFile(OUT(name));
}

async function opaqueIcon(size, name) {
  await (await render(size)).flatten({ background: BG }).toFile(OUT(name));
}

async function maskableIcon(size, name, padRatio = 0.2) {
  const inner = Math.round(size * (1 - padRatio * 2)); // ~20% safe-zone each side
  const pad = Math.round((size - inner) / 2);
  const melon = await sharp(svg, { density: 512 }).resize(inner, inner, { fit: "contain" }).png().toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: BG },
  })
    .composite([{ input: melon, top: pad, left: pad }])
    .png()
    .toFile(OUT(name));
}

await transparentIcon(192, "icon-192.png");
await transparentIcon(512, "icon-512.png");
await maskableIcon(512, "icon-maskable-512.png");
await opaqueIcon(180, "apple-touch-icon.png");

console.log("Generated PWA icons: icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png");
