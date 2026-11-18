/**
 * End-to-end tests for the real quote/contact backend (Upwork case study evidence).
 * Needs QUOTE_FUNCTION_URL + SUPABASE_ANON_KEY in .env.local, a production build and:
 *   EVIDENCE=../../solar-quote-case-study/evidence PORT=3300 npx playwright test tests/quote-backend.spec.ts --workers=1
 * Every valid submission creates a real database row and two real emails, so this file runs only when
 * RUN_BACKEND_TESTS=1 is set (it is skipped in the normal test run).
 * Screenshots go to $EVIDENCE/screenshots, videos to test-results (copied to $EVIDENCE/videos afterwards).
 */
import { expect, test, type Page } from "@playwright/test";
import path from "node:path";
import { it as IT } from "../src/content/it";
import { en as EN } from "../src/content/en";

const EVIDENCE = process.env.EVIDENCE ?? "test-results/evidence";
const INBOX = "crescitadigitaleitaly@gmail.com"; // Resend (no verified domain) only delivers to the account inbox.
const RUN = Date.now() % 100000; // new fake client IPs each run, so reruns do not hit the rate limit
const ip = (n: number) => `198.51.100.${(RUN + n) % 250}`;
let shot = Number(process.env.SHOT_START ?? 0); // continue numbering when re-running part of the file

test.skip(!process.env.RUN_BACKEND_TESTS, "real backend: set RUN_BACKEND_TESTS=1");
test.describe.configure({ mode: "serial" });
test.use({ viewport: { width: 1920, height: 1080 }, video: { mode: "on", size: { width: 1920, height: 1080 } } });

async function snap(page: Page, name: string, full = false) {
  shot += 1;
  await page.waitForTimeout(400); // let animations settle
  await page.screenshot({ path: path.join(EVIDENCE, "screenshots", `${String(shot).padStart(2, "0")}-${name}.png`), fullPage: full });
}

/** Field error message (placeholders can share the same words, so look only at error paragraphs). */
const errorText = (page: Page, text: string) => page.locator('p[id$="-error"]', { hasText: text });

async function asClient(page: Page, n: number) {
  await page.setExtraHTTPHeaders({ "x-real-ip": ip(n) });
}

async function type(page: Page, label: string | RegExp, text: string) {
  const el = page.getByLabel(label, { exact: typeof label === "string" });
  await el.click();
  await el.pressSequentially(text, { delay: 25 });
}

/** Waits until React has taken over the page (typing earlier would be lost), then scrolls the form into view. */
async function ready(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
  await page.locator("form").evaluate((f) => f.scrollIntoView({ block: "start" }));
}

async function openQuote(page: Page, lang: "it" | "en", query = "") {
  await page.goto(`/${lang}/quote${query}`);
  await ready(page);
}

type Quote = { name: string; phone: string; property: number; bill: number; location: string; roof: number; battery: number; message?: string };

async function fillQuote(page: Page, lang: "it" | "en", q: Quote, email = INBOX) {
  const f = (lang === "it" ? IT : EN).form;
  await type(page, f.name, q.name);
  await type(page, f.email, email);
  await type(page, f.phone, q.phone);
  await page.getByLabel(f.property).selectOption(f.properties[q.property]);
  await page.getByLabel(f.bill, { exact: true }).selectOption(f.bills[q.bill]);
  await type(page, f.location, q.location);
  await page.getByLabel(f.roof).selectOption(f.roofs[q.roof]);
  await page.locator("label", { hasText: new RegExp(`^${f.batteryOptions[q.battery].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`) }).click();
  if (q.message) await type(page, new RegExp(f.message), q.message);
  await page.getByRole("checkbox").check();
}

