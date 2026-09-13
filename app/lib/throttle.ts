import { prisma } from "./db";

/**
 * Sign-in rate limiting, stored in Postgres.
 *
 * Not in memory: every serverless instance has its own, so an in-process
 * counter resets per instance and an attacker simply spreads attempts across
 * them. Three counters, because each closes a different attack:
 *
 *   acct:<email>|<ip>   one source hammering one account          — 5
 *   acctAll:<email>     many sources hammering one account          — 30
 *   ip:<ip>             one source spraying across many accounts    — 25
 *
 * The per-account counter is keyed with the IP on purpose. Keyed by email
 * alone, anyone could lock the real admin out just by failing logins against
 * their address. The higher account-wide limit still catches a distributed
 * attack, at a threshold that takes a deliberate effort to reach.
 */

const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;
const RETAIN_MS = 24 * 60 * 60 * 1000;

export const LIMITS = { account: 5, accountAll: 30, ip: 25 } as const;

export async function checkThrottle(
  keys: string[],
): Promise<{ locked: boolean; retryAfterMs: number }> {
  const now = Date.now();
  const rows = await prisma.loginThrottle.findMany({
    where: { key: { in: keys } },
    select: { lockedUntil: true },
  });

  const active = rows
    .map((row) => row.lockedUntil?.getTime() ?? 0)
    .filter((until) => until > now);

  return active.length
    ? { locked: true, retryAfterMs: Math.max(...active) - now }
    : { locked: false, retryAfterMs: 0 };
}

export async function recordFailure(key: string, limit: number): Promise<void> {
  const now = new Date();
  const row = await prisma.loginThrottle.findUnique({ where: { key } });

  // A counter left alone longer than the window starts over.
  const stale = !row || now.getTime() - row.updatedAt.getTime() > WINDOW_MS;
  const failures = (stale ? 0 : row.failures) + 1;
  const lockedUntil =
    failures >= limit ? new Date(now.getTime() + LOCK_MS) : stale ? null : row.lockedUntil;

  await prisma.loginThrottle.upsert({
    where: { key },
    create: { key, failures, lockedUntil },
    update: { failures, lockedUntil },
  });

  // These keys contain email addresses and IPs. Nothing needs them past a day,
  // so they don't get to accumulate.
  await prisma.loginThrottle.deleteMany({
    where: { updatedAt: { lt: new Date(now.getTime() - RETAIN_MS) } },
  });
}

export async function clearThrottle(key: string): Promise<void> {
  await prisma.loginThrottle.deleteMany({ where: { key } });
}
