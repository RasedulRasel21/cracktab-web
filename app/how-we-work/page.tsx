import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../components/PageHeader";
import BookCallButton from "../components/BookCallButton";
import Accordion from "../components/Accordion";
import CtaBand from "../components/CtaBand";
import JsonLd from "../components/JsonLd";
import { croMetrics, croSteps, croTestAreas } from "../lib/cro";
import { faq } from "../components/home/content";
import { faqSchema } from "../lib/schema";

export const metadata: Metadata = {
  title: "How We Do Shopify CRO, Step by Step",
  description:
    "Cracktab's Shopify CRO process, step by step: audit, research, prioritise, design and build, A/B test, roll out and report every month.",
  alternates: { canonical: "/how-we-work" },
};

function SectionTitle({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="max-w-3xl">
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-accent ring-1 ring-[#141413]/15" />
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.04] tracking-tight text-foreground">{title}</h2>
      {body && <p className="mt-5 text-lg leading-relaxed text-muted">{body}</p>}
    </div>
  );
}

export default function HowWeWorkPage() {
  return (
    <>
      <JsonLd data={faqSchema(faq)} />
      <PageHeader
        eyebrow="How we work"
        title={
          <>
            How we do CRO, <span className="text-accent">step by step.</span>
          </>
        }
        subtitle="No guesswork and no redesigns for the sake of it. Every change starts with research, is built by the same team that found the problem, and stays live only if it earns more revenue per visitor."
        action={
          <BookCallButton className="inline-flex h-13 items-center justify-center rounded-full bg-foreground px-8 font-display text-sm font-semibold uppercase tracking-wide text-background transition-colors hover:bg-black">
            Get a free CRO audit
          </BookCallButton>
        }
      />

      {/* Overview strip */}
      <section className="px-5 sm:px-8">
        <ol className="mx-auto flex w-full max-w-360 snap-x gap-2 overflow-x-auto pb-2 [scrollbar-width:none] lg:grid lg:grid-cols-7 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          {croSteps.map((s) => (
            <li key={s.no} className="min-w-[9.5rem] snap-start lg:min-w-0">
              <a href={`#step-${s.no}`} className="block h-full rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-foreground">
                <span className="font-display text-sm font-bold text-[var(--olive)]">{s.no}</span>
                <span className="mt-1 block font-display text-lg font-bold text-foreground">{s.title}</span>
                <span className="mt-1 block text-sm text-muted">{s.when}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* The flow in detail */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto w-full max-w-360">
          <SectionTitle eyebrow="The flow" title="Seven Steps, Repeated Every Month." body="Here is exactly what happens from the day you give us access, what you get at each step, and how long it takes." />
          <ol className="relative mt-10 space-y-5 before:absolute before:bottom-6 before:left-[1.85rem] before:top-6 before:hidden before:w-px before:bg-line sm:mt-14 sm:space-y-6 sm:before:block">
            {croSteps.map((s) => (
              <li key={s.no} id={`step-${s.no}`} className="relative scroll-mt-24 sm:pl-20">
                <span className="relative z-10 mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-accent font-display text-sm font-bold text-accent-ink sm:absolute sm:left-0 sm:top-6 sm:mb-0 sm:h-15 sm:w-15 sm:text-base">
                  {s.no}
                </span>
                <div className="grid grid-cols-1 gap-5 rounded-3xl border border-line bg-surface p-5 sm:gap-6 sm:p-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
                  <div>
                    <span className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">{s.when}</span>
                    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{s.title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">{s.summary}</p>
                    <p className="mt-5 flex items-start gap-2 rounded-2xl bg-accent/25 px-4 py-3 text-[0.95rem] font-semibold leading-snug text-foreground sm:inline-flex sm:rounded-full sm:py-2">
                      <span aria-hidden="true">📄</span>
                      <span>You get: {s.deliverable}</span>
                    </p>
                  </div>
                  <ul className="grid content-start gap-2">
                    {s.what.map((w) => (
                      <li key={w} className="flex items-start gap-3 rounded-xl bg-[var(--cream-2)] px-4 py-3 text-[0.95rem] leading-snug text-foreground sm:text-base">
                        <span aria-hidden="true" className="mt-0.5 text-[var(--olive)]">✓</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What we test */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto w-full max-w-360">
          <SectionTitle eyebrow="Where we look" title="What We Test." body="Most revenue is won or lost on a handful of pages. These are the areas we work through, in roughly this order." />
          <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {croTestAreas.map((a, i) => (
              <li key={a.title} className="rounded-3xl border border-line bg-surface p-6">
                <span className="font-display text-sm font-bold text-[var(--olive)]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-xl font-bold text-foreground">{a.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted">{a.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Metrics + example */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="on-dark rounded-3xl bg-[#141413] p-6 text-white sm:p-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">What we measure</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">Revenue, not clicks.</h2>
            <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
              A test only wins if it makes the store more money. These are the numbers every result is judged on:
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {croMetrics.map((m) => (
                <li key={m} className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[0.95rem] font-medium text-white">{m}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">One example</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">The Conscious Bar product page</h2>
            <ul className="mt-5 space-y-3 text-base text-foreground">
              {[
                ["Audit", "Add to bag sat 1,118px down; four discount messages competed."],
                ["Research", "Shoppers didn't know about the $35 minimum until the cart."],
                ["Build", "Real price first, pack picker, sticky add to bag, one milestone bar."],
                ["Test", "Each change is set to go live as an A/B test against the ~2% baseline."],
              ].map(([k, v]) => (
                <li key={k} className="flex gap-3">
                  <span className="w-20 shrink-0 font-semibold sm:w-24">{k}</span>
                  <span className="text-muted">{v}</span>
                </li>
              ))}
            </ul>
            <Link href="/#before-after" className="mt-7 inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-foreground hover:border-foreground">
              See the before and after →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 pb-10 sm:px-8">
        <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionTitle eyebrow="FAQ" title="Questions About Our CRO Process." />
          <Accordion items={faq} />
        </div>
      </section>

      <CtaBand title="Start with a free CRO audit" subtitle="We'll show you where your store loses revenue and what we'd test first. No obligation." />
    </>
  );
}
