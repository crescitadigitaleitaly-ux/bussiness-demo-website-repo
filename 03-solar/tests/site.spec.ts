import { expect, test, type Page } from "@playwright/test";

const pages = ["", "about", "solutions", "solutions/residential-solar", "solutions/battery-storage", "projects", "savings", "contact", "quote", "privacy", "cookies"];

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(page.url() + " " + m.text().slice(0, 40)));
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
  await page.goto("/it/solutions");
  await page.getByRole("link", { name: /English/ }).click();
  await expect(page).toHaveURL(/\/en\/solutions$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("A complete energy system");
  await page.getByRole("link", { name: /Italiano/ }).click();
  await expect(page).toHaveURL(/\/it\/solutions$/);
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

test("quote form validates every field and shows the demo confirmation", async ({ page }) => {
  await page.goto("/it/quote");
  await page.getByRole("button", { name: "Invia richiesta" }).click();
  for (const [field, m] of [
    ["name", "Inserisci nome e cognome"],
    ["phone", "Inserisci un numero di telefono valido"],
    ["property", "Seleziona il tipo di immobile"],
    ["bill", "Seleziona una fascia di spesa"],
    ["location", "Indica la località dell'impianto"],
    ["roof", "Seleziona il tipo di copertura"],
    ["battery", "Seleziona un'opzione"],
    ["privacy", "Per continuare è necessario il consenso"],
  ]) {
    await expect(page.locator(`#quote-${field}-error`)).toHaveText(m);
  }
  await expect(page.getByLabel("Nome e cognome", { exact: true })).toBeFocused();

  await page.getByLabel("Nome e cognome", { exact: true }).fill("Maria Bianchi");
  await page.getByRole("textbox", { name: "Email" }).fill("maria@example.com");
  await page.getByLabel("Telefono", { exact: true }).fill("+39 333 123 4567");
  await page.getByLabel("Tipo di immobile", { exact: true }).selectOption({ label: "Casa indipendente" });
  await page.getByLabel("Bolletta elettrica mensile (circa)").selectOption({ index: 2 });
  await page.getByLabel("Località dell'impianto").fill("Verona (VR)");
  await page.getByLabel("Tipo di copertura").selectOption({ index: 1 });
  await page.getByText("Vorrei capire meglio").click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Invia richiesta" }).click();
  await expect(page.getByRole("status")).toContainText("Richiesta ricevuta (demo)");
});

test("savings calculator updates and pre-fills the quote form", async ({ page }) => {
  await page.goto("/en/savings");
  const savings = page.locator("[aria-live=polite] p").nth(2);
  const before = await savings.textContent();
  await page.getByRole("switch", { name: "With battery storage" }).check();
  await expect(savings).not.toHaveText(before!);
  await page.getByRole("button", { name: "Business" }).click();
  await expect(page.getByRole("button", { name: "Business" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(/Non-binding estimate/)).toBeVisible();

  await page.getByRole("link", { name: "Request a quote with these details" }).click();
  await expect(page).toHaveURL(/\/en\/quote\?property=business&battery=yes$/);
  await expect(page.getByLabel("Property type", { exact: true })).toHaveValue("Business / warehouse");
  await expect(page.getByRole("radio", { name: "Yes" })).toBeChecked();
});

test("project gallery filters by category", async ({ page }) => {
  await page.goto("/en/projects");
  const cards = page.locator("main ul li h2");
  await expect(cards).toHaveCount(8);
  await page.getByRole("button", { name: "Storage" }).click();
  await expect(page.getByRole("button", { name: "Storage" })).toHaveAttribute("aria-pressed", "true");
  await expect(cards).toHaveCount(2);
  await expect(cards.first()).toHaveText("Winery with storage");
});

test("contact form (EN) submits in demo mode", async ({ page }) => {
  await page.goto("/en/contact");
  await page.getByLabel("Full name", { exact: true }).fill("Jane Doe");
  await page.getByRole("textbox", { name: "Email" }).fill("jane@example.com");
  await page.getByLabel("Message", { exact: true }).fill("We'd like to discuss a rooftop system for our warehouse.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByRole("status")).toContainText("Request received (demo)");
});

test("API rejects invalid payloads", async ({ request }) => {
  const res = await request.post("/api/quote", { data: { kind: "quote", email: "x" } });
  expect(res.status()).toBe(400);
});

test("content is visible with reduced motion", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/en");
  const heading = page.getByRole("heading", { name: "From first call to switch-on." });
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toBeVisible();
  await expect(page.getByRole("heading", { name: "Battery storage", exact: true })).toBeVisible();
  await ctx.close();
});

test("WhatsApp button points to wa.me", async ({ page }) => {
  await page.goto("/it");
  await expect(page.getByRole("link", { name: "Scrivici su WhatsApp" })).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+\?text=/);
});
