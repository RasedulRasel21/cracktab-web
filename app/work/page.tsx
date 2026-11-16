import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../components/PageHeader";
import CtaBand from "../components/CtaBand";
import { caseStudies } from "../lib/site";

export const metadata: Metadata = {
  title: "Shopify Store Case Studies & Our Work",
  description:
    "Shopify stores we've built, grown and optimised for DTC brands like The Conscious Bar, Pürishh, Luxe and ForChics. See the scope, the process and real numbers.",
  alternates: { canonical: "/work" },
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-flow-dense lg:grid-cols-3">
            {caseStudies.map((w, i) => {
              // The Conscious Bar takes the first row; Pürishh a 2x2 block beside two smaller cards.
              const hero = i === 0;
              const wide = i === 1;
              const size = hero
                ? "sm:col-span-2 lg:col-span-3 aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]"
                : wide
                  ? "sm:col-span-2 lg:row-span-2 aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto"
                  : "aspect-[4/3]";
              const shown = hero ? 3 : wide ? 2 : 1;
              return (
                <Link
                  key={w.slug}
                  href={`/work/${w.slug}`}
                  className={`on-dark group relative flex flex-col justify-end overflow-hidden rounded-2xl border border-line bg-[#141413] ${size}`}
                >
                  {/* Top anchor: the images are site screenshots, so a centred crop threw the design away. */}
                  <div
                    className="absolute inset-0 bg-cover bg-top transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${w.img})` }}
                  />
                  {hero && (
                    <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/10 lg:bg-linear-to-r lg:from-black/95 lg:via-black/70 lg:to-black/0" />
                  )}
                  {/* Busy screenshots: text sits on a solid panel instead of over the image. */}
                  <div
                    className={`relative ${
                      hero
                        ? "p-6 sm:p-10 lg:flex lg:h-full lg:max-w-2xl lg:flex-col lg:justify-end lg:p-12"
                        : "border-t border-white/10 bg-[#141413]/92 p-5 backdrop-blur-md sm:p-6"
                    } ${wide ? "lg:p-8" : ""}`}
                  >
                    {w.stats && (
                      <ul className="mb-4 flex flex-wrap gap-2">
                        {w.stats.slice(0, shown).map((s) => (
                          <li key={s.label} className="inline-flex items-baseline gap-2 rounded-full bg-accent px-3 py-1 text-accent-ink">
                            <span className={`font-display font-bold ${hero || wide ? "text-base sm:text-xl" : "text-base"}`}>{s.value}</span>
                            <span className="text-xs font-semibold">{s.label.toLowerCase()}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {hero && <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">Featured case study</p>}
                    <div className={wide ? "lg:flex lg:items-end lg:justify-between lg:gap-8" : ""}>
                      <div>
                        <h3 className={`font-display font-semibold tracking-tight text-white ${hero ? "text-3xl sm:text-5xl" : wide ? "text-2xl sm:text-4xl" : "text-xl"}`}>
                          {w.name}
                        </h3>
                        <p className={`mt-2 leading-relaxed text-white/85 ${hero ? "max-w-xl text-base sm:text-lg" : wide ? "max-w-lg text-sm sm:text-base" : "text-sm"}`}>
                          {w.teaser}
                        </p>
                        {w.scope && (hero || wide) && (
                          <p className="mt-3 text-sm font-medium text-white/65">{w.scope.join(" · ")}</p>
                        )}
                      </div>
                      <span className="mt-4 inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors group-hover:text-accent">
                        View project
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                          <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand title="Want results like these?" />
    </>
  );
}
