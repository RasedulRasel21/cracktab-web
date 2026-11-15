import Link from "next/link";
import { croSteps } from "../../lib/cro";
import { SectionHead } from "./ui";

/** Homepage summary of the CRO process; the full version is /how-we-work. */
export default function HomeCroFlow() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            eyebrow="How we do CRO"
            title="Research, Build, Test, Repeat. Every Month."
            body="Seven steps, run by one team. Every change starts with your data and stays live only if it earns more revenue per visitor."
          />
          <Link
            href="/how-we-work"
            className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-surface px-6 font-display text-sm font-semibold uppercase tracking-wide text-foreground hover:border-foreground"
          >
            See the full process →
          </Link>
        </div>

        <ol className="-mx-5 mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-7 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
          {croSteps.map((s, i) => (
            <li key={s.no} className="relative w-[70%] shrink-0 snap-start sm:w-[40%] lg:w-auto">
              <Link
                href={`/how-we-work#step-${s.no}`}
                className="group flex h-full flex-col rounded-3xl border border-line bg-surface p-5 transition-colors hover:border-foreground"
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-display text-xs font-bold text-accent-ink">
                    {s.no}
                  </span>
                  {i < croSteps.length - 1 && <span aria-hidden="true" className="h-px flex-1 bg-line" />}
                </span>
                <span className="mt-4 font-display text-lg font-bold text-foreground">{s.title}</span>
                <span className="mt-1 text-sm font-medium text-[var(--olive)]">{s.when}</span>
                <span className="mt-3 text-[0.95rem] leading-relaxed text-muted">{s.deliverable}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
