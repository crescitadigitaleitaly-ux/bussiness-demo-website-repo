// Downloads the photos listed in scripts/images.json, crops them to each slot's size and
// writes public/images/<slot>.jpg plus a CREDITS.md. Slots left empty keep their placeholder.
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";

const sizes = { hero: [1600, 2000], cta: [2000, 1100], about: [2000, 1300], og: [1200, 630] };
const size = (slot) => sizes[slot] ?? (slot.startsWith("team") ? [800, 1000] : slot.startsWith("service") ? [800, 600] : slot.startsWith("project") ? [1800, 1125] : [1600, 1000]);
const manifest = JSON.parse(readFileSync(new URL("./images.json", import.meta.url)));
const credits = ["# Image credits", "", "Photos from Unsplash (https://unsplash.com/license).", ""];

for (const [slot, page] of Object.entries(manifest)) {
  if (slot.startsWith("_") || !page) continue;
  const id = page.split(/[/-]/).pop();
  const res = await fetch(`https://unsplash.com/photos/${id}/download?force=true`);
  if (!res.ok) { console.error(`✗ ${slot}: HTTP ${res.status}`); continue; }
  const [w, h] = size(slot);
  await sharp(Buffer.from(await res.arrayBuffer())).resize(w, h, { fit: "cover", position: "attention" }).jpeg({ quality: 82, mozjpeg: true })
    .toFile(new URL(`../public/images/${slot}.jpg`, import.meta.url).pathname);
  credits.push(`- \`${slot}.jpg\` — ${page}`);
  console.log(`✓ ${slot}`);
}
writeFileSync(new URL("../public/images/CREDITS.md", import.meta.url), credits.join("\n") + "\n");
