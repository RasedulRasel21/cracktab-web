import Link from "next/link";
import BookCallButton from "./BookCallButton";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-black py-24 sm:py-32">
      {/* Accent glow — same vocabulary as the CtaBand, anchored left so it
          sits behind the headline rather than the copy. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45rem_22rem_at_12%_0%,rgba(180,240,58,0.10),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-360 px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-end lg:gap-16">
          {/* Left — eyebrow + headline */}
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Get in touch
            </span>
            <h2 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.02] tracking-tight text-white">
              Let&apos;s work <span className="text-accent">together</span>
            </h2>
          </div>

          {/* Right — copy + actions */}
          <div className="lg:pb-2">
            <p className="max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
              Great stores come from teams that are close enough to care — and
              opinionated enough to change things.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <BookCallButton className="inline-flex h-13 items-center justify-center rounded-full bg-accent px-8 font-display text-sm font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong" />
              <Link
                href="/contact"
                className="inline-flex h-13 items-center justify-center rounded-full border border-line px-8 font-display text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-accent hover:text-accent"
              >
                Start a Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
