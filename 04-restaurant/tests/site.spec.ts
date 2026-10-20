import { expect, test, type Page } from "@playwright/test";

const pages = ["", "menu", "booking", "kitchen", "events", "contact", "privacy", "cookies"];

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return errors;
}

test("every internal link resolves", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const locale of ["it", "en"]) {
    for (const p of pages) {
      await page.goto(`/${locale}${p ? `/${p}` : ""}`);
      for (const href of await page.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href")!))) {
        seen.add(href.split("#")[0]);
      }
    }
  }
  for (const href of seen) {
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
  }
});

test("pages render without console errors and without horizontal overflow", async ({ page }) => {
  const errors = trackErrors(page);
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const p of pages) {
      await page.goto(`/it/${p}`);
      const scrollX = await page.evaluate(() => (window.scrollTo(200, 0), window.scrollX));
      expect(scrollX, `/it/${p} @${width}`).toBe(0);
    }
  }
  expect(errors).toEqual([]);
});

test("language switch keeps the current page", async ({ page }) => {
  await page.goto("/it/menu");
  await page.getByRole("link", { name: /English/ }).click();
  await expect(page).toHaveURL(/\/en\/menu$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Today's menu.");
  await page.getByRole("link", { name: /Italiano/ }).click();
  await expect(page).toHaveURL(/\/it\/menu$/);
});

test("unknown pages show the localized 404", async ({ page }) => {
  const res = await page.goto("/en/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page has drifted out to sea.");
});

test("mobile menu and quick-action bar", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/it");
  const bar = page.getByRole("navigation", { name: "Azioni rapide" });
  await expect(bar).toBeVisible();
  await expect(bar.getByRole("link", { name: "WhatsApp" })).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+\?text=/);
  await expect(bar.getByRole("link", { name: "Chiama" })).toHaveAttribute("href", /^tel:\+39/);

  const toggle = page.getByRole("button", { name: "Menu" });
  await toggle.click();
  const menu = page.locator("#mobile-menu");
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await menu.getByRole("link", { name: "La cucina" }).click();
  await expect(page).toHaveURL(/\/it\/kitchen$/);
});

test("skip link is the first focusable element", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("booking form validates and shows the demo confirmation", async ({ page }) => {
  await page.goto("/it/booking");
  const form = page.locator("#booking-form");
  await form.getByRole("button", { name: "Invia richiesta" }).click();
  for (const [field, m] of [
    ["date", "Scegli una data a partire da oggi"],
    ["time", "Scegli un orario"],
    ["guests", "Indica il numero di persone"],
    ["area", "Scegli dove sederti"],
    ["name", "Inserisci nome e cognome"],
    ["phone", "Inserisci un numero di telefono valido"],
    ["privacy", "Per continuare è necessario il consenso"],
  ]) {
    await expect(page.locator(`#booking-${field}-error`)).toHaveText(m);
  }
  await expect(page.getByLabel("Data", { exact: true })).toBeFocused();

  await page.getByLabel("Data", { exact: true }).fill("2020-01-01");
  await page.getByLabel("Orario", { exact: true }).selectOption("20:30");
  await page.getByLabel("Persone", { exact: true }).selectOption("4");
  await page.getByText("Terrazza sul mare").click();
  await page.getByLabel("Nome e cognome", { exact: true }).fill("Maria Bianchi");
  await page.getByRole("textbox", { name: "Email" }).fill("maria@example.com");
  await page.getByLabel("Telefono", { exact: true }).fill("+39 333 123 4567");
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "Invia richiesta" }).click();
  await expect(page.locator("#booking-date-error")).toHaveText("Scegli una data a partire da oggi");

  const future = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
  await page.getByLabel("Data", { exact: true }).fill(future);
  await form.getByRole("button", { name: "Invia richiesta" }).click();
  await expect(page.getByRole("status")).toContainText("Richiesta ricevuta (demo)");
});

test("booking page offers all three ways to book", async ({ page }) => {
  await page.goto("/en/booking");
  const options = page.getByRole("list", { name: "Ways to book" });
  await expect(options.getByRole("link", { name: "Fill in the form" })).toHaveAttribute("href", "#booking-form");
  await expect(options.getByRole("link", { name: "Open WhatsApp" })).toHaveAttribute("href", /^https:\/\/wa\.me\//);
  await expect(options.getByRole("link", { name: "Book on TheFork" })).toHaveAttribute("href", /thefork\./);
});

test("menu filters hide dishes that don't match", async ({ page }) => {
  await page.goto("/en/menu");
  const dishes = page.locator("main section[id] li h3");
  const all = await dishes.count();
  await page.getByRole("button", { name: "Vegetarian" }).click();
  await expect(page.getByRole("button", { name: "Vegetarian" })).toHaveAttribute("aria-pressed", "true");
  await expect(dishes).toHaveCount(6);
  expect(all).toBeGreaterThan(6);
  await expect(page.getByRole("heading", { name: /Trofie with Genoese pesto/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Spaghetti with clams/ })).toHaveCount(0);
});

test("open/closed badge renders a live status", async ({ page }) => {
  await page.goto("/it");
  await expect(page.getByText(/^(Aperto ora · fino alle \d\d:\d\d|Chiuso ora · riapre .+ \d\d:\d\d)$/).first()).toBeVisible();
});

test("contact form (EN) submits in demo mode", async ({ page }) => {
  await page.goto("/en/contact");
  await page.getByLabel("Full name", { exact: true }).fill("Jane Doe");
  await page.getByRole("textbox", { name: "Email" }).fill("jane@example.com");
  await page.getByLabel("Message", { exact: true }).fill("Do you have a table with a high chair on Sunday?");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByRole("status")).toContainText("Request received (demo)");
});

test("API rejects invalid payloads", async ({ request }) => {
  const res = await request.post("/api/booking", { data: { kind: "booking", email: "x" } });
  expect(res.status()).toBe(400);
});

test("content is visible with reduced motion", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/en");
  const heading = page.getByRole("heading", { name: "The dishes guests ask for most" });
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toBeVisible();
  await expect(page.getByRole("heading", { name: "Today's catch" })).toBeVisible();
  await ctx.close();
});

test("opening-hours logic (Europe/Rome)", async () => {
  const { getStatus } = await import("../src/lib/hours");
  // 20 Oct 2026 is a Tuesday; Rome is UTC+2 until 25 Oct.
  expect(getStatus(new Date("2026-10-20T11:00:00Z"))).toEqual({ open: true, until: "14:30" });
  expect(getStatus(new Date("2026-10-20T13:00:00Z"))).toEqual({ open: false, dayOffset: 0, day: 2, at: "19:30" });
  expect(getStatus(new Date("2026-10-19T08:00:00Z"))).toEqual({ open: false, dayOffset: 1, day: 2, at: "12:30" }); // Monday: closed
  expect(getStatus(new Date("2026-10-18T21:00:00Z"))).toEqual({ open: false, dayOffset: 2, day: 2, at: "12:30" }); // Sunday night → Tuesday
});
