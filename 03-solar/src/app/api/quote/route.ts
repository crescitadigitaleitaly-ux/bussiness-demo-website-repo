import { MIN_FILL_MS, requestSchema } from "@/lib/schema";

/**
 * Quote + contact form endpoint.
 * 1. Validates with the same Zod schema as the browser.
 * 2. Drops bots (honeypot field filled, or form sent faster than a human can fill it) with a fake "ok".
 * 3. Forwards the request to the Supabase Edge Function `solar-quote`, which rate-limits, stores it
 *    and sends the alert + confirmation emails (see supabase/functions/solar-quote).
 * Without QUOTE_FUNCTION_URL / SUPABASE_ANON_KEY the route stays in demo mode and sends nothing.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "invalid", issues: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 400 });
  }

  const { website, startedAt, ...data } = parsed.data;
  const url = process.env.QUOTE_FUNCTION_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  const demo = !url || !key;

  // Bots: pretend success so they don't retry, but drop the submission.
  if (website || Date.now() - startedAt < MIN_FILL_MS) {
    return Response.json(demo ? { ok: true, demo } : { ok: true });
  }
  if (demo) return Response.json({ ok: true, demo });

  // Vercel sets x-forwarded-for / x-real-ip to the visitor's address.
  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}`, apikey: key, "x-client-ip": ip },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(15_000),
    });
    const out = (await res.json().catch(() => ({}))) as { ok?: boolean; id?: number; error?: string };
    if (res.status === 429) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
    if (!res.ok || !out.ok) return Response.json({ ok: false, error: out.error ?? "upstream" }, { status: 502 });
    return Response.json({ ok: true, id: out.id });
  } catch {
    return Response.json({ ok: false, error: "upstream" }, { status: 502 });
  }
}
