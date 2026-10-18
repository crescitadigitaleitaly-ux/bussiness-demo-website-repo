// Saves a self-contained, offline HTML snapshot of a page (CSS, fonts and images inlined, scripts removed).
// Usage: node scripts/snapshot.mjs <path> <out.html> [baseUrl]   e.g. node scripts/snapshot.mjs /it snapshots/home-it.html
import { chromium } from "@playwright/test";
import { existsSync, writeFileSync } from "node:fs";

const [path = "/it", out = "snapshots/home-it.html", base = "http://localhost:3100"] = process.argv.slice(2);
const executablePath = existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto(base + path, { waitUntil: "networkidle" });
// Scroll through so every scroll-triggered reveal and counter reaches its final state.
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); }
  scrollTo(0, 0);
});
await page.waitForTimeout(2500);

const html = await page.evaluate(async (origin) => {
  const toData = async (url) => {
    const blob = await (await fetch(url)).blob();
    return new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); });
  };
  for (const img of document.querySelectorAll("img")) {
    if (!img.currentSrc) continue;
    img.src = await toData(img.currentSrc);
    img.removeAttribute("srcset"); img.removeAttribute("sizes"); img.removeAttribute("loading");
  }
  for (const link of [...document.querySelectorAll('link[rel="stylesheet"]')]) {
    let css = await (await fetch(link.href)).text();
    for (const m of new Set(css.match(/url\((?!data:)[^)]+\)/g) ?? [])) {
      const u = new URL(m.slice(4, -1).replace(/["']/g, ""), link.href).href;
      css = css.split(m).join(`url(${await toData(u)})`);
    }
    const style = document.createElement("style"); style.textContent = css; link.replaceWith(style);
  }
  document.querySelectorAll('script, link[rel="preload"], link[rel="modulepreload"], link[as]').forEach((n) => n.remove());
  // Point internal links at the original site paths so they're readable; they won't resolve offline.
  document.querySelectorAll('a[href^="/"]').forEach((a) => a.setAttribute("href", origin + a.getAttribute("href")));
  return "<!doctype html>\n" + document.documentElement.outerHTML;
}, base);

writeFileSync(out, html);
console.log(out, (html.length / 1024 / 1024).toFixed(1) + " MB");
await browser.close();
