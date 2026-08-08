import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../components/PageHeader";
import CtaBand from "../components/CtaBand";
import { caseStudies } from "../lib/site";

export const metadata: Metadata = {
  title: "Our Works",
  description:
    "A look at Shopify stores we've designed, built, and grown. Real brands, real results.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Works"
        title={
          <>
            Shopify stores we&apos;ve{" "}
            <span className="text-accent">designed, built &amp; grown.</span>
          </>
        }
        subtitle="Real brands, real results. A look at some of the stores we've shipped and scaled."
      />

      <section className="pb-20 sm:pb-28">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((w) => (
              <Link
                key={w.slug}
                href={`/work/${w.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-line"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${w.img})` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-xl font-medium tracking-tight text-white sm:text-2xl">
                    {w.name}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/80">
                    {w.teaser}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors group-hover:text-accent">
                    View case study
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Want results like these?" />
    </>
  );
}
