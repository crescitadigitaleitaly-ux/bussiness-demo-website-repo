import { MIN_FILL_MS, requestSchema } from "@/lib/schema";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "invalid", issues: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 400 });
  }

  const data = parsed.data;
  // Bots: pretend success so they don't retry, but drop the submission.
  if (data.website || Date.now() - data.startedAt < MIN_FILL_MS) {
    return Response.json({ ok: true, demo: true });
  }

  // DEMO MODE: nothing is sent or stored. See README > "Connecting the form" to deliver
  // submissions via an email API (e.g. Resend) or a CRM/booking webhook.
  return Response.json({ ok: true, demo: true });
}
