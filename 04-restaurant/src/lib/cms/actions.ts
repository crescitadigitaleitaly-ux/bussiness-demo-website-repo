"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { checkLogin, getAdmin, logout } from "./auth";
import { catchSchema, homeSchema, hoursSchema, menuSchema, type ContentKey } from "./schema";
import { storageMode, writeContent } from "./storage";

// Server Actions: Next.js checks the Origin header on every call, and each action re-checks the session itself.

export async function loginAction(_prev: { error: string } | null, form: FormData) {
  const email = String(form.get("email") ?? "").slice(0, 200);
  const password = String(form.get("password") ?? "").slice(0, 200);
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  const result = await checkLogin(email, password, ip);
  if (!result.ok) return { error: result.error };
  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

const SCHEMAS = { catch: catchSchema, menu: menuSchema, hours: hoursSchema, home: homeSchema } satisfies Record<ContentKey, z.ZodType>;

export type SaveResult = { ok: true; live: "now" | "soon" } | { ok: false; errors: string[] };

const NAMES: Record<string, string> = {
  items: "Item", sections: "Section", slots: "Time slot", it: "Italian", en: "English", name: "Name", desc: "Description",
  price: "Price", title: "Title", note: "Note", updatedAt: "Updated at", from: "Opens", to: "Closes", days: "Open days",
  lede: "Intro text", titleA: "Headline start", titleAccent: "Headline highlight", titleB: "Headline end", id: "Short name",
};

/** "items.1.price" → "Item 2 › Price" */
const where = (p: PropertyKey[]) =>
  p.map((s) => (typeof s === "number" ? String(s + 1) : NAMES[String(s)] ?? String(s))).join(" › ").replace(/(\D) › (\d+)/g, "$1 $2");

export async function saveContent(key: ContentKey, data: unknown): Promise<SaveResult> {
  if (!(await getAdmin())) return { ok: false, errors: ["Your session has ended. Please log in again."] };
  const schema = SCHEMAS[key];
  if (!schema) return { ok: false, errors: ["Unknown section."] };

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { ok: false, errors: parsed.error.issues.slice(0, 8).map((i) => (i.path.length ? `${where(i.path)}: ${i.message}` : i.message)) };

  try {
    await writeContent(key, parsed.data);
  } catch (e) {
    return { ok: false, errors: [e instanceof Error ? e.message : "Saving failed."] };
  }
  return { ok: true, live: storageMode() === "file" ? "now" : "soon" };
}
