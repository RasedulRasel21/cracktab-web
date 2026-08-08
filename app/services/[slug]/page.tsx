import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "../../components/PageHeader";
import CtaBand from "../../components/CtaBand";
import CaseStudySlider from "../../components/CaseStudySlider";
import { serviceDetails, CALENDLY_URL } from "../../lib/site";

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
  return { title: service?.name ?? "Service", description: service?.intro };
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-accent">
      <path d="M3.5 9.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = serviceDetails.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <>
      <PageHeader eyebrow="Service" title={service.heading} subtitle={service.intro} />

      {/* Who this is for + Why it matters */}
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <h2 className="font-display text-xl font-medium tracking-tight text-white">
              Who this is for
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {service.whoFor}
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight text-white sm:text-[1.75rem]">
              Why it matters &amp; how we help
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {service.whyMatters}
            </p>
          </div>
        </div>
      </section>

      {/* Our process + What's included */}
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-2xl font-medium tracking-tight text-white">
                Our process
              </h2>
              <ol className="mt-8 flex flex-col gap-6">
                {service.process.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/40 font-display text-sm font-semibold text-accent">
                      {i + 1}
                    </span>
                    <span className="pt-1 text-base leading-relaxed text-white/90">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="font-display text-2xl font-medium tracking-tight text-white">
                What&apos;s included
              </h2>
              <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {service.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-white/85 lg:text-base">
                    <Check />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-13 items-center gap-2 rounded-full bg-accent px-8 font-display text-sm font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong"
            >
              Get Started
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Example work — full case-study slider */}
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto mb-8 w-full max-w-360 px-5 sm:px-8">
          <h2 className="font-display text-2xl font-medium tracking-tight text-white">
            Example work
          </h2>
        </div>
        <CaseStudySlider />
      </section>

      {/* Explore other services */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <h2 className="mb-6 font-display text-xl font-medium tracking-tight text-white">
            Explore other services
          </h2>
          <div className="flex flex-wrap gap-3">
            {serviceDetails
              .filter((s) => s.slug !== service.slug)
              .map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="rounded-full border border-line px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:border-accent hover:text-accent"
                >
                  {s.name}
                </Link>
              ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
