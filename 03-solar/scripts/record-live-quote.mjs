// Records one real quote request on the live site as a Full HD video (portfolio footage).
// Usage: node scripts/record-live-quote.mjs <outDir> [baseUrl]
// Sends ONE real request (one database row, two emails) to the inbox below.
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const out = process.argv[2] ?? "live-recording";
const base = process.argv[3] ?? "https://solar-demo.crescitadigitaleitalia.com";
const INBOX = "crescitadigitaleitaly@gmail.com";
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  recordVideo: { dir: out, size: { width: 1920, height: 1080 } },
});
const page = await context.newPage();
const pause = (ms) => page.waitForTimeout(ms);
const shot = (name) => page.screenshot({ path: path.join(out, name) });
const type = async (label, text) => {
  const el = page.getByLabel(label, { exact: true });
  await el.click();
  await el.pressSequentially(text, { delay: 55 });
  await pause(250);
};

// 1. Home page, slow scroll to show the site.
await page.goto(`${base}/en`);
await page.waitForLoadState("networkidle");
await pause(1500);
for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 450); await pause(500); }
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
await pause(1200);

// 2. Quote form.
await page.goto(`${base}/en/quote`);
await page.waitForLoadState("networkidle");
await pause(800);
await page.locator("form").evaluate((f) => f.scrollIntoView({ behavior: "smooth", block: "start" }));
await pause(1200);
await type("Full name", "Elena Russo");
await type("Email", INBOX);
await type("Phone", "+39 347 555 0192");
await page.getByLabel("Property type").selectOption("Detached house"); await pause(500);
await page.getByLabel("Monthly electricity bill (approx.)").selectOption("€150 – 300"); await pause(500);
await type("Installation location", "Verona (VR)");
await page.getByLabel("Roof type").selectOption("Pitched tiled roof"); await pause(500);
await page.locator("label", { hasText: /^Yes$/ }).click(); await pause(500);
const msg = page.getByLabel(/Additional information/);
await msg.click();
await msg.pressSequentially("South-facing roof, we are buying an electric car next year.", { delay: 40 });
await page.getByRole("checkbox").check();
await pause(800);
await shot("live-quote-filled.png");

// 3. Submit and show the confirmation.
const response = page.waitForResponse("**/api/quote");
await page.getByRole("button", { name: "Send request" }).click();
const res = await response;
const body = await res.json();
await page.getByRole("status").waitFor();
await pause(2500);
await shot(`live-quote-success-id${body.id ?? "x"}.png`);
console.log("status", res.status(), JSON.stringify(body));

await context.close();
await browser.close();
const video = fs.readdirSync(out).find((f) => f.endsWith(".webm") && !f.startsWith("live-"));
if (video) fs.renameSync(path.join(out, video), path.join(out, "live-quote-walkthrough.webm"));
