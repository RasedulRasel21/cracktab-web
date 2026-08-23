import type { ReactNode } from "react";

/**
 * Shared inner-page header. Clears the fixed site header with top padding and
 * uses the same eyebrow + display-heading treatment as the homepage.
 */
export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
  center = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Optional CTA rendered under the subtitle, above the fold. */
  action?: ReactNode;
  center?: boolean;
}) {
  return (
    <section className="relative overflow-hidden pb-14 pt-32 sm:pb-20 sm:pt-40">
      {/* subtle lime glow */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-80 ${
          center
            ? "bg-[radial-gradient(60rem_28rem_at_50%_-10%,rgba(180,240,58,0.10),transparent_70%)]"
            : "bg-[radial-gradient(60rem_28rem_at_20%_-10%,rgba(180,240,58,0.10),transparent_70%)]"
        }`}
      />
      <div
        className={`relative mx-auto w-full max-w-360 px-5 sm:px-8 ${
          center ? "flex flex-col items-center text-center" : ""
        }`}
      >
        {eyebrow && (
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.04] tracking-tight text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {subtitle}
          </p>
        )}
        {action && <div className="mt-8">{action}</div>}
      </div>
    </section>
  );
}
