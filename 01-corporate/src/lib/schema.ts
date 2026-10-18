import { z } from "zod";

// Messages are dictionary keys (form.errors.*) so client and server share one schema.
const base = {
  name: z.string().trim().min(2, "name").max(120, "name"),
  email: z.email("email").max(200, "email"),
  message: z.string().trim().min(10, "message").max(4000, "message"),
  privacy: z.literal(true, "privacy"),
  // Spam traps: a hidden field bots fill in, and the time the form was first rendered.
  website: z.string().max(0).optional(),
  startedAt: z.number().int(),
};

const phone = z.string().trim().regex(/^\+?[\d\s().-]{6,20}$/, "phone");

export const contactSchema = z.object({ ...base, kind: z.literal("contact") });

export const consultationSchema = z.object({
  ...base,
  kind: z.literal("consultation"),
  company: z.string().trim().max(160).optional(),
  phone: phone.or(z.literal("")).optional(),
  area: z.string().min(1, "area"),
  size: z.string().optional(),
  contactPref: z.enum(["email", "phone"]),
  date: z
    .string()
    .optional()
    .refine((d) => !d || d >= new Date().toISOString().slice(0, 10), "date"),
});

export const requestSchema = z.discriminatedUnion("kind", [contactSchema, consultationSchema]);
export type RequestInput = z.infer<typeof requestSchema>;

/** Submissions faster than this are almost certainly automated. */
export const MIN_FILL_MS = 2500;
