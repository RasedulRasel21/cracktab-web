import type { Metadata } from "next";
import Link from "next/link";
import BookCallButton from "../components/BookCallButton";
import Clients from "../components/Clients";
import Stats from "../components/Stats";
import PageHeader from "../components/PageHeader";
import Accordion from "../components/Accordion";
import CtaBand from "../components/CtaBand";
import {
  serviceDetails,
  processSteps,
  technologies,
  servicesFaq,
} from "../lib/site";

export const metadata: Metadata = {
  // absolute — the doc title already carries the brand, so skip the template
  title: { absolute: "Shopify Development & CRO Services | Cracktab" },
  description:
    "Three Shopify services: ecommerce management & CRO, Shopify development, and custom theme & app development. Book a free consultation today.",
  alternates: { canonical: "/services" },
};

function ArrowUpRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M5 13L13 5M13 5H6M13 5v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Shopify Development & CRO Services"
        eyebrowIsH1
        title={
          <>
            Shopify services that{" "}
            <span className="text-accent">drive results.</span>
          </>
        }
        subtitle="Your Shopify agency for every stage of growth. From building a store from scratch to complex Shopify Plus implementations, we specialize exclusively in ecommerce stores that convert — whether you're a first-time founder or an established brand ready to scale."
        action={
          <BookCallButton className="inline-flex h-13 items-center justify-center rounded-full bg-foreground px-8 font-display text-sm font-semibold uppercase tracking-wide text-background transition-colors hover:bg-foreground-strong">
            Get a Free Store Audit
          </BookCallButton>
        }
      />

      {/* The three services */}
      <section className="pb-10">
        <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-5 px-5 sm:px-8 lg:grid-cols-3">
          {serviceDetails.map((s, i) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className={`group flex flex-col rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1 sm:p-9 ${
                i === 0 ? "border-foreground bg-foreground text-background on-dark" : "border-line bg-surface hover:border-foreground"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <span className={`font-display text-sm font-bold ${i === 0 ? "text-accent" : "text-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={i === 0 ? "text-accent" : "text-muted group-hover:text-foreground"}>
                  <ArrowUpRight />
                </span>
              </div>
              <h2 className={`mt-8 font-display text-2xl font-bold tracking-tight sm:text-3xl ${i === 0 ? "text-white" : "text-foreground"}`}>{s.name}</h2>
              <p className={`mt-3 text-base leading-relaxed ${i === 0 ? "text-white/75" : "text-muted"}`}>{s.summary}</p>
              <ul className="mt-6 space-y-2 border-t pt-6 text-base" style={{ borderColor: i === 0 ? "rgba(255,255,255,0.15)" : "var(--line)" }}>
                {(s.capabilities ?? []).map((c) => (
                  <li key={c.slug} className={`flex items-center gap-2.5 ${i === 0 ? "text-white/85" : "text-foreground"}`}>
                    <span aria-hidden="true" className={i === 0 ? "text-accent" : "text-[var(--olive)]"}>✓</span>
                    {c.title}
                  </li>
                ))}
              </ul>
              <span className={`mt-auto pt-8 font-display text-sm font-semibold uppercase tracking-wide ${i === 0 ? "text-accent" : "text-foreground"}`}>
                Explore {s.name} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Our proven process */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              How we work
            </span>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.05] tracking-tight text-white">
              Our proven process
            </h2>
            <p className="mt-4 text-muted">
              Every build follows the same 4-stage process, from discovery to
              launch.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div
                key={step.no}
                className="rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent/50"
              >
                <span className="font-display text-sm font-semibold text-accent">
                  {step.no}
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-360 px-5 text-center sm:px-8">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            Technologies we master
          </span>
          <ul className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-3">
            {technologies.map((t) => (
              <li
                key={t}
                className="rounded-full border border-line px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:border-accent hover:text-accent"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Credibility block: the homepage numbers, then the client logos */}
      <section className="pt-16 sm:pt-20">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <Stats />
        </div>
      </section>

      <Clients />

      {/* Services FAQ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              FAQ
            </span>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.05] tracking-tight text-white">
              Services FAQ
            </h2>
          </div>
          <Accordion items={servicesFaq} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
