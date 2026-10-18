import { expect, test, type Page } from "@playwright/test";

const pages = ["", "about", "services", "projects", "projects/retail-expansion", "why-us", "team", "insights", "insights/kpi-that-matter", "contact", "consultation", "privacy", "cookies"];

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
      // If the page can be scrolled sideways, scrollX moves away from 0.
      const scrollX = await page.evaluate(() => (window.scrollTo(200, 0), window.scrollX));
      expect(scrollX, `/it/${p} @${width}`).toBe(0);
    }
  }
  expect(errors).toEqual([]);
});

test("language switch keeps the current page", async ({ page }) => {
  await page.goto("/it/services");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/services$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Integrated expertise");
  await page.getByRole("link", { name: "Italiano" }).click();
  await expect(page).toHaveURL(/\/it\/services$/);
});

test("unknown pages show the localized 404", async ({ page }) => {
  const res = await page.goto("/en/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page doesn't exist.");
});

test("mobile menu opens, navigates and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/it");
  const toggle = page.getByRole("button", { name: "Menu" });
  await toggle.click();
  const menu = page.locator("#mobile-menu");
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await menu.getByRole("link", { name: "Progetti" }).click();
  await expect(page).toHaveURL(/\/it\/projects$/);
  await expect(menu).toBeHidden();
});

test("skip link is the first focusable element", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("consultation form validates and shows the demo confirmation", async ({ page }) => {
  await page.goto("/it/consultation");
  await page.getByRole("button", { name: "Invia richiesta" }).click();
  await expect(page.getByText("Inserisci nome e cognome")).toBeVisible();
  await expect(page.getByText("Seleziona un'area di interesse")).toBeVisible();
  await expect(page.getByText("Per continuare è necessario il consenso")).toBeVisible();
  await expect(page.getByLabel("Nome e cognome", { exact: true })).toBeFocused();

  await page.getByLabel("Nome e cognome", { exact: true }).fill("Mario Rossi");
  await page.getByRole("textbox", { name: "Email" }).fill("not-an-email");
  await page.getByRole("button", { name: "Invia richiesta" }).click();
  await expect(page.getByText("Inserisci un indirizzo email valido")).toBeVisible();

  await page.getByRole("textbox", { name: "Email" }).fill("mario@example.com");
  await page.getByLabel("Area di interesse", { exact: true }).selectOption({ index: 1 });
  await page.getByLabel("Messaggio", { exact: true }).fill("Vorremmo rivedere i processi produttivi.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Invia richiesta" }).click();
  await expect(page.getByRole("status")).toContainText("Richiesta ricevuta (demo)");
});

test("contact form (EN) submits in demo mode", async ({ page }) => {
  await page.goto("/en/contact");
  await page.getByLabel("Full name", { exact: true }).fill("Jane Doe");
  await page.getByRole("textbox", { name: "Email" }).fill("jane@example.com");
  await page.getByLabel("Message", { exact: true }).fill("We'd like to discuss an expansion project.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByRole("status")).toContainText("Request received (demo)");
});

test("API rejects invalid payloads", async ({ request }) => {
  const res = await request.post("/api/consultation", { data: { kind: "contact", email: "x" } });
  expect(res.status()).toBe(400);
});

test("content is visible with reduced motion", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/en");
  const heading = page.getByRole("heading", { name: "Four phases. No surprises." });
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toBeVisible();
  await expect(page.getByText("240+")).toBeVisible();
  await ctx.close();
});

test("WhatsApp button points to wa.me", async ({ page }) => {
  await page.goto("/it");
  await expect(page.getByRole("link", { name: "Scrivici su WhatsApp" })).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+\?text=/);
});
