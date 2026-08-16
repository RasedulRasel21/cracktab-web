import type { Metadata } from "next";
import CtaBand from "../components/CtaBand";
import WorldMap, { type Pin } from "../components/WorldMap";
import WorldDotField from "../components/WorldDotField";
import SupportCoverflow from "../components/SupportCoverflow";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Cracktab is a website design, development, and growth agency helping ambitious brands build better digital experiences and scale with confidence.",
};

const howWeWork = [
  {
    title: "Understand the Business.",
    body: "Every project begins with understanding the business, its customers, current challenges, goals, and growth priorities — not by choosing colors or installing a theme.",
  },
  {
    title: "Create a Clear Plan.",
    body: "We define scope, responsibilities, deliverables, timeline, and technical direction, so clients know what is being built, why it matters, and how the work moves forward.",
  },
  {
    title: "Design Around the Customer Journey.",
    body: "We organize information, navigation, products, content, and calls to action around how real customers browse and make purchasing decisions.",
  },
  {
    title: "Develop for Performance and Usability.",
    body: "Our developers turn the approved direction into a responsive, manageable, dependable website — attentive to mobile usability, page speed, and SEO foundations.",
  },
  {
    title: "Test Before Launch.",
    body: "We review across devices, screen sizes, browsers, forms, links, product flows, and checkout — identifying problems before they affect customers.",
  },
  {
    title: "Support Continued Improvement.",
    body: "Launch is rarely the end. Many clients continue with us for maintenance, SEO, design improvements, and ongoing store optimization.",
  },
];

const support = [
  "Website maintenance",
  "Technical troubleshooting",
  "Store updates",
  "New landing pages and sections",
  "Design refinements",
  "Performance improvements",
  "SEO support",
  "New features and integrations",
];

const offices: Pin[] = [
  {
    label: "USA Office",
    address: "6545 Market Ave N, Ste 100, Canton, OH 44721",
    lon: -81.4,
    lat: 40.8,
  },
  {
    label: "Bangladesh Office",
    address: "D/233 Mirpur DOHS, Dhaka 1216",
    lon: 90.4,
    lat: 23.8,
  },
];

function Prose({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 py-8 lg:grid-cols-[0.7fr_2.3fr] lg:gap-16 lg:py-10">
      <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-white sm:text-[1.75rem]">
        {heading}
      </h2>
      <div className="space-y-4 text-sm leading-relaxed text-muted sm:text-base">
        {children}
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* ---- Hero ---- */}
      {/* The header is fixed (h-14 / sm:h-16) and so takes no flow space —
          the matching top margin starts the hero below it instead of under it. */}
      <section className="relative mt-14 flex min-h-[85vh] flex-col justify-center overflow-hidden px-5 pb-20 pt-16 sm:mt-16 sm:px-8 sm:pb-24 sm:pt-20">
        <WorldDotField />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,#000)]"
        />

        <div className="relative mx-auto w-full max-w-360">
          <h1 className="max-w-4xl font-display text-[clamp(2.75rem,7vw,5.25rem)] font-medium leading-[1.02] tracking-tight text-white">
            We build websites that <span className="text-accent">perform.</span>
          </h1>
          <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Cracktab is a website design, development, and growth agency helping
            ambitious brands build better digital experiences, improve store
            performance, and scale with confidence.
          </p>
        </div>
      </section>

      {/* ---- Prose rows ---- */}
      <section className="px-5 pb-10 sm:px-8">
        <div className="mx-auto w-full max-w-360">
          <Prose heading="About Cracktab">
            <p>
              Shopify is our primary area of expertise and the platform we work
              with most often. However, we are not limited to Shopify — our team
              also supports businesses across other ecommerce and website
              platforms when the project, technology, or growth strategy
              requires a different solution.
            </p>
          </Prose>

          <Prose heading="Built for Ecommerce Growth">
            <p>
              A successful brand&apos;s website needs to do more than look
              professional. It must load quickly, communicate value clearly,
              guide customers toward the right products, and make purchasing
              feel effortless.
            </p>
          </Prose>

          <Prose heading="Who We Work With">
            <p>
              We work with startups, growing ecommerce brands, established
              retailers, and businesses that need a stronger digital presence.
            </p>
          </Prose>

          <Prose heading="Why Shopify Is Our Core Specialization">
            <p>
              Shopify sits at the center of most of our ecommerce work because
              it gives growing brands a strong combination of usability,
              flexibility, security, and scalability.
            </p>
          </Prose>
        </div>
      </section>

      {/* ---- How We Work ---- */}
      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto w-full max-w-360">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-[1.75rem]">
            How We Work
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {howWeWork.map((step, i) => (
              <div
                key={step.title}
                // Offset each card's sweep so the six don't travel in lockstep.
                style={
                  { "--neon-delay": `${-i * 0.9}s` } as React.CSSProperties
                }
                className="neon-card rounded-2xl border border-accent/15 bg-surface p-6"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 font-display text-xs font-semibold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 font-display text-base font-semibold leading-snug tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Support after launch ---- */}
      <section className="py-16 sm:py-20">
        {/* Heading and intro share their own row, so neither is squeezed into
            a narrow column and the wheel below gets the full width. */}
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-end lg:gap-16">
            <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-white sm:text-[1.75rem]">
              Support That Continues After Launch
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              Websites change as businesses grow. Our ongoing support keeps your
              store updated, secure, functional, and aligned with your goals:
            </p>
          </div>
        </div>

        <div className="mx-auto mt-10 w-full max-w-360 px-5 sm:px-8">
          <SupportCoverflow items={support} />
        </div>
      </section>

      {/* ---- Where we work ---- */}
      <section className="px-5 pb-8 pt-6 sm:px-8 sm:pb-12">
        <div className="mx-auto w-full max-w-360">
          <WorldMap pins={offices} />
        </div>
      </section>

      <CtaBand
        title="Let's build something that performs"
        subtitle="Launching, redesigning, migrating to Shopify, or looking for a long-term partner — Cracktab can help you plan and execute the next stage of your growth."
      />
    </>
  );
}
