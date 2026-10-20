// Usage: node scripts/screenshots.mjs [baseUrl]  — writes full-page PNGs to ./screenshots
import { chromium } from "@playwright/test";
import { existsSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3400";
const executablePath = existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
const browser = await chromium.launch({ executablePath });
const shots = [
  ["/it", "home"], ["/it/menu", "menu"], ["/en/booking", "booking"],
  ["/it/kitchen", "kitchen"], ["/en/events", "events"], ["/it/contact", "contact"],
];
for (const [w, label] of [[1440, "desktop"], [768, "tablet"], [375, "mobile"]]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
  for (const [path, name] of shots) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    // Scroll through so whileInView reveals fire, then return to top.
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `screenshots/${name}-${label}.png`, fullPage: true });
  }
  await page.close();
}
await browser.close();
console.log("done");
