import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CtaBand from "../../components/CtaBand";
import BookCallButton from "../../components/BookCallButton";
import ProcessPanel from "../../components/ProcessPanel";
import WorkMosaic from "../../components/WorkMosaic";
import JsonLd from "../../components/JsonLd";
import { caseStudies, serviceDetails } from "../../lib/site";
import { faqSchema, serviceSchema } from "../../lib/schema";
import Accordion from "../../components/Accordion";
import Link from "next/link";

export function generateStaticParams() {
  return serviceDetails.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceDetails.find((s) => s.slug === slug);
  return {
    title: service?.name ?? "Service",
    description: service?.intro,
    alternates: { canonical: `/services/${slug}` },
  };
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
      {children}
    </h2>
  );
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = serviceDetails.findIndex((s) => s.slug === slug);
  const service = serviceDetails[index];
  if (!service) notFound();

  // Imagery for process steps 02 onward. Uses this service's own case studies
  // first, then any other real ones — swap in stage-specific shots when they
  // exist by replacing this list.
  const preferred = service.examples
    .map((s) => caseStudies.find((c) => c.slug === s))
    .filter((c) => c !== undefined)
    .filter((c) => !c.placeholder);
  const rest = caseStudies
    .filter((c) => !c.placeholder)
    .filter((c) => !preferred.some((p) => p.slug === c.slug));
  const stepImages = [...preferred, ...rest].map((c) => c.img);

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      {service.faq && <JsonLd data={faqSchema(service.faq)} />}
      {/* ---- Hero ---- */}
      <section className="px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-36">
        <div className="mx-auto w-full max-w-360">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.18em] text-foreground sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-accent ring-1 ring-[#141413]/15" />
            Service {String(index + 1).padStart(2, "0")} / {String(serviceDetails.length).padStart(2, "0")}
          </span>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.75rem,7vw,5.25rem)] font-bold leading-[1.02] tracking-[-0.025em] text-foreground">
            {service.heading}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            {service.intro}
          </p>

          {/* Above-the-fold CTA — every service page needs one entry point */}
          <BookCallButton className="mt-8 inline-flex h-13 items-center justify-center rounded-full bg-foreground px-8 font-display text-sm font-semibold uppercase tracking-wide text-background transition-colors hover:bg-foreground-strong">
            Get a Free Store Audit
          </BookCallButton>

          {service.outcomes && (
            <ul className="mt-12 flex flex-wrap gap-2.5">
              {service.outcomes.map((o) => (
                <li key={o} className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-base font-medium text-foreground">
                  <span aria-hidden="true" className="text-[var(--olive)]">✓</span>
                  {o}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ---- Who this is for / Why it matters ---- */}
      <section className="px-5 sm:px-8">
        <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-10 border-t border-line pt-12 sm:pt-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading>Who this is for</SectionHeading>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              {service.whoFor}
            </p>
          </div>
          <div>
            <SectionHeading>Why it matters &amp; how we help</SectionHeading>
            <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
              {service.whyMatters}
            </p>
          </div>
        </div>
      </section>

      {/* ---- Everything this service covers (the merged former services) ---- */}
      {service.capabilities && (
        <section className="px-5 pt-14 sm:px-8 sm:pt-20">
          <div className="mx-auto w-full max-w-360 border-t border-line pt-12 sm:pt-14">
            <SectionHeading>Everything included</SectionHeading>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {service.capabilities.length} areas, one team. Jump to any of them:
            </p>
            <nav aria-label="Capabilities" className="mt-6 flex flex-wrap gap-2">
              {service.capabilities.map((c) => (
                <a key={c.slug} href={`#${c.slug}`} className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-foreground hover:border-foreground">
                  {c.title}
                </a>
              ))}
            </nav>
            <div className="mt-10 divide-y divide-line rounded-3xl border border-line bg-surface">
              {service.capabilities.map((c, i) => (
                <article key={c.slug} id={c.slug} className="grid scroll-mt-24 grid-cols-1 gap-6 p-6 sm:p-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
                  <div>
                    <span className="font-display text-sm font-bold text-[var(--olive)]">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">{c.title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-muted">{c.body}</p>
                  </div>
                  <ul className="grid grid-cols-1 content-start gap-2 sm:grid-cols-2">
                    {c.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 rounded-xl bg-[var(--cream-2)] px-4 py-3 text-base text-foreground">
                        <span aria-hidden="true" className="mt-0.5 text-[var(--olive)]">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Our Process / What's included ---- */}
      <section className="px-5 pt-14 sm:px-8 sm:pt-20">
        <div className="mx-auto w-full max-w-360 border-t border-line pt-12 sm:pt-14">
          <ProcessPanel
            steps={service.process}
            bullets={service.bullets}
            slug={service.slug}
            images={stepImages}
          />
        </div>
      </section>

      {/* ---- Example Work ---- */}
      <section className="px-5 pt-14 pb-20 sm:px-8 sm:pt-20 sm:pb-28">
        <div className="mx-auto w-full max-w-360 border-t border-line pt-12 sm:pt-14">
          <SectionHeading>Example Work</SectionHeading>
          <div className="mt-8">
            <WorkMosaic slugs={service.examples} seed={index} />
          </div>
        </div>
      </section>

      {/* ---- FAQ ---- */}
      {service.faq && (
        <section className="px-5 pb-6 sm:px-8">
          <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-10 border-t border-line pt-12 sm:pt-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <SectionHeading>Questions about {service.name}</SectionHeading>
            <Accordion items={service.faq} />
          </div>
        </section>
      )}

      {/* ---- Other services ---- */}
      <section className="px-5 pt-14 sm:px-8">
        <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-4 sm:grid-cols-2">
          {serviceDetails
            .filter((s) => s.slug !== service.slug)
            .map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="group rounded-3xl border border-line bg-surface p-7 transition-colors hover:border-foreground">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Also from Cracktab</span>
                <p className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground">{s.name} →</p>
                <p className="mt-2 text-base leading-relaxed text-muted">{s.summary}</p>
              </Link>
            ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
