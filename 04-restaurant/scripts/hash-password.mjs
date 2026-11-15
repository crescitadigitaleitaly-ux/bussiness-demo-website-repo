// Creates the ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET values for the admin panel.
// The plain password is never stored anywhere.
// Usage: node scripts/hash-password.mjs "the owner's password"
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error('Give a password of at least 12 characters: node scripts/hash-password.mjs "..."');
  process.exit(1);
}
const [N, r, p] = [16384, 8, 1];
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64, { N, r, p, maxmem: 64 * 1024 * 1024 });
console.log(`ADMIN_PASSWORD_HASH=scrypt:${N}:${r}:${p}:${salt.toString("base64url")}:${hash.toString("base64url")}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("base64url")}`);
