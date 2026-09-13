import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { LOGIN_PATH, STUDIO_BASE } from "./paths";

/**
 * Session auth for the studio.
 *
 * Email + password with a signed cookie. No public signup, accounts created by
 * an admin, a handful of internal writers — narrow enough that hand-rolling is
 * defensible, with no OAuth or adapter to keep in sync.
 *
 * The cookie is a JWT, but it is NOT trusted on its own. An earlier version
 * checked only the signature, which meant a deleted account, a demoted admin
 * or a changed password all left existing sessions working for up to a week.
 * The token now carries only an account id and a session version; every
 * studio request re-reads the account and rejects the token if the account is
 * gone or the version has moved on. Role, name and email come from the
 * database, never from the cookie.
 */

export const SESSION_COOKIE = "cracktab_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "AUTHOR";
  sessionVersion: number;
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

/**
 * A real hash, generated once per instance, to compare against when an email
 * doesn't exist. It must be a valid bcrypt hash: a malformed placeholder makes
 * `compare` throw instead of returning false, which turns "no such account"
 * into a different error than "wrong password" — the exact leak it prevents.
 */
let dummyHash: Promise<string> | null = null;
const getDummyHash = () =>
  (dummyHash ??= bcrypt.hash("timing-equaliser-not-a-real-credential", 12));

// ---------------------------------------------------------------- session

export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({ sv: user.sessionVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Signature and expiry only. Never use this alone to grant access. */
async function readToken(): Promise<{ id: string; sv: number } | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    // Pinning the algorithm stops a token signed some other way — including
    // "none" — from being accepted.
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    if (!payload.sub || typeof payload.sv !== "number") return null;
    return { id: payload.sub, sv: payload.sv };
  } catch {
    return null;
  }
}

/**
 * The one function that decides whether someone is signed in: a valid
 * signature AND a live account whose session version still matches.
 */
export async function getVerifiedUser(): Promise<SessionUser | null> {
  const token = await readToken();
  if (!token) return null;

  const user = await prisma.user.findUnique({
    where: { id: token.id },
    select: { id: true, name: true, email: true, role: true, sessionVersion: true },
  });

  if (!user || user.sessionVersion !== token.sv) return null;
  return user;
}

/**
 * For studio pages and actions. Redirects rather than throwing so an ended
 * session lands on the sign-in form instead of an error page.
 *
 * It deliberately doesn't clear the stale cookie: cookies can't be written
 * during a render. The cookie is harmless — it fails this check every time —
 * and the next sign-in overwrites it.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getVerifiedUser();
  if (!user) redirect(LOGIN_PATH);
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect(STUDIO_BASE);
  return user;
}

/**
 * Ends every session for an account — call after a password or role change.
 * The current request's own cookie is re-issued by the caller if needed.
 */
export async function revokeSessions(userId: string): Promise<number> {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { sessionVersion: { increment: 1 } },
    select: { sessionVersion: true },
  });
  return updated.sessionVersion;
}

// ---------------------------------------------------------------- login

/**
 * Verifies credentials. Returns null for both "no such user" and "wrong
 * password", and runs a hash comparison either way so response time doesn't
 * reveal which accounts exist.
 */
export async function authenticate(
  email: string,
  password: string,
): Promise<SessionUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      sessionVersion: true,
      passwordHash: true,
    },
  });

  const ok = await verifyPassword(password, user?.passwordHash ?? (await getDummyHash()));
  if (!user || !ok) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    sessionVersion: user.sessionVersion,
  };
}
