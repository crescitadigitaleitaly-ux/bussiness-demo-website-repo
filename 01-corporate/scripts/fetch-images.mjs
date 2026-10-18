// Downloads the Unsplash photos listed in scripts/images.json, crops each to its slot size and
// writes public/images/<slot>.jpg plus CREDITS.md. Slots left empty keep their placeholder.
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";

const sizes = { hero: [1600, 2000], cta: [2000, 1100], about: [2000, 1300], og: [1200, 630] };
const size = (slot) =>
  sizes[slot] ??
  (slot.startsWith("team") ? [800, 1000] : slot.startsWith("service") ? [800, 600] : slot.startsWith("project") ? [1800, 1125] : [1600, 1000]);
const manifest = JSON.parse(readFileSync(new URL("./images.json", import.meta.url)));
const credits = ["# Image credits", "", "Photos from Unsplash, used under the Unsplash License (https://unsplash.com/license).", ""];

for (const [slot, id] of Object.entries(manifest)) {
  if (slot.startsWith("_") || !id) continue;
  const [w, h] = size(slot);
  const src = `https://images.unsplash.com/photo-${id}`;
  const res = await fetch(`${src}?w=${w * 1.5}&q=90&fm=jpg`);
  if (!res.ok) { console.error(`✗ ${slot}: HTTP ${res.status}`); continue; }
  await sharp(Buffer.from(await res.arrayBuffer()))
    .resize(w, h, { fit: "cover", position: "attention" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(new URL(`../public/images/${slot}.jpg`, import.meta.url).pathname);
  credits.push(`- \`${slot}.jpg\` — ${src}`);
  console.log(`✓ ${slot}`);
}
writeFileSync(new URL("../public/images/CREDITS.md", import.meta.url), credits.join("\n") + "\n");
