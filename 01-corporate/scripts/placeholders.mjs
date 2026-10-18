// Generates neutral tonal placeholders for every image slot so the site builds before real photos are added.
// Real photos: run `node scripts/fetch-images.mjs` (needs images.unsplash.com network access).
import sharp from "sharp";
import { existsSync, mkdirSync } from "node:fs";

const out = new URL("../public/images/", import.meta.url);
mkdirSync(out, { recursive: true });
const slots = {
  hero: [1600, 2000], cta: [2000, 1100], about: [2000, 1300], office: [1600, 1200], og: [1200, 630],
  "service-strategy": [800, 600], "service-operations": [800, 600], "service-finance": [800, 600],
  "service-digital": [800, 600], "service-international": [800, 600], "service-people": [800, 600],
  "project-manufacturing": [1800, 1125], "project-retail": [1800, 1125], "project-logistics": [1800, 1125], "project-family": [1800, 1125],
  "team-1": [800, 1000], "team-2": [800, 1000], "team-3": [800, 1000], "team-4": [800, 1000], "team-5": [800, 1000], "team-6": [800, 1000],
  "insight-kpi": [1600, 1000], "insight-markets": [1600, 1000], "insight-governance": [1600, 1000],
};
let i = 0;
for (const [name, [w, h]] of Object.entries(slots)) {
  const file = new URL(`${name}.jpg`, out);
  if (existsSync(file) && !process.argv.includes("--force")) continue;
  const hue = 205 + (i++ % 5) * 6;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue} 22% 82%)"/><stop offset="1" stop-color="hsl(${hue} 30% 42%)"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" font-family="sans-serif" font-size="${Math.round(w / 28)}" fill="white" fill-opacity=".55" text-anchor="middle">${name}</text></svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 80 }).toFile(file.pathname);
}
console.log("placeholders ready");