// Five submissions: every property type, bill range and roof type is used once, every battery option
// at least once, and both languages are covered.
const quotes: (Quote & { lang: "it" | "en" })[] = [
  { lang: "it", name: "Giulia Bianchi (test 1/5)", phone: "+39 345 123 4567", property: 0, bill: 0, location: "Verona (VR)", roof: 0, battery: 0, message: "Tetto esposto a sud, abbiamo un'auto elettrica." },
  { lang: "en", name: "Mark Ellis (test 2/5)", phone: "+44 7700 900123", property: 1, bill: 1, location: "Bussolengo (VR)", roof: 1, battery: 1 },
  { lang: "it", name: "Luca Ferri (test 3/5)", phone: "045 800 1234", property: 2, bill: 2, location: "San Bonifacio (VR)", roof: 2, battery: 2, message: "Capannone di 800 m², vorremmo l'impianto entro primavera." },
  { lang: "en", name: "Anna Schmidt (test 4/5)", phone: "+49 (151) 2345-678", property: 3, bill: 3, location: "Legnago (VR)", roof: 3, battery: 0, message: "Farm with a large barn roof." },
  { lang: "it", name: "Paolo Conti (test 5/5)", phone: "3331234567", property: 4, bill: 4, location: "Peschiera del Garda (VR)", roof: 4, battery: 1 },
];

test("1. empty form: every required field shows its error (IT + EN)", async ({ page }) => {
  for (const lang of ["it", "en"] as const) {
    const f = (lang === "it" ? IT : EN).form;
    await openQuote(page, lang);
    await page.getByRole("button", { name: f.submit }).click();
    for (const key of ["name", "email", "phone", "property", "bill", "location", "roof", "battery", "privacy"] as const) {
      await expect(errorText(page, f.errors[key]), `${lang} ${key}`).toBeVisible();
    }
    await snap(page, `empty-form-all-errors-${lang}`);
  }
});

test("2. wrong values: each field rejects bad input", async ({ page }) => {
  const f = EN.form;
  await openQuote(page, "en");
  const bad: [string, string, keyof typeof f.errors][] = [
    [f.name, "A", "name"],
    [f.email, "mark@example", "email"],
    [f.phone, "call me", "phone"],
    [f.location, "x", "location"],
  ];
  for (const [label, value] of bad) await type(page, label, value);
  await page.getByRole("button", { name: f.submit }).click();
  for (const [, , key] of bad) await expect(errorText(page, f.errors[key])).toBeVisible();
  await snap(page, "wrong-values-rejected-en");

  // Fixing a field removes its error.
  await page.getByLabel(f.email, { exact: true }).fill("mark@example.com");
  await page.getByLabel(f.name, { exact: true }).fill("Mark Ellis");
  await page.getByRole("button", { name: f.submit }).click();
  await expect(errorText(page, f.errors.email)).toBeHidden();
  await expect(errorText(page, f.errors.name)).toBeHidden();
  await snap(page, "errors-clear-when-fixed-en");
});

test("3. privacy consent is required", async ({ page }) => {
  await asClient(page, 100);
  const f = IT.form;
  await openQuote(page, "it");
  await fillQuote(page, "it", quotes[0]);
  await page.getByRole("checkbox").uncheck();
  await page.getByRole("button", { name: f.submit }).click();
  await expect(errorText(page, f.errors.privacy)).toBeVisible();
  await expect(page.getByRole("status")).toHaveCount(0);
  await snap(page, "privacy-consent-required-it");
});

test("4. savings calculator link pre-fills the quote form", async ({ page }) => {
  await openQuote(page, "en", "?property=home&battery=yes&bill=150");
  const f = EN.form;
  await expect(page.getByLabel(f.property)).toHaveValue(f.properties[0]);
  await expect(page.getByLabel(f.bill, { exact: true })).toHaveValue(f.bills[1]);
  await expect(page.locator(`input[type=radio][value="${f.batteryOptions[0]}"]`)).toBeChecked();
  await snap(page, "calculator-prefill-en");
});

