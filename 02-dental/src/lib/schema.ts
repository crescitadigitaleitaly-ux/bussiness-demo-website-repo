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

const today = () => new Date().toISOString().slice(0, 10);

export const contactSchema = z.object({
  ...base,
  kind: z.literal("contact"),
  message: z.string().trim().min(10, "message").max(4000, "message"),
});

export const bookingSchema = z.object({
  ...base,
  kind: z.literal("booking"),
  phone: z.string().trim().regex(/^\+?[\d\s().-]{6,20}$/, "phone"),
  treatment: z.string().min(1, "treatment"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date").refine((d) => d >= today(), "date"),
  time: z.string().min(1, "time"),
  message: z.string().trim().max(4000).optional(),
});

export const requestSchema = z.discriminatedUnion("kind", [contactSchema, bookingSchema]);
export type RequestInput = z.infer<typeof requestSchema>;

/** Submissions faster than this are almost certainly automated. */
export const MIN_FILL_MS = 2500;
