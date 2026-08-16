import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CtaBand from "../../components/CtaBand";
import ProcessPanel from "../../components/ProcessPanel";
import WorkMosaic from "../../components/WorkMosaic";
import { caseStudies, serviceDetails } from "../../lib/site";

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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl font-medium tracking-tight text-white sm:text-2xl">
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
      {/* ---- Hero ---- */}
      <section className="px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-36">
        <div className="mx-auto w-full max-w-360">
          <h1 className="max-w-4xl font-display text-[clamp(2.75rem,7vw,5.25rem)] font-medium leading-[1.02] tracking-tight text-white">
            {service.heading}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {service.intro}
          </p>
        </div>
      </section>

      {/* ---- Who this is for / Why it matters ---- */}
      <section className="px-5 sm:px-8">
        <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-10 border-t border-line pt-12 sm:pt-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading>Who this is for</SectionHeading>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              {service.whoFor}
            </p>
          </div>
          <div>
            <SectionHeading>Why it matters &amp; how we help</SectionHeading>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              {service.whyMatters}
            </p>
          </div>
        </div>
      </section>

      {/* ---- Our Process / What's included ---- */}
      <section className="px-5 pt-14 sm:px-8 sm:pt-20">
        <div className="mx-auto w-full max-w-360 border-t border-line pt-12 sm:pt-14">
          <ProcessPanel
            steps={service.process}
            bullets={service.bullets}
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

      <CtaBand />
    </>
  );
}
