"use server";

import { redirect } from "next/navigation";
import { authenticate, createSession } from "../lib/auth";

export type LoginState = { error: string | null };

/**
 * The error message is deliberately the same for an unknown email and a wrong
 * password — telling an attacker which half was right turns a login form into
 * an account-enumeration tool.
 */
export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  let user;
  try {
    user = await authenticate(email, password);
  } catch (error) {
    console.error("[login] authentication failed", error);
    return {
      error: "Couldn't reach the database. Try again in a moment.",
    };
  }

  if (!user) return { error: "Those details don't match an account." };

  await createSession(user);

  // Only ever redirect within this site — an open redirect here would let a
  // phishing link bounce a freshly authenticated user off-domain.
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/admin");
}
