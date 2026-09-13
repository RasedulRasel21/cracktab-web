"use server";

import { revalidatePath } from "next/cache";
import {
  createSession,
  hashPassword,
  requireUser,
  verifyPassword,
} from "../../lib/auth";
import { prisma } from "../../lib/db";
import { validatePassword } from "../../lib/passwords";
import { LIMITS, checkThrottle, clearThrottle, recordFailure } from "../../lib/throttle";

export type AccountState = {
  error: string | null;
  success?: string;
  /** Changes on every success, so the client can tell two apart. */
  at?: number;
};

export async function updateProfile(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const user = await requireUser();

  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const bio = String(formData.get("bio") ?? "").trim().slice(0, 600) || null;

  if (!name) return { error: "Your name can't be empty." };

  try {
    await prisma.user.update({ where: { id: user.id }, data: { name, bio } });
  } catch (error) {
    console.error("[account] profile update failed", error);
    return { error: "Couldn't save your profile." };
  }

  // Name and bio appear on published posts, which are cached for an hour.
  revalidatePath("/blog", "layout");

  return { error: null, success: "Profile saved.", at: Date.now() };
}

/**
 * Requires the current password, even though the person is signed in: a
 * session left open on a shared machine must not be enough to take the account
 * over permanently. That makes this a second password check, so it gets its
 * own attempt limit.
 */
export async function changeOwnPassword(
  _prev: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const user = await requireUser();

  const current = String(formData.get("current") ?? "").slice(0, 1024);
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const key = `pwchange:${user.id}`;

  try {
    const gate = await checkThrottle([key]);
    if (gate.locked) {
      const minutes = Math.max(1, Math.ceil(gate.retryAfterMs / 60_000));
      return { error: `Too many wrong attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` };
    }

    const row = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (!row || !(await verifyPassword(current, row.passwordHash))) {
      await recordFailure(key, LIMITS.account);
      return { error: "Your current password isn't right." };
    }
    await clearThrottle(key);

    if (password !== confirm) return { error: "The two new passwords don't match." };
    if (password === current) return { error: "That's the password you already have." };

    const weak = validatePassword(password, user);
    if (weak) return { error: weak };

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(password),
        sessionVersion: { increment: 1 },
      },
      select: { id: true, name: true, email: true, role: true, sessionVersion: true },
    });

    // Every other session just ended; keep this one.
    await createSession(updated);
  } catch (error) {
    console.error("[account] password change failed", error);
    return { error: "Couldn't change your password." };
  }

  return {
    error: null,
    success: "Password changed. Every other device has been signed out.",
    at: Date.now(),
  };
}
