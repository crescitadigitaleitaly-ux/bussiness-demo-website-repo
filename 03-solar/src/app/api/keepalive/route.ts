/**
 * Daily keep-alive for the free Supabase project (it pauses after 7 days without activity, which would stop
 * the quote form and the agency contact form). Called by the Vercel cron in vercel.json.
 * Calls the database function public.keepalive() (returns only the server time, reads no table) through
 * Supabase's REST API with the public anon key. The call itself counts as activity.
 */
export async function GET(request: Request) {
  // If CRON_SECRET is set on Vercel, only the cron (which sends it) may call this.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const fn = process.env.QUOTE_FUNCTION_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!fn || !key) return Response.json({ ok: false, error: "not configured" }, { status: 500 });

  const base = new URL(fn).origin;
  try {
    const res = await fetch(`${base}/rest/v1/rpc/keepalive`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: "{}",
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    return Response.json({ ok: res.ok, status: res.status, at: new Date().toISOString() }, { status: res.ok ? 200 : 502 });
  } catch {
    return Response.json({ ok: false, error: "unreachable" }, { status: 502 });
  }
}
