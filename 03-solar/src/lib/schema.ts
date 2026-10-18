import { z } from "zod";

// No eval-based fast path: keeps the strict Content-Security-Policy (no 'unsafe-eval') clean.
z.config({ jitless: true });

// Messages are dictionary keys (form.errors.*) so client and server share one schema.
const base = {
  name: z.string().trim().min(2, "name").max(120, "name"),
  email: z.email("email").max(200, "email"),
  privacy: z.literal(true, "privacy"),
  // Spam traps: a hidden field bots fill in, and the time of first interaction with the form.
  website: z.string().max(0).optional(),
  startedAt: z.number().int(),
};

export const contactSchema = z.object({
  ...base,
  kind: z.literal("contact"),
  message: z.string().trim().min(10, "message").max(4000, "message"),
});

export const quoteSchema = z.object({
  ...base,
  kind: z.literal("quote"),
  phone: z.string().trim().regex(/^\+?[\d\s().-]{6,20}$/, "phone"),
  property: z.string().min(1, "property"),
  bill: z.string().min(1, "bill"),
  location: z.string().trim().min(2, "location").max(120, "location"),
  roof: z.string().min(1, "roof"),
  battery: z.string("battery").min(1, "battery"),
  message: z.string().trim().max(4000).optional(),
});

export const requestSchema = z.discriminatedUnion("kind", [contactSchema, quoteSchema]);
export type RequestInput = z.infer<typeof requestSchema>;

/** Submissions faster than this are almost certainly automated. */
export const MIN_FILL_MS = 2500;
