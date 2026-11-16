import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "../../components/PageHeader";
import CtaBand from "../../components/CtaBand";
import CaseStudySlider from "../../components/CaseStudySlider";
import { caseStudies } from "../../lib/site";
import { fullScope } from "../../lib/cro";
import BookCallButton from "../../components/BookCallButton";
import Link from "next/link";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  return {
    title: cs ? `${cs.name} Shopify Case Study` : "Case Study",
    description: cs ? `${cs.teaser} See how Cracktab designed, built and grew this Shopify store: scope, process and results.` : undefined,
    alternates: { canonical: `/work/${slug}` },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) notFound();

  return (
    <>
      <PageHeader eyebrow="Our Works" title={cs.name} subtitle={cs.teaser} />

      {/* Client review */}
      <section className="pb-14">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <figure className="max-w-4xl">
            <blockquote className="font-display text-[clamp(1.4rem,3vw,2.25rem)] font-medium leading-[1.25] tracking-tight text-white">
              &ldquo;{cs.review}&rdquo;
            </blockquote>
            <figcaption className="mt-5 text-sm font-medium uppercase tracking-[0.15em] text-accent">
              — {cs.reviewer}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Live site preview */}
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="overflow-hidden rounded-2xl border border-line">
            {cs.liveUrl ? (
              <a
                href={cs.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
                aria-label={`Visit ${cs.name} live site`}
              >
                {/* Natural aspect, not a fixed crop box — these are full site
                    screenshots, so any crop cuts the design off. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cs.img}
                  alt={`${cs.name} website`}
                  className="block w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/45 on-dark">
                  <span className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-accent-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Visit Live Site
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M4 10L10 4M10 4H5M10 4v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </a>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cs.img}
                alt={`${cs.name} website`}
                className="block w-full"
              />
            )}
          </div>
          {cs.liveUrl && (
            <a
              href={cs.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:text-accent"
            >
              Visit Live Site
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M4 10L10 4M10 4H5M10 4v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </div>
      </section>

      {/* Brief + What we built */}
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
              The brief
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">{cs.brief}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
              What we built
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {cs.whatWeBuilt}
            </p>
          </div>
        </div>
      </section>

      {/* Key features + Focus & result */}
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
              Key features
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {cs.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-base text-white/85">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="mt-1 shrink-0 text-accent">
                    <path d="M3.5 9.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
              Our focus &amp; the result
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {cs.focusResult}
            </p>
          </div>
        </div>
      </section>

      {/* Everything we can run for a store, from SEO to subscriptions */}
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="rounded-[2rem] border border-line bg-surface p-6 sm:p-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent ring-1 ring-[#141413]/15" />
                  Full-service CRO
                </span>
                <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1.05] tracking-tight text-foreground">
                  Everything We Handle, From SEO To Subscriptions.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
                  Stores like {cs.name} don&apos;t need five agencies. One team covers every lever that moves revenue, so nothing falls between the cracks.
                </p>
              </div>
              <Link href="/how-we-work" className="inline-flex h-12 items-center justify-center rounded-full border border-line px-6 font-display text-sm font-semibold uppercase tracking-wide text-foreground hover:border-foreground">
                How we work →
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {fullScope.map((item) => (
                <li key={item.title} className="rounded-2xl bg-[var(--cream-2)] p-5">
                  <p className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                    <span aria-hidden="true" className="text-[var(--olive)]">✓</span>
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-base leading-relaxed text-muted">{item.body}</p>
                </li>
              ))}
            </ul>
            <BookCallButton className="mt-8 inline-flex h-13 items-center justify-center rounded-full bg-foreground px-8 font-display text-sm font-semibold uppercase tracking-wide text-background hover:bg-black">
              Get a free CRO audit
            </BookCallButton>
          </div>
        </div>
      </section>

      {/* More work — same auto-scrolling slider as the homepage */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto mb-8 w-full max-w-360 px-5 sm:px-8">
          <h2 className="font-display text-xl font-semibold tracking-tight text-white">
            More work
          </h2>
        </div>
        <CaseStudySlider exclude={cs.slug} />
      </section>

      <CtaBand title="Want results like these?" />
    </>
  );
}
