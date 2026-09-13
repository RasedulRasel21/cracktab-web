import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { getVerifiedUser } from "../lib/auth";
import { STUDIO_BASE } from "../lib/paths";

export const metadata: Metadata = {
  title: "Sign in",
  // Kept out of the index entirely — robots.ts disallows it too.
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  // Already signed in with a live session: skip the form. Checked against the
  // database rather than the cookie, so a revoked session still sees the form.
  // Kept outside the try — redirect() works by throwing.
  let signedIn = false;
  try {
    signedIn = Boolean(await getVerifiedUser());
  } catch {
    // Database unreachable: showing the form is the right fallback.
  }
  if (signedIn) redirect(STUDIO_BASE);

  return (
    <section className="studio-page flex min-h-dvh items-center justify-center px-5 py-16 sm:px-8">
      <div className="w-full max-w-sm">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Cracktab Studio
        </span>
        <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-white">
          Sign in
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          For the team. Accounts are created by an admin — there is no signup.
        </p>

        <div className="mt-8">
          <LoginForm next={next ?? STUDIO_BASE} />
        </div>
      </div>
    </section>
  );
}
