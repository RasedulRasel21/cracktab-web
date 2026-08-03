import Link from "next/link";
import { CALENDLY_URL } from "../lib/site";

export default function CtaBand({
  title = "Ready to scale your ecommerce?",
  subtitle = "Let's discuss your project and create a custom solution that drives results.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-14 text-center sm:px-16 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50rem_24rem_at_50%_0%,rgba(180,240,58,0.12),transparent_70%)]"
          />
          <div className="relative">
            <h2 className="mx-auto max-w-3xl font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.08] tracking-tight text-white">
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
              {subtitle}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 items-center justify-center rounded-full bg-accent px-8 font-display text-sm font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong"
              >
                Schedule a Call
              </a>
              <Link
                href="/contact"
                className="inline-flex h-13 items-center justify-center rounded-full border border-line px-8 font-display text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-accent hover:text-accent"
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
