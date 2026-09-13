"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authenticate, createSession } from "../lib/auth";
import { STUDIO_BASE } from "../lib/paths";
import { LIMITS, checkThrottle, clearThrottle, recordFailure } from "../lib/throttle";

export type LoginState = { error: string | null };

/** Longest valid email address per RFC 5321. */
const MAX_EMAIL = 254;
/** Well past any real password; stops an oversized body being hashed at all. */
const MAX_PASSWORD = 1024;

/**
 * The caller's IP. On Vercel `x-forwarded-for` is written by the platform's
 * edge, so its first entry is trustworthy. Self-hosted without a trusted
 * reverse proxy in front, a client could forge this header — and the per-IP
 * counters would stop meaning anything.
 */
async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

/**
 * The failure message is identical for an unknown email and a wrong password.
 * Distinguishing them turns a sign-in form into an account-enumeration tool.
 */
export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()
    .slice(0, MAX_EMAIL);
  const password = String(formData.get("password") ?? "").slice(0, MAX_PASSWORD);
  const next = String(formData.get("next") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const ip = await clientIp();
  const keys = {
    account: `acct:${email}|${ip}`,
    accountAll: `acctAll:${email}`,
    ip: `ip:${ip}`,
  };

  try {
    const gate = await checkThrottle(Object.values(keys));
    if (gate.locked) {
      const minutes = Math.max(1, Math.ceil(gate.retryAfterMs / 60_000));
      return {
        error: `Too many sign-in attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
      };
    }
  } catch (error) {
    console.error("[login] throttle check failed", error);
    return { error: "Couldn't reach the database. Try again in a moment." };
  }

  let user;
  try {
    user = await authenticate(email, password);
  } catch (error) {
    console.error("[login] authentication failed", error);
    return { error: "Couldn't reach the database. Try again in a moment." };
  }

  if (!user) {
    await Promise.all([
      recordFailure(keys.account, LIMITS.account),
      recordFailure(keys.accountAll, LIMITS.accountAll),
      recordFailure(keys.ip, LIMITS.ip),
    ]).catch((error) => console.error("[login] could not record failure", error));

    return { error: "Those details don't match an account." };
  }

  await Promise.all([clearThrottle(keys.account), clearThrottle(keys.accountAll)]).catch(
    (error) => console.error("[login] could not clear throttle", error),
  );

  await createSession(user);

  // Only ever back into the studio. Anything else — including an external URL
  // smuggled in as `next` — goes to the studio home instead.
  const safe =
    next === STUDIO_BASE ||
    next.startsWith(`${STUDIO_BASE}/`) ||
    next.startsWith(`${STUDIO_BASE}?`);

  redirect(safe ? next : STUDIO_BASE);
}
