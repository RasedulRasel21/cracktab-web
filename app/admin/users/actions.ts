"use server";

import { redirect } from "next/navigation";
import { studio } from "../../lib/paths";
import { createSession, hashPassword, requireAdmin } from "../../lib/auth";
import { prisma } from "../../lib/db";
import { validatePassword } from "../../lib/passwords";

export type UserFormState = {
  error: string | null;
  success?: string;
  /** Changes on every success, so the client can tell two apart. */
  at?: number;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Creates an account with a password the admin chooses (or generates in the
 * form). There is no email transport and no self-signup: the admin hands the
 * password over, and the person can change it from their own account page.
 */
export async function createUser(
  _prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 254);
  const role = formData.get("role") === "ADMIN" ? "ADMIN" : "AUTHOR";
  const bio = String(formData.get("bio") ?? "").trim().slice(0, 600) || null;
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!name) return { error: "Enter a name." };
  if (!EMAIL_RE.test(email)) return { error: "That doesn't look like an email address." };
  if (password !== confirm) return { error: "The two passwords don't match." };

  const weak = validatePassword(password, { email, name });
  if (weak) return { error: weak };

  try {
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) return { error: "Someone already has that email address." };

    await prisma.user.create({
      data: { name, email, role, bio, passwordHash: await hashPassword(password) },
    });
  } catch (error) {
    console.error("[users] create failed", error);
    return { error: "Couldn't create the account. Check the connection." };
  }

  return {
    error: null,
    success: `${name}'s account is ready. Share the password with them somewhere private.`,
    at: Date.now(),
  };
}

/**
 * An admin sets someone's password. Every existing session for that account
 * ends in the same write, so a leaked old password can't keep a cookie alive.
 */
export async function setUserPassword(
  _prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password !== confirm) return { error: "The two passwords don't match." };

  try {
    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });
    if (!target) return { error: "That account no longer exists." };

    const weak = validatePassword(password, target);
    if (weak) return { error: weak };

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: await hashPassword(password),
        sessionVersion: { increment: 1 },
      },
      select: { id: true, name: true, email: true, role: true, sessionVersion: true },
    });

    // Changing your own password here ends your own sessions too. Re-issue
    // this one so the admin doing it isn't thrown out mid-task.
    const isSelf = updated.id === admin.id;
    if (isSelf) await createSession(updated);

    console.info(`[users] ${admin.email} set the password for ${updated.email}`);

    return {
      error: null,
      success: isSelf
        ? "Your password is changed. Your other devices have been signed out."
        : `${updated.name}'s password is set, and they've been signed out everywhere.`,
      at: Date.now(),
    };
  } catch (error) {
    console.error("[users] set password failed", error);
    return { error: "Couldn't set that password." };
  }
}

export async function deleteUser(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");

  // Locking yourself out of the only admin account is unrecoverable without
  // database access.
  if (userId === admin.id) redirect(studio("/users?error=self"));

  const posts = await prisma.post.count({ where: { authorId: userId } });
  if (posts > 0) {
    // `onDelete: Restrict` on Post.author would reject this anyway; catching
    // it here explains why instead of surfacing a constraint error.
    redirect(studio("/users?error=posts"));
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
  } catch (error) {
    console.error("[users] delete failed", error);
    redirect(studio("/users?error=1"));
  }

  redirect(studio("/users?deleted=1"));
}
