// Records a guided tour of the live solar demo as separate Full HD clips (portfolio video footage).
// Usage: node scripts/record-tour.mjs <outDir> [baseUrl]   — read-only: nothing is submitted.
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const out = process.argv[2] ?? "tour";
const base = process.argv[3] ?? "https://solar-demo.crescitadigitaleitalia.com";
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });

async function clip(name, viewport, run) {
  const dir = path.join(out, "_" + name);
  fs.rmSync(dir, { recursive: true, force: true });
  const context = await browser.newContext({ viewport, recordVideo: { dir, size: viewport } });
  const page = await context.newPage();
  const pause = (ms) => page.waitForTimeout(ms);
  const smooth = async (y, ms = 1400) => { await page.evaluate((y) => window.scrollTo({ top: y, behavior: "smooth" }), y); await pause(ms); };
  const ready = async (url) => { await page.goto(base + url); await page.waitForLoadState("networkidle"); await pause(900); };
  await run({ page, pause, smooth, ready });
  await context.close();
  const f = fs.readdirSync(dir).find((x) => x.endsWith(".webm"));
  fs.renameSync(path.join(dir, f), path.join(out, `${name}.webm`));
  fs.rmSync(dir, { recursive: true, force: true });
  console.log("clip", name);
}

const HD = { width: 1920, height: 1080 };

// 1. Design: home page hero, then a slow scroll through the sections (stops before the footer).
await clip("design", HD, async ({ pause, smooth, ready }) => {
  await ready("/en");
  await pause(1800);
  for (const y of [700, 1400, 2100, 2800, 3500]) await smooth(y, 1700);
  await smooth(0, 1500);
});

// 2. Phone view of the home page, with the menu opened.
await clip("mobile", { width: 390, height: 844 }, async ({ page, pause, smooth, ready }) => {
  await ready("/en");
  await pause(1200);
  for (const y of [600, 1300, 2000]) await smooth(y, 1300);
  await smooth(0, 1200);
  await page.getByRole("button", { name: /menu/i }).first().click();
  await pause(1800);
});

// 3. Services: solutions overview, one service page, then the animated energy-flow diagram on the home page.
await clip("services", HD, async ({ page, pause, smooth, ready }) => {
  await ready("/en/solutions");
  await pause(1200);
  await smooth(600, 1500);
  await ready("/en/solutions/battery-storage");
  await pause(1400);
  await smooth(700, 1600);
  await ready("/en");
  const flow = page.locator("svg").filter({ has: page.locator("path") }).nth(0);
  const y = await page.evaluate(() => {
    const el = [...document.querySelectorAll("section")].find((s) => /battery|night/i.test(s.textContent ?? ""));
    return el ? el.getBoundingClientRect().top + scrollY - 80 : 2000;
  });
  await smooth(y, 3500);
  void flow;
});

// 4. Savings calculator: move the slider, switch battery on, show the results and the open assumptions.
await clip("calculator", HD, async ({ page, pause, smooth, ready }) => {
  await ready("/en/savings");
  const slider = page.locator("#calc-bill");
  await slider.evaluate((el) => el.scrollIntoView({ behavior: "smooth", block: "center" }));
  await pause(1500);
  await slider.focus();
  for (let i = 0; i < 18; i++) { await page.keyboard.press("ArrowRight"); await pause(110); }
  await pause(700);
  await page.getByRole("switch").first().check();
  await pause(1600);
  const y = await page.evaluate(() => { const el = document.getElementById("assumptions"); return el ? el.getBoundingClientRect().top + scrollY - 100 : 0; });
  if (y) { await smooth(y, 2200); }
});

// 5. One click carries the calculator answers into the quote form (pre-filled).
await clip("prefill", HD, async ({ page, pause, ready }) => {
  await ready("/en/quote?property=home&battery=yes&bill=250");
  await page.locator("form").evaluate((f) => f.scrollIntoView({ behavior: "smooth", block: "start" }));
  await pause(3200);
});

// 6. Trust: project gallery filters, then the language switch to Italian.
await clip("trust", HD, async ({ page, pause, smooth, ready }) => {
  await ready("/en/projects");
  const filters = page.getByRole("group").filter({ has: page.locator("button[aria-pressed]") }).first();
  const y = await filters.evaluate((el) => el.getBoundingClientRect().top + scrollY - 120);
  await smooth(y, 1400);
  for (const name of ["Residential", "Commercial", "Storage", "All"]) { await filters.getByRole("button", { name }).click(); await pause(1300); }
  await smooth(0, 1000);
  await page.locator('a[hreflang="it"]').first().click();
  await page.waitForLoadState("networkidle");
  await pause(2400);
});

await browser.close();
