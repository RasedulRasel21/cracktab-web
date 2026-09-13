import type { Metadata } from "next";
import Link from "next/link";
import AdminNav from "./AdminNav";
import { studio } from "../lib/paths";
import { requireUser } from "../lib/auth";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

/**
 * The proxy already bounces unauthenticated requests, but it only verifies the
 * cookie signature — it runs on the Edge runtime, where Prisma can't reach
 * Postgres. This is the check that runs with database access, and it covers
 * every admin route in one place.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    // `admin-shell` swaps the site's dark palette for a light workspace —
    // see the scoped block in globals.css. The marketing header and footer are
    // hidden on these routes by ChromeGate, so no top padding is needed.
    <div className="admin-shell studio-page min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-360 flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-7">
            <Link
              href={studio()}
              className="font-display text-sm font-bold uppercase tracking-widest text-white transition-colors hover:text-accent"
            >
              Studio
            </Link>
            <AdminNav href={studio()} exact match={[studio("/posts")]}>
              Posts
            </AdminNav>
            <AdminNav href={studio("/categories")}>Categories</AdminNav>
            <AdminNav href={studio("/media")}>Media</AdminNav>
            {user.role === "ADMIN" && <AdminNav href={studio("/users")}>People</AdminNav>}
            <Link
              href="/blog"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:text-white"
            >
              View blog <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={studio("/account")}
              title="Your account"
              className="text-xs text-muted transition-colors hover:text-white"
            >
              {user.name}
              {user.role === "ADMIN" && (
                <span className="studio-badge studio-badge-emerald ml-2">Admin</span>
              )}
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="text-xs font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-360 px-5 py-10 sm:px-8 sm:py-14">
        {children}
      </main>
    </div>
  );
}
