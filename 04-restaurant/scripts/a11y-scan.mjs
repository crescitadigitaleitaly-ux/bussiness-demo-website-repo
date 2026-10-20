// WCAG 2.2 AA scan with axe-core across every sitemap URL at mobile and desktop widths.
// Usage: node scripts/a11y-scan.mjs [baseUrl]   (server must be running)
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { existsSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3100";
const sitemap = await (await fetch(base + "/sitemap.xml")).text();
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const browser = await chromium.launch({ executablePath: existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined });
const found = new Map();
for (const width of [1440, 375]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: process.env.MOTION ?? "reduce" });
  const page = await ctx.newPage();
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } });
    await page.waitForTimeout(process.env.MOTION ? 1500 : 0);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
    for (const v of violations) {
      const key = `${v.impact} ${v.id}: ${v.help}`;
      const e = found.get(key) ?? { pages: new Set(), nodes: new Set() };
      e.pages.add(`${p}@${width}`);
      v.nodes.slice(0, 3).forEach((n) => e.nodes.add(n.target.join(" ") + " | " + (n.failureSummary ?? "").split("\n")[1]?.trim()));
      found.set(key, e);
    }
  }
  await ctx.close();
}
await browser.close();
if (!found.size) console.log("No axe violations.");
for (const [k, v] of found) console.log(`\n${k}\n  pages(${v.pages.size}): ${[...v.pages].slice(0, 4).join(", ")}\n  ${[...v.nodes].slice(0, 4).join("\n  ")}`);
