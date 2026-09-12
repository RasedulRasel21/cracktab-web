"use client";

import { usePathname } from "next/navigation";

/**
 * Hides the marketing header and footer on the studio routes.
 *
 * The dashboard is a workspace, not a page of the site — the nav, the "Book a
 * call" button and the footer sitemap are noise there, and the studio has its
 * own header.
 *
 * Children are passed through rather than imported, so Header and Footer stay
 * Server Components; only this wrapper ships to the browser.
 */
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;

  return <>{children}</>;
}
