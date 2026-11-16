"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Cracktab wordmark: three "traffic-light" dots + lowercase wordmark.
 * Pure CSS/SVG-free so it renders instantly with zero image requests.
 */
export default function Logo({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  return (
    <Link
      href="/"
      // Already on the homepage: glide back to the top instead of reloading.
      onClick={(e) => {
        if (pathname !== "/") return;
        e.preventDefault();
        if (window.location.hash) history.replaceState(null, "", "/");
        const lenis = (window as unknown as { lenis?: { scrollTo: (t: number, o?: object) => void } }).lenis;
        if (lenis) lenis.scrollTo(0, { duration: 1.1 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      aria-label="Cracktab — home"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-accent" />
      </span>
      <span className="font-display text-[1.6rem] font-bold lowercase leading-none tracking-tight text-white">
        cracktab
      </span>
    </Link>
  );
}
