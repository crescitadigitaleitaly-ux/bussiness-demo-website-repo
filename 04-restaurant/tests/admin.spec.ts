import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { catchItems, hoursList, menuSections } from "../src/lib/cms/content";

/**
 * Admin panel tests. They need the server started with CMS_STORAGE=file and the test login in .env.local
 * (ADMIN_EMAIL + ADMIN_PASSWORD_HASH, with the plain password in the "# Test password:" comment).
 * Every content file a test changes is restored afterwards.
 */

const env = readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
const EMAIL = env.match(/^ADMIN_EMAIL=(.+)$/m)?.[1].trim() ?? "";
const PASSWORD = env.match(/^# Test password: (.+)$/m)?.[1].trim() ?? "";
const CMS = (f: string) => path.join(process.cwd(), "src", "content", "cms", f);

test.describe.configure({ mode: "serial" });

const originals: Record<string, string> = {};
test.beforeAll(() => {
  for (const f of ["catch.json", "menu.json", "hours.json", "home.json"]) originals[f] = readFileSync(CMS(f), "utf8");
});
test.afterAll(() => {
  for (const [f, text] of Object.entries(originals)) writeFileSync(CMS(f), text);
});

async function login(page: Page, email = EMAIL, password = PASSWORD) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
  // With the real login, wait for the dashboard so the session cookie is set before the next navigation.
  if (email === EMAIL && password === PASSWORD) await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
}

test("content files reproduce the original menu, catch and hours text", () => {
  const en = menuSections("en"), it = menuSections("it");
  expect(en[0].items[3].price).toBe("4.50 each");
  expect(it[0].items[3].price).toBe("4,50 cad.");
  expect(en[3].items[0].price).toBe("6.50 / 100 g");
  expect(it[3].items[0].price).toBe("6,50 / hg");
  expect(catchItems("it")[0]).toEqual({ name: "Gamberi rossi di Santa Margherita", price: "9,00", unit: "hg" });
  expect(catchItems("en")[3]).toEqual({ name: "Fried anchovies from the gulf", price: "14", unit: "" });
  expect(hoursList("en")).toEqual([
    { days: "Tuesday – Sunday", time: "12:30 – 14:30 · 19:30 – 22:30" },
    { days: "Monday", time: "Closed" },
  ]);
  expect(hoursList("it")[0].days).toBe("Martedì – Domenica");
});

test("signed-out visitors are sent to the login page, and admin pages are not indexed", async ({ page, request }) => {
  expect(EMAIL && PASSWORD, "test login missing from .env.local").toBeTruthy();
  for (const p of ["/admin", "/admin/catch", "/admin/menu", "/admin/hours", "/admin/homepage"]) {
    await page.goto(p);
    await expect(page).toHaveURL(/\/admin\/login$/);
  }
  const res = await request.get("/admin/login");
  expect(res.headers()["x-robots-tag"]).toContain("noindex");
  expect(res.headers()["cache-control"]).toContain("no-store");
  expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /admin");
});

test("a wrong password shows a general error and no session", async ({ page, context }) => {
  await login(page, EMAIL, "definitely-not-the-password");
  await expect(page.locator("form").getByRole("alert")).toHaveText("Email or password is incorrect.");
  expect((await context.cookies()).some((c) => c.name.includes("lanterna_admin"))).toBe(false);
});

test("a forged session cookie is rejected", async ({ page }) => {
  const fake = Buffer.from(JSON.stringify({ exp: Date.now() + 3_600_000, pw: "x" })).toString("base64url");
  // Production builds use the "__Host-" name; the dev server uses the plain one. Send both as a raw header.
  await page.setExtraHTTPHeaders({ cookie: `lanterna_admin=${fake}.forged; __Host-lanterna_admin=${fake}.forged` });
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("five wrong tries lock that login for a while", async ({ page }) => {
  for (let i = 0; i < 5; i++) await login(page, "intruder@example.com", `wrong-${i}`);
  await login(page, "intruder@example.com", "wrong-again");
  await expect(page.locator("form").getByRole("alert")).toContainText("Too many attempts");
});

test("the owner logs in, edits today's catch and the change is saved", async ({ page, context }) => {
  await login(page);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  const cookie = (await context.cookies()).find((c) => c.name.includes("lanterna_admin"));
  expect(cookie?.httpOnly).toBe(true);
  expect(cookie?.sameSite).toBe("Strict");

  await page.getByRole("link", { name: /Today's catch/ }).first().click();
  await expect(page.getByRole("heading", { name: "Today's catch", level: 1 })).toBeVisible();
  const price = page.getByLabel("Price of item 1");
  await price.fill("11,50");
  await expect(page.getByText("You have unsaved changes")).toBeVisible();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText(/^Saved\./)).toBeVisible();

  const saved = JSON.parse(readFileSync(CMS("catch.json"), "utf8"));
  expect(saved.items[0].price).toBe("11.50");
});

test("invalid input is refused with a plain explanation", async ({ page }) => {
  await login(page);
  await page.goto("/admin/catch");
  await page.getByLabel("Price of item 2").fill("cheap");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Not saved. Please check:")).toBeVisible();
  await expect(page.getByText("Item 2 › Price: Use a number like 14 or 9.50")).toBeVisible();
  expect(JSON.parse(readFileSync(CMS("catch.json"), "utf8")).items[1].price).not.toBe("cheap");
});

test("menu, hours and homepage editors save", async ({ page }) => {
  await login(page);

  await page.goto("/admin/menu");
  await page.getByLabel("Price of Tuna tartare").fill("21");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText(/^Saved\./)).toBeVisible();
  expect(JSON.parse(readFileSync(CMS("menu.json"), "utf8")).sections[0].items[1].price).toBe("21");

  await page.goto("/admin/hours");
  await page.getByLabel("Monday").check();
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText(/^Saved\./)).toBeVisible();
  expect(JSON.parse(readFileSync(CMS("hours.json"), "utf8")).days).toEqual([0, 1, 2, 3, 4, 5, 6]);

  await page.goto("/admin/homepage");
  await page.getByRole("switch", { name: /Guest reviews/ }).uncheck({ force: true });
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText(/^Saved\./)).toBeVisible();
  expect(JSON.parse(readFileSync(CMS("home.json"), "utf8")).sections.reviews).toBe(false);
});

test("log out ends the session", async ({ page }) => {
  await login(page);
  await page.getByRole("button", { name: "Log out" }).last().click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});
