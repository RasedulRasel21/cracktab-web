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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((w, i) => {
              // The Conscious Bar gets the whole first row, Pürishh most of the second.
              const hero = i === 0;
              const wide = i === 1;
              const size = hero
                ? "sm:col-span-2 lg:col-span-3 aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]"
                : wide
                  ? "sm:col-span-2 aspect-[4/5] sm:aspect-[16/9] lg:aspect-auto"
                  : "aspect-[16/10]";
              const shown = hero ? 3 : wide ? 2 : 1;
              return (
                <Link
                  key={w.slug}
                  href={`/work/${w.slug}`}
                  // Top anchor: the images are site screenshots, so a centred crop threw the design away.
                  className={`on-dark group relative block overflow-hidden rounded-2xl border border-line ${size}`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-top transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${w.img})` }}
                  />
                  <div className={`absolute inset-0 ${hero || wide ? "bg-linear-to-t from-black/90 via-black/45 to-black/10 lg:bg-linear-to-r lg:from-black/90 lg:via-black/60 lg:to-black/5" : "bg-linear-to-t from-black/90 via-black/30 to-transparent"}`} />
                  <div className={`absolute inset-x-0 bottom-0 ${hero ? "p-6 sm:p-10 lg:inset-y-0 lg:flex lg:max-w-2xl lg:flex-col lg:justify-end lg:p-12" : "p-6"}`}>
                    {w.stats && (
                      <ul className="mb-4 flex flex-wrap gap-2">
                        {w.stats.slice(0, shown).map((s) => (
                          <li key={s.label} className="inline-flex items-baseline gap-2 rounded-full bg-accent px-3 py-1 text-accent-ink">
                            <span className={`font-display font-bold ${hero ? "text-base sm:text-xl" : "text-base"}`}>{s.value}</span>
                            <span className="text-xs font-semibold">{s.label.toLowerCase()}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {hero && <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">Featured case study</p>}
                    <h3 className={`font-display font-semibold tracking-tight text-white ${hero ? "text-3xl sm:text-5xl" : wide ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
                      {w.name}
                    </h3>
                    <p className={`mt-2 leading-relaxed text-white/80 ${hero ? "max-w-xl text-base sm:text-lg" : wide ? "max-w-md text-sm sm:text-base" : "max-w-xs text-sm"}`}>
                      {w.teaser}
                    </p>
                    {w.scope && (hero || wide) && (
                      <p className="mt-3 text-sm font-medium text-white/70">{w.scope.join(" · ")}</p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors group-hover:text-accent">
                      View project
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
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
