"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Studio nav link. The active section is marked with an underline that sits on
 * the header's bottom edge — cheaper to scan than colour alone, and it still
 * reads for anyone who can't distinguish the indigo from the slate.
 */
export default function AdminNav({
  href,
  children,
  exact = false,
  match = [],
}: {
  href: string;
  children: React.ReactNode;
  /** Match the href exactly rather than as a prefix. */
  exact?: boolean;
  /** Extra prefixes that belong to this section — the post editor lives under
   *  /admin/posts but its list is at /admin, so "Posts" owns both. */
  match?: string[];
}) {
  const pathname = usePathname();
  const active =
    (exact ? pathname === href : pathname.startsWith(href)) ||
    match.some((prefix) => pathname.startsWith(prefix));

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative -mb-4 inline-flex items-center gap-1 pb-4 text-xs font-semibold uppercase tracking-wider transition-colors ${
        active
          ? "text-accent after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[var(--studio-accent)]"
          : "text-muted hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
