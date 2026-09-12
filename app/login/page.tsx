import type { Metadata } from "next";
import LoginForm from "./LoginForm";

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

  return (
    <section className="flex min-h-dvh items-center justify-center px-5 py-16 sm:px-8">
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
          <LoginForm next={next ?? "/admin"} />
        </div>
      </div>
    </section>
  );
}
