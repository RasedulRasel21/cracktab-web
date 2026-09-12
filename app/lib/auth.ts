import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

/**
 * Session auth for /admin.
 *
 * Email + password with a signed cookie, deliberately small: there is no
 * public signup, accounts are created by an admin, and the whole audience is
 * a handful of internal writers. That narrowness is what makes hand-rolling
 * defensible — no OAuth providers, no reset-token flow, no adapter to keep in
 * sync with the schema.
 *
 * The session is a JWT rather than a database row so that /admin doesn't cost
 * a round trip to New York on every request. The trade is revocation: a stolen
 * cookie stays valid until it expires, which is why the window is a week and
 * not a year. Changing a password does not retire existing sessions.
 */

const COOKIE = "cracktab_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "AUTHOR";
};

function secret(): Uint8Array {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Generate one with `openssl rand -base64 32`.",
    );
  }
  return new TextEncoder().encode(value);
}

// ---------------------------------------------------------------- passwords

/** Cost 12 — a few hundred ms per attempt, which is the point. */
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ---------------------------------------------------------------- session

export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/** The signed session, or null. Does not touch the database. */
export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    return {
      id: payload.sub,
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
      role: payload.role === "ADMIN" ? "ADMIN" : "AUTHOR",
    };
  } catch {
    // Expired, tampered with, or signed under a rotated secret.
    return null;
  }
}

/**
 * For admin pages and actions. Redirects rather than throwing so an expired
 * session lands on the login form instead of an error page.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/admin");
  return user;
}

// ---------------------------------------------------------------- login

/**
 * Verifies credentials against the database. Returns null for both "no such
 * user" and "wrong password", and runs a hash comparison either way so the
 * response time doesn't reveal which accounts exist.
 */
export async function authenticate(
  email: string,
  password: string,
): Promise<SessionUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: { id: true, name: true, email: true, role: true, passwordHash: true },
  });

  // A bcrypt hash of a throwaway value, compared against when the account
  // doesn't exist so both paths cost the same.
  const hash =
    user?.passwordHash ??
    "$2b$12$C6UzMDM.H6dfI/f/IKcEeO3Q8Z2Hn0kYBLpUAyQPxvL0J4kqQZ9Wy";

  const ok = await verifyPassword(password, hash);
  if (!user || !ok) return null;

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
