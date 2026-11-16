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
  eyebrowIsH1 = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Optional CTA rendered under the subtitle, above the fold. */
  action?: ReactNode;
  center?: boolean;
  /** SEO pattern: the eyebrow pill is the H1 and the big title renders as a <p>. */
  eyebrowIsH1?: boolean;
}) {
  const Eyebrow = eyebrowIsH1 ? "h1" : "span";
  const Title = eyebrowIsH1 ? "p" : "h1";
  return (
    <section className="relative overflow-hidden pb-14 pt-32 sm:pb-20 sm:pt-40">
      {/* subtle lime glow */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-80 ${
          center
            ? "bg-[radial-gradient(60rem_28rem_at_50%_-10%,rgba(180,240,58,0.18),transparent_70%)]"
            : "bg-[radial-gradient(60rem_28rem_at_20%_-10%,rgba(180,240,58,0.18),transparent_70%)]"
        }`}
      />
      <div
        className={`relative mx-auto w-full max-w-360 px-5 sm:px-8 ${
          center ? "flex flex-col items-center text-center" : ""
        }`}
      >
        {eyebrow && (
          <Eyebrow className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-2 font-display text-xs font-bold uppercase leading-snug tracking-[0.18em] text-foreground sm:text-sm">
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-accent ring-1 ring-[#141413]/15" />
            {eyebrow}
          </Eyebrow>
        )}
        <Title className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.025em] text-foreground">
          {title}
        </Title>
        {subtitle && (
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">
            {subtitle}
          </p>
        )}
        {action && <div className="mt-8">{action}</div>}
      </div>
    </section>
  );
}
