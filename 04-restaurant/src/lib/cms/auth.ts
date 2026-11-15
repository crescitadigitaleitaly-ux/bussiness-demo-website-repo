import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";

/**
 * Admin login for the restaurant owner: one email + password, set in environment variables.
 *
 *   ADMIN_EMAIL            the owner's email
 *   ADMIN_PASSWORD_HASH    from `node scripts/hash-password.mjs` (scrypt, never the plain password)
 *   ADMIN_SESSION_SECRET   32+ random characters, used to sign the session cookie
 *
 * If any of them is missing, the admin panel is switched off (404 in production).
 */

const SESSION_HOURS = 8;
const isProd = process.env.NODE_ENV === "production";
export const COOKIE = isProd ? "__Host-lanterna_admin" : "lanterna_admin";

function config() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  if (!email || !hash?.startsWith("scrypt:") || secret.length < 32) return null;
  return { email, hash, secret };
}

export const adminConfigured = () => config() !== null;

const sameText = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

/** Format: scrypt:N:r:p:saltBase64url:hashBase64url (no "$", which .env files would try to expand). */
function verifyPassword(password: string, stored: string) {
  const [, n, r, p, salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const actual = scryptSync(password, Buffer.from(salt, "base64url"), expected.length, {
    N: Number(n), r: Number(r), p: Number(p), maxmem: 64 * 1024 * 1024,
  });
  return timingSafeEqual(actual, expected);
}

const sign = (secret: string, data: string) => createHmac("sha256", secret).update(data).digest("base64url");

// Changing the password changes this value, which logs out every existing session.
const passwordStamp = (c: NonNullable<ReturnType<typeof config>>) => sign(c.secret, c.hash).slice(0, 16);

function makeToken(c: NonNullable<ReturnType<typeof config>>) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_HOURS * 3_600_000, pw: passwordStamp(c) })).toString("base64url");
  return `${payload}.${sign(c.secret, payload)}`;
}

function readToken(token: string | undefined) {
  const c = config();
  if (!c || !token) return null;
  const [payload, mac] = token.split(".");
  if (!payload || !mac || !sameText(mac, sign(c.secret, payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp: number; pw: string };
    if (typeof data.exp !== "number" || data.exp < Date.now() || data.pw !== passwordStamp(c)) return null;
    return { email: c.email };
  } catch {
    return null;
  }
}

/** The signed-in admin, or null. Reads the request cookie, so call it behind a <Suspense> boundary. */
export async function getAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  await connection(); // the expiry check reads the clock, so this must run per request, never at prerender time
  return readToken(token);
}

// Best-effort brute-force brake: 5 wrong tries lock that IP + email for 15 minutes.
// ponytail: in-memory, so it resets per server instance; use a shared store (e.g. Upstash) for a busy real site.
const MAX_TRIES = 5;
const LOCK_MS = 15 * 60_000;
const attempts = new Map<string, { count: number; first: number; until: number }>();

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function checkLogin(email: string, password: string, ip: string): Promise<LoginResult> {
  const c = config();
  if (!c) return { ok: false, error: "The admin panel is not set up on this server." };

  const key = `${ip}|${email.trim().toLowerCase()}`;
  const now = Date.now();
  const entry = attempts.get(key);
  if (entry && entry.until > now) return { ok: false, error: "Too many attempts. Please wait 15 minutes and try again." };

  const emailOk = sameText(email.trim().toLowerCase(), c.email);
  const passOk = verifyPassword(password, c.hash); // always run, so timing doesn't reveal the email
  if (emailOk && passOk) {
    attempts.delete(key);
    (await cookies()).set(COOKIE, makeToken(c), {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_HOURS * 3600,
    });
    return { ok: true };
  }

  // Count failures within a 15-minute window; the 5th one starts the lock.
  const fresh = !entry || now - entry.first > LOCK_MS || entry.until !== 0;
  const count = fresh ? 1 : entry.count + 1;
  attempts.set(key, { count, first: fresh ? now : entry.first, until: count >= MAX_TRIES ? now + LOCK_MS : 0 });
  if (attempts.size > 5000) attempts.clear(); // keep memory bounded
  await new Promise((r) => setTimeout(r, 400));
  return { ok: false, error: "Email or password is incorrect." };
}

export async function logout() {
  // Expire it with the same attributes it was set with: browsers ignore a "__Host-" cookie written without Secure.
  (await cookies()).set(COOKIE, "", { httpOnly: true, secure: isProd, sameSite: "strict", path: "/", maxAge: 0 });
}

/** For admin pages: 404 when the panel isn't set up in production, login page when signed out. */
export async function requireAdmin() {
  if (!adminConfigured() && isProd) notFound();
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