test("5. server rejects bad data even without the browser checks", async ({ request }) => {
  const res = await request.post("/api/quote", { data: { kind: "quote", name: "A", email: "no", startedAt: 0 } });
  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(body.issues).toEqual(expect.arrayContaining(["name", "email", "phone", "privacy"]));

  const direct = await request.post(process.env.QUOTE_FUNCTION_URL!, {
    headers: { Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}` },
    data: { kind: "quote", name: "Valid Name", email: "a@b.co", privacy: true, phone: "<script>" },
  });
  expect(direct.status()).toBe(400);
  expect((await direct.json()).field).toBe("phone");

  const noKey = await request.post(process.env.QUOTE_FUNCTION_URL!, { data: {} });
  expect(noKey.status()).toBe(401);
});

test("6. spam traps: honeypot and too-fast submissions are dropped silently", async ({ request }) => {
  const valid = { kind: "quote", name: "Spam Bot", email: INBOX, phone: "+39 333 0000000", property: "x", bill: "x", location: "Spamtown", roof: "x", battery: "x", privacy: true };
  const honeypot = await request.post("/api/quote", { headers: { "x-real-ip": ip(200) }, data: { ...valid, website: "http://spam.example", startedAt: Date.now() - 10_000 } });
  const tooFast = await request.post("/api/quote", { headers: { "x-real-ip": ip(201) }, data: { ...valid, startedAt: Date.now() - 300 } });
  for (const res of [honeypot, tooFast]) {
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.id).toBeUndefined(); // nothing stored (checked again in the database afterwards)
  }
});

test("7. contact form: real message is stored and emailed", async ({ page }) => {
  await asClient(page, 150);
  const f = EN.form;
  await page.goto("/en/contact");
  await ready(page);
  await type(page, f.name, "Sara Moretti (contact test)");
  await type(page, f.email, INBOX);
  await type(page, f.contactMessage, "Do you also install EV chargers for apartment buildings?");
  await page.getByRole("checkbox").check();
  await snap(page, "contact-filled-en");
  const response = page.waitForResponse("**/api/quote");
  await page.getByRole("button", { name: f.submit }).click();
  const body = await (await response).json();
  expect(body.ok).toBe(true);
  expect(body.id).toBeGreaterThan(0);
  await expect(page.getByRole("status")).toContainText(f.successTitle);
  await snap(page, `contact-success-en-id${body.id}`);
});

test("8. five real quotes cover every option of every field, then the rate limit kicks in", async ({ page }) => {
  await asClient(page, 0);
  for (const [i, q] of quotes.entries()) {
    const f = (q.lang === "it" ? IT : EN).form;
    if (i === 4) await page.setViewportSize({ width: 390, height: 844 }); // last one on a phone screen
    await openQuote(page, q.lang);
    await fillQuote(page, q.lang, q);
    await snap(page, `quote${i + 1}-filled-${q.lang}`, i === 4);
    const response = page.waitForResponse("**/api/quote");
    await page.getByRole("button", { name: f.submit }).click();
    const res = await response;
    const body = await res.json();
    expect(res.status(), JSON.stringify(body)).toBe(200);
    expect(body.id).toBeGreaterThan(0);
    await expect(page.getByRole("status")).toContainText(f.successTitle);
    await snap(page, `quote${i + 1}-success-${q.lang}-id${body.id}`);
    console.log(`quote ${i + 1}: stored as #${body.id}`);
  }

  // Sixth request from the same visitor within an hour is refused.
  await page.setViewportSize({ width: 1920, height: 1080 });
  const f = IT.form;
  await openQuote(page, "it");
  await fillQuote(page, "it", { ...quotes[0], name: "Giulia Bianchi (test 6: rate limit)" });
  const response = page.waitForResponse("**/api/quote");
  await page.getByRole("button", { name: f.submit }).click();
  expect((await response).status()).toBe(429);
  await expect(page.locator("form [role=alert]")).toContainText(f.rateTitle);
  await snap(page, "rate-limit-6th-request-it");
});

// Rate-limit screenshot on its own: the database is first given 5 recent rows for RATE_IP
// (setup rows, deleted afterwards), so this visitor's next request is the 6th within the hour.
test("9. rate limit: 6th request from the same visitor within an hour is refused", async ({ page }) => {
  test.skip(!process.env.RATE_IP, "set RATE_IP after seeding 5 rows for it");
  await page.setExtraHTTPHeaders({ "x-real-ip": process.env.RATE_IP! });
  const f = IT.form;
  await openQuote(page, "it");
  await fillQuote(page, "it", { ...quotes[0], name: "Giulia Bianchi (test 6: rate limit)" });
  const response = page.waitForResponse("**/api/quote");
  await page.getByRole("button", { name: f.submit }).click();
  expect((await response).status()).toBe(429);
  await expect(page.locator("form [role=alert]")).toContainText(f.rateTitle);
  await snap(page, "rate-limit-6th-request-it");
});
