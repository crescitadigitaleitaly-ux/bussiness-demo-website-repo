// Supabase Edge Function "solar-quote" (project "My Portfolio website").
// Receives quote/contact requests from the Aurevo Energia solar demo (via its Next.js /api/quote route),
// validates them, rate-limits, stores them in public.solar_requests and sends two emails through Resend:
// an alert to the business inbox and a confirmation to the customer.
// Deployed with the Supabase MCP; this file is the source of truth.
import { createClient } from "jsr:@supabase/supabase-js@2";

const ALERT_INBOX = "crescitadigitaleitaly@gmail.com";
const FROM = "Aurevo Energia (demo) <onboarding@resend.dev>";
const PER_IP_PER_HOUR = 5;
const GLOBAL_PER_HOUR = 60;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const esc = (s: unknown) =>
  String(s ?? "-").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const str = (v: unknown, min: number, max: number) => {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length >= min && t.length <= max ? t : null;
};

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]{6,20}$/;

type Clean = {
  kind: "quote" | "contact"; locale: "it" | "en"; name: string; email: string; phone: string | null;
  property: string | null; bill: string | null; location: string | null; roof: string | null;
  battery: string | null; message: string | null;
};

/** Same rules as the site's Zod schema (src/lib/schema.ts). Returns the field that failed, or the clean record. */
function validate(r: Record<string, unknown>): { field: string } | { data: Clean } {
  const kind = r.kind === "quote" || r.kind === "contact" ? r.kind : null;
  if (!kind) return { field: "kind" };
  const locale = r.locale === "en" ? "en" : "it";
  const name = str(r.name, 2, 120);
  if (!name) return { field: "name" };
  const email = typeof r.email === "string" && r.email.length <= 200 && EMAIL_RE.test(r.email) ? r.email.trim() : null;
  if (!email) return { field: "email" };
  if (r.privacy !== true) return { field: "privacy" };
  if (kind === "contact") {
    const message = str(r.message, 10, 4000);
    if (!message) return { field: "message" };
    return { data: { kind, locale, name, email, message, phone: null, property: null, bill: null, location: null, roof: null, battery: null } };
  }
  const phone = typeof r.phone === "string" && PHONE_RE.test(r.phone.trim()) ? r.phone.trim() : null;
  if (!phone) return { field: "phone" };
  const pick = (k: string, max = 80) => str(r[k], 1, max);
  const property = pick("property"), bill = pick("bill"), roof = pick("roof"), battery = pick("battery");
  const location = str(r.location, 2, 120);
  for (const [k, v] of Object.entries({ property, bill, location, roof, battery })) if (!v) return { field: k };
  const message = r.message == null || r.message === "" ? null : str(r.message, 0, 4000);
  if (r.message != null && r.message !== "" && message === null) return { field: "message" };
  return { data: { kind, locale, name, email, phone, property, bill, location, roof, battery, message } };
}

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

const rows = (d: Clean, it: boolean) => {
  const L = it
    ? { name: "Nome", email: "Email", phone: "Telefono", property: "Tipo di immobile", bill: "Bolletta mensile", location: "Luogo", roof: "Tetto", battery: "Accumulo", message: "Messaggio" }
    : { name: "Name", email: "Email", phone: "Phone", property: "Property type", bill: "Monthly bill", location: "Location", roof: "Roof", battery: "Battery storage", message: "Message" };
  return (Object.keys(L) as (keyof typeof L)[])
    .filter((k) => d[k] != null)
    .map((k, i) => `<tr${i % 2 ? "" : ' style="background:#f3f4f6"'}><td style="padding:10px 12px;font-weight:bold;width:38%">${L[k]}</td><td style="padding:10px 12px">${esc(d[k])}</td></tr>`)
    .join("");
};

const shell = (title: string, intro: string, table: string, foot: string) => `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#14212B">
<h2 style="border-bottom:3px solid #B7E35A;padding-bottom:10px">${title}</h2><p style="color:#4b5563">${intro}</p>
<table style="width:100%;border-collapse:collapse;margin-top:12px">${table}</table>
<p style="margin-top:24px;color:#6b7280;font-size:12px">${foot}</p></body></html>`;

async function send(key: string, payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.ok) return "sent";
  console.error("Resend", res.status, (await res.text()).slice(0, 300));
  return `failed_${res.status}`;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return json({ ok: false, error: "invalid", field: "body" }, 400);

  const v = validate(body as Record<string, unknown>);
  if ("field" in v) return json({ ok: false, error: "invalid", field: v.field }, 400);
  const d = v.data;

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // Client IP: forwarded by the site's API route; falls back to the caller's address.
  const ip = req.headers.get("x-client-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = await sha256(ip + "|solar-demo");
  const since = new Date(Date.now() - 3600_000).toISOString();
  const [{ count: mine }, { count: all }] = await Promise.all([
    db.from("solar_requests").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since),
    db.from("solar_requests").select("id", { count: "exact", head: true }).gte("created_at", since),
  ]);
  if ((mine ?? 0) >= PER_IP_PER_HOUR || (all ?? 0) >= GLOBAL_PER_HOUR) {
    return json({ ok: false, error: "rate_limited" }, 429);
  }

  const { data: saved, error: dbError } = await db
    .from("solar_requests")
    .insert({ ...d, privacy_consent: true, ip_hash: ipHash })
    .select("id")
    .single();
  if (dbError || !saved) {
    console.error("DB insert", dbError?.message);
    return json({ ok: false, error: "storage" }, 500);
  }

  const key = Deno.env.get("RESEND_API_KEY");
  let alert = "no_key", confirm = "no_key";
  if (key) {
    const when = new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" });
    const it = d.locale === "it";
    const subjectKind = d.kind === "quote" ? "preventivo" : "messaggio";
    alert = await send(key, {
      from: FROM,
      to: [ALERT_INBOX],
      reply_to: d.email,
      subject: `☀️ Nuova richiesta di ${subjectKind} #${saved.id}: ${d.name}`,
      html: shell(
        `Nuova richiesta di ${subjectKind} #${saved.id}`,
        `Dal sito demo Aurevo Energia (lingua: ${d.locale.toUpperCase()}). Rispondi a questa email per scrivere al cliente.`,
        rows(d, true),
        `Ricevuta il ${when} · salvata nel database (solar_requests #${saved.id})`,
      ),
    });
    confirm = await send(key, {
      from: FROM,
      to: [d.email],
      subject: it ? `Abbiamo ricevuto la tua richiesta (#${saved.id})` : `We received your request (#${saved.id})`,
      html: shell(
        it ? `Grazie, ${esc(d.name)}!` : `Thank you, ${esc(d.name)}!`,
        it
          ? "Abbiamo ricevuto la tua richiesta. Ti contatteremo entro un giorno lavorativo per fissare un sopralluogo gratuito. Ecco un riepilogo:"
          : "We have received your request. We will contact you within one working day to book a free site survey. Here is a summary:",
        rows(d, it),
        it
          ? "Aurevo Energia è un'azienda fittizia: questo è un sito dimostrativo di Crescita Digitale Italia."
          : "Aurevo Energia is a fictional company: this is a demo website by Crescita Digitale Italia.",
      ),
    });
  }
  await db.from("solar_requests").update({ alert_status: alert, confirm_status: confirm }).eq("id", saved.id);

  return json({ ok: true, id: saved.id, alert, confirm });
});
