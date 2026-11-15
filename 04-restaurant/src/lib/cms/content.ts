import catchJson from "@/content/cms/catch.json";
import menuJson from "@/content/cms/menu.json";
import hoursJson from "@/content/cms/hours.json";
import homeJson from "@/content/cms/home.json";
import type { CatchData, HomeData, HoursData, MenuData } from "./schema";

/**
 * Turns the editable JSON files into the shapes the site already uses.
 * The files are imported at build time: in development a save shows up on the next refresh,
 * in production a save is committed to GitHub and Vercel redeploys (about 1–2 minutes).
 */

type Lang = "it" | "en";

const catchData = catchJson as CatchData;
const menuData = menuJson as MenuData;
const hoursData = hoursJson as HoursData;
const homeData = homeJson as HomeData;

/** "9.00" → "9,00" (it) or "9.00" (en); whole numbers stay whole. */
export function formatPrice(lang: Lang, value: string) {
  const decimals = value.includes(".") ? 2 : 0;
  return new Intl.NumberFormat(lang === "it" ? "it-IT" : "en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: "always",
  }).format(Number(value));
}

export function catchItems(lang: Lang) {
  return catchData.items.map((i) => ({ name: i.name[lang], price: formatPrice(lang, i.price), unit: i.byWeight ? "hg" : "" }));
}

export const catchUpdated = (lang: Lang) => (lang === "it" ? `Aggiornato alle ${catchData.updatedAt}` : `Updated at ${catchData.updatedAt}`);

const unitLabel = { it: { each: "cad.", hg: "/ hg" }, en: { each: "each", hg: "/ 100 g" } } as const;

export function menuSections(lang: Lang) {
  return menuData.sections.map((s) => ({
    id: s.id,
    title: s.title[lang],
    note: s.note[lang],
    items: s.items.map((d) => ({
      name: d.name[lang],
      desc: d.desc[lang],
      price: d.unit ? `${formatPrice(lang, d.price)} ${unitLabel[lang][d.unit]}` : formatPrice(lang, d.price),
      allergens: d.allergens as number[],
      tags: d.tags as string[],
    })),
  }));
}

export const openingHours = { days: hoursData.days, slots: hoursData.slots.map((s) => [s.from, s.to] as [string, string]) };

// Monday-first week, as menus and shop doors show it in Italy.
const WEEK = [1, 2, 3, 4, 5, 6, 0];

function dayName(lang: Lang, day: number) {
  // 2023-01-01 was a Sunday, so day 0–6 maps to Jan 1–7.
  const name = new Intl.DateTimeFormat(lang === "it" ? "it-IT" : "en-US", { weekday: "long", timeZone: "UTC" }).format(Date.UTC(2023, 0, 1 + day));
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/** Groups consecutive days: [{ days: "Tuesday – Sunday", time: "12:30 – 14:30 · 19:30 – 22:30" }, { days: "Monday", time: "Closed" }]. */
export function hoursList(lang: Lang) {
  const open = new Set(hoursData.days);
  const runs: { open: boolean; days: number[] }[] = [];
  for (const d of WEEK) {
    const last = runs.at(-1);
    if (last && last.open === open.has(d)) last.days.push(d);
    else runs.push({ open: open.has(d), days: [d] });
  }
  const label = (days: number[]) => (days.length === 1 ? dayName(lang, days[0]) : `${dayName(lang, days[0])} – ${dayName(lang, days.at(-1)!)}`);
  const time = hoursData.slots.map((s) => `${s.from} – ${s.to}`).join(" · ");
  const closed = lang === "it" ? "Chiuso" : "Closed";
  return [
    ...runs.filter((r) => r.open).map((r) => ({ days: label(r.days), time })),
    ...runs.filter((r) => !r.open).map((r) => ({ days: label(r.days), time: closed })),
  ];
}

export function heroText(lang: Lang) {
  const h = homeData.hero;
  return { titleA: h.titleA[lang], titleAccent: h.titleAccent[lang], titleB: h.titleB[lang], lede: h.lede[lang] };
}

export const homeSections = homeData.sections;
