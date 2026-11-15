import { z } from "zod";

// Zod must not use eval: the site's CSP blocks it (see CLAUDE.md gotchas).
z.config({ jitless: true });

/**
 * Shapes of the editable content files in src/content/cms/*.json.
 * The admin panel validates every save against these, and the site reads the same files.
 */

const text = (max: number) => z.string().trim().max(max);
const required = (max: number) => text(max).min(1, "Required");
const bilingual = (max: number, opt = false) => z.object({ it: opt ? text(max) : required(max), en: opt ? text(max) : required(max) });

/** "14", "9.00" or "4,50": up to 4 digits, optional 1–2 decimals. Stored with a dot. */
export const price = z
  .string()
  .trim()
  .regex(/^\d{1,4}([.,]\d{1,2})?$/, "Use a number like 14 or 9.50")
  .transform((v) => v.replace(",", "."));

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use the 24-hour format, like 19:30");

export const TAGS = ["raw", "gf", "veg"] as const;
export const UNITS = ["", "each", "hg"] as const;

export const catchSchema = z.object({
  updatedAt: time,
  items: z
    .array(z.object({ name: bilingual(70), price, byWeight: z.boolean() }))
    .max(12, "Up to 12 items"),
});

export const dishSchema = z.object({
  name: bilingual(80),
  desc: bilingual(160, true),
  price,
  unit: z.enum(UNITS),
  allergens: z
    .array(z.number().int().min(1).max(14))
    .max(14)
    .transform((a) => [...new Set(a)].sort((x, y) => x - y)),
  tags: z.array(z.enum(TAGS)).transform((t) => [...new Set(t)]),
});

export const menuSchema = z.object({
  sections: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]{2,30}$/, "Lowercase letters, numbers and dashes"),
        title: bilingual(40),
        note: bilingual(140, true),
        items: z.array(dishSchema).max(60),
      }),
    )
    .min(1, "Keep at least one section")
    .max(12)
    .refine((s) => new Set(s.map((x) => x.id)).size === s.length, "Two sections have the same short name"),
});

export const hoursSchema = z.object({
  days: z
    .array(z.number().int().min(0).max(6))
    .min(1, "Pick at least one open day")
    .transform((d) => [...new Set(d)].sort((x, y) => x - y)),
  slots: z
    .array(z.object({ from: time, to: time }).refine((s) => s.from < s.to, "Closing time must be after opening time"))
    .min(1, "Add at least one time slot")
    .max(3),
});

export const HOME_SECTIONS = ["catchBoard", "facts", "kitchen", "signature", "quote", "booking", "reviews", "visit"] as const;

export const homeSchema = z.object({
  hero: z.object({
    titleA: bilingual(40),
    titleAccent: bilingual(30),
    titleB: bilingual(40),
    lede: bilingual(220),
  }),
  sections: z.object(Object.fromEntries(HOME_SECTIONS.map((k) => [k, z.boolean()])) as Record<(typeof HOME_SECTIONS)[number], z.ZodBoolean>),
});

export type CatchData = z.infer<typeof catchSchema>;
export type MenuData = z.infer<typeof menuSchema>;
export type HoursData = z.infer<typeof hoursSchema>;
export type HomeData = z.infer<typeof homeSchema>;
export type ContentKey = "catch" | "menu" | "hours" | "home";
