"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { hashPassword, requireAdmin } from "../../lib/auth";
import { prisma } from "../../lib/db";

export type UserFormState = {
  error: string | null;
  /** Shown once, immediately after creating an account or resetting one. */
  password?: string;
  name?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Readable when typed by hand off a screen — no characters that are ambiguous
 * in most fonts, and long enough that the ambiguity trade costs nothing.
 */
function generatePassword(): string {
  return randomBytes(18)
    .toString("base64url")
    .replace(/[-_]/g, "")
    .slice(0, 20);
}

/**
 * Creates an account and returns its password once. There is no email
 * transport for this, and no self-service reset — an admin hands the password
 * over and the person can be told to change it. That is a deliberate limit of
 * a two-person team's CMS, not an oversight.
 */
export async function createUser(
  _prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = formData.get("role") === "ADMIN" ? "ADMIN" : "AUTHOR";
  const bio = String(formData.get("bio") ?? "").trim() || null;

  if (!name) return { error: "Enter a name." };
  if (!EMAIL_RE.test(email)) return { error: "That doesn't look like an email address." };

  const password = generatePassword();

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) return { error: "Someone already has that email address." };

    await prisma.user.create({
      data: { name, email, role, bio, passwordHash: await hashPassword(password) },
    });
  } catch (error) {
    console.error("[users] create failed", error);
    return { error: "Couldn't create the account. Check the connection." };
  }

  // Returned rather than redirected, because the password is displayed once
  // and a redirect would lose it.
  return { error: null, password, name };
}

export async function resetPassword(
  _prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");

  const password = generatePassword();

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: await hashPassword(password) },
      select: { name: true },
    });

    console.info(`[users] ${admin.email} reset the password for ${user.name}`);
    return { error: null, password, name: user.name };
  } catch (error) {
    console.error("[users] reset failed", error);
    return { error: "Couldn't reset that password." };
  }
}

export async function deleteUser(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");

  // Locking yourself out of the only admin account is unrecoverable without
  // database access.
  if (userId === admin.id) redirect("/admin/users?error=self");

  const posts = await prisma.post.count({ where: { authorId: userId } });
  if (posts > 0) {
    // `onDelete: Restrict` on Post.author would reject this anyway; catching
    // it here explains why instead of surfacing a constraint error.
    redirect("/admin/users?error=posts");
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
  } catch (error) {
    console.error("[users] delete failed", error);
    redirect("/admin/users?error=1");
  }

  redirect("/admin/users?deleted=1");
}
