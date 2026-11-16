import Link from "next/link";
import BookCallButton from "../BookCallButton";
import { ecomManager } from "../../lib/cro";
import { SectionHead } from "./ui";

/** "Hire us as your ecommerce manager" — benefits and an in-house comparison. */
export default function HomeEcomManager() {
  return (
    <section className="py-14 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
        <SectionHead eyebrow={ecomManager.eyebrow} title={ecomManager.title} body={ecomManager.body} />

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ecomManager.benefits.map((b, i) => (
              <li key={b.title} className="rounded-3xl border border-line bg-surface p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent font-display text-sm font-bold text-accent-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-foreground">{b.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted">{b.body}</p>
              </li>
            ))}
          </ul>

          <div className="on-dark flex flex-col rounded-3xl bg-[#141413] p-5 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">In-house hire vs Cracktab</p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-2 bg-white/5 px-4 py-3 text-sm font-semibold text-white sm:grid-cols-[1.1fr_1fr_1fr]">
                <span className="hidden sm:block" />
                <span className="text-white/60">In-house</span>
                <span className="text-accent">Cracktab</span>
              </div>
              {ecomManager.compare.map(([k, a, b]) => (
                <div key={k} className="grid grid-cols-2 gap-x-3 gap-y-1 border-t border-white/10 px-4 py-3.5 text-[0.95rem] sm:grid-cols-[1.1fr_1fr_1fr] sm:gap-2">
                  <span className="col-span-2 text-sm font-semibold uppercase tracking-[0.08em] text-white/60 sm:col-span-1 sm:text-[0.95rem] sm:normal-case sm:tracking-normal sm:text-white">{k}</span>
                  <span className="text-white/60">{a}</span>
                  <span className="font-medium text-white">{b}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              <BookCallButton className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 font-display text-sm font-semibold uppercase tracking-wide text-accent-ink hover:bg-accent-strong">
                Talk to us
              </BookCallButton>
              <Link
                href="/services/ecommerce-growth-cro"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-6 font-display text-sm font-semibold uppercase tracking-wide text-white hover:border-white"
              >
                What&apos;s included
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
