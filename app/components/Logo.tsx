import Link from "next/link";

/**
 * Cracktab wordmark: three "traffic-light" dots + lowercase wordmark.
 * Pure CSS/SVG-free so it renders instantly with zero image requests.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Cracktab — home"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent" />
      </span>
      <span className="font-display text-[1.35rem] font-bold lowercase leading-none tracking-tight text-white">
        cracktab
      </span>
    </Link>
  );
}
