import type { Metadata } from "next";
import PageHeader from "../components/PageHeader";
import CtaBand from "../components/CtaBand";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Cracktab is a website design, development, and growth agency helping ambitious brands build better digital experiences and scale with confidence.",
};

const howWeWork = [
  {
    title: "Understand the Business",
    body: "Every project begins with understanding the business, its customers, current challenges, goals, and growth priorities — not by choosing colors or installing a theme.",
  },
  {
    title: "Create a Clear Plan",
    body: "We define scope, responsibilities, deliverables, timeline, and technical direction, so clients know what is being built, why it matters, and how the work moves forward.",
  },
  {
    title: "Design Around the Customer Journey",
    body: "We organize information, navigation, products, content, and calls to action around how real customers browse and make purchasing decisions.",
  },
  {
    title: "Develop for Performance and Usability",
    body: "Our developers turn the approved direction into a responsive, manageable, dependable website — attentive to mobile usability, page speed, and SEO foundations.",
  },
  {
    title: "Test Before Launch",
    body: "We review across devices, screen sizes, browsers, forms, links, product flows, and checkout — identifying problems before they affect customers.",
  },
  {
    title: "Support Continued Improvement",
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

function Prose({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-line py-12 first:border-t-0 first:pt-0 lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <h2 className="font-display text-2xl font-medium leading-snug tracking-tight text-white sm:text-3xl">
        {heading}
      </h2>
      <div className="mt-5 space-y-4 text-base leading-relaxed text-muted lg:mt-0">
        {children}
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title={
          <>
            We build websites that <span className="text-accent">perform.</span>
          </>
        }
        subtitle="Cracktab is a website design, development, and growth agency helping ambitious brands build better digital experiences, improve store performance, and scale with confidence."
      />

      <section className="pb-8">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <Prose heading="About Cracktab">
            <p>
              Shopify is our primary area of expertise and the platform we work
              with most often. However, we are not limited to Shopify — our team
              also supports businesses across other ecommerce and website
              platforms when the project, technology, or growth strategy
              requires a different solution.
            </p>
            <p>
              Over the past three years, we have helped launch, redesign,
              migrate, optimize, and manage more than 50 ecommerce stores. Our
              work combines thoughtful UI/UX design, reliable development,
              technical problem-solving, SEO, and ongoing support — all focused
              on building websites that are easy to use, easy to manage, and
              designed to convert.
            </p>
          </Prose>

          <Prose heading="Built for Ecommerce Growth">
            <p>
              A successful brand&apos;s website needs to do more than look
              professional. It must load quickly, communicate value clearly,
              guide customers toward the right products, and make purchasing feel
              effortless.
            </p>
            <p>
              That is why we approach every project with both design and business
              performance in mind — considering the complete customer journey,
              from the first landing-page visit to product discovery, checkout,
              and post-purchase interaction.
            </p>
          </Prose>

          <Prose heading="Who We Work With">
            <p>
              We work with startups, growing ecommerce brands, established
              retailers, and businesses that need a stronger digital presence.
            </p>
            <p>
              Some clients come to us with an idea and need support launching
              their first store. Others already have an active ecommerce business
              but are struggling with poor usability, slow performance, or a
              website that no longer represents the quality of their brand.
            </p>
          </Prose>

          <Prose heading="Why Shopify Is Our Core Specialization">
            <p>
              Shopify sits at the center of most of our ecommerce work because it
              gives growing brands a strong combination of usability,
              flexibility, security, and scalability.
            </p>
            <p>
              At the same time, Shopify is not the only solution. When another
              platform better suits the project, our team can work within that
              environment or recommend the most practical path forward. Our goal
              isn&apos;t to sell a platform — it&apos;s to create the right
              digital solution for the business.
            </p>
          </Prose>
        </div>
      </section>

      {/* How we work — 6 steps */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              How we work
            </span>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight text-white">
              A team that stays close to the work
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {howWeWork.map((step, i) => (
              <div
                key={step.title}
                className="rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent/50"
              >
                <span className="font-display text-sm font-semibold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-lg font-medium tracking-tight text-white">
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

      {/* Support + Where we work */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
              Support that continues after launch
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Websites change as businesses grow. Our ongoing support keeps your
              store updated, secure, functional, and aligned with your goals:
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {support.map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm text-white/85">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-accent">
                    <path d="M3.5 9.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
              Where we work
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              Cracktab operates through teams in Canton, Ohio and Dhaka,
              Bangladesh — serving clients across the United States, Europe, and
              other international markets.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="font-display text-lg font-medium text-white">
                  US Office
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  6545 Market Ave N, Ste 100, Canton, OH 44721
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="font-display text-lg font-medium text-white">
                  Bangladesh Office
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  D/233 Mirpur DOHS, Dhaka 1216, Bangladesh
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Let's build something that performs"
        subtitle="Launching, redesigning, migrating to Shopify, or looking for a long-term partner — Cracktab can help you plan and execute the next stage of your growth."
      />
    </>
  );
}
