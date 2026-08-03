import type { Metadata } from "next";
import Link from "next/link";
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
  title: "Services",
  description:
    "Shopify services that drive results — development, apps, UI/UX, SEO, management, custom websites, and growth + CRO.",
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
        eyebrow="Services"
        title={
          <>
            Shopify services that{" "}
            <span className="text-accent">drive results.</span>
          </>
        }
        subtitle="Your Shopify agency for every stage of growth. From building a store from scratch to complex Shopify Plus implementations, we specialize exclusively in ecommerce stores that convert — whether you're a first-time founder or an established brand ready to scale."
      />

      {/* 7-service grid */}
      <section className="pb-10">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceDetails.map((s, i) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
              >
                <div className="relative flex items-start justify-between gap-4">
                  <span className="font-display text-sm font-semibold text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-muted transition-colors group-hover:text-accent">
                    <ArrowUpRight />
                  </span>
                </div>
                <div className="relative mt-10">
                  <h3 className="font-display text-xl font-medium tracking-tight text-white">
                    {s.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                    {s.intro}
                  </p>
                </div>
              </Link>
            ))}
          </div>
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
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight text-white">
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
                <h3 className="mt-5 font-display text-lg font-medium tracking-tight text-white">
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

      {/* Services FAQ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              FAQ
            </span>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight text-white">
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
