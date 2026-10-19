import { createHmac, scryptSync, timingSafeEqual, createHash } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Single-administrator authentication for Website Settings. Server-only.
 *
 * Configure in the server environment (never in client code):
 *   ADMIN_USERNAME        login name (default "admin")
 *   ADMIN_PASSWORD_HASH   scrypt hash from `pnpm --filter @skyvoice/web admin:hash-password`
 *   ADMIN_SESSION_SECRET  32+ random characters used to sign session cookies
 * ADMIN_PASSWORD (plain text) is accepted instead of the hash for local
 * development only and is ignored in production.
 * If these are missing, the admin area stays locked for everyone.
 */

export const SESSION_COOKIE = "sv_admin_session";
const SESSION_HOURS = 8;

type Session = { user: string; exp: number };

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  return secret.length >= 32 ? secret : null;
}

export function adminUsername() {
  return process.env.ADMIN_USERNAME?.trim() || "admin";
}

export function adminConfigured() {
  const plainAllowed = process.env.NODE_ENV !== "production" && Boolean(process.env.ADMIN_PASSWORD);
  return Boolean(sessionSecret() && (process.env.ADMIN_PASSWORD_HASH || plainAllowed));
}

const sha256 = (value: string) => createHash("sha256").update(value).digest();

/** Format: scrypt:<saltBase64>:<hashBase64> (N=16384, r=8, p=1, 64-byte key). */
export function hashPassword(password: string, salt: Buffer) {
  const hash = scryptSync(password, salt, 64);
  return `scrypt:${salt.toString("base64")}:${hash.toString("base64")}`;
}

function passwordMatches(password: string) {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (stored) {
    const [scheme, salt, hash] = stored.split(":");
    if (scheme !== "scrypt" || !salt || !hash) return false;
    const expected = Buffer.from(hash, "base64");
    const actual = scryptSync(password, Buffer.from(salt, "base64"), expected.length);
    return expected.length > 0 && timingSafeEqual(actual, expected);
  }
  const plain = process.env.NODE_ENV !== "production" ? process.env.ADMIN_PASSWORD : undefined;
  return Boolean(plain) && timingSafeEqual(sha256(password), sha256(plain!));
}

export function credentialsValid(username: string, password: string) {
  if (!adminConfigured()) return false;
  // Evaluate both so a wrong username takes as long as a wrong password.
  const userOk = timingSafeEqual(sha256(username.trim()), sha256(adminUsername()));
  const passwordOk = passwordMatches(password);
  return userOk && passwordOk;
}

const sign = (payload: string, secret: string) =>
  createHmac("sha256", secret).update(payload).digest("base64url");

export function createSessionToken(user: string, now = Date.now()) {
  const secret = sessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured.");
  const payload = Buffer.from(
    JSON.stringify({ exp: now + SESSION_HOURS * 3600_000, user } satisfies Session),
  ).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function readSessionToken(token: string | undefined, now = Date.now()): Session | null {
  const secret = sessionSecret();
  if (!secret || !token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload, secret));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Session;
    if (typeof session.exp !== "number" || session.exp < now) return null;
    if (session.user !== adminUsername()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  return readSessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}

/** Use at the top of every admin page and Server Action. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function startSession(user: string) {
  (await cookies()).set(SESSION_COOKIE, createSessionToken(user), {
    httpOnly: true,
    maxAge: SESSION_HOURS * 3600,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
