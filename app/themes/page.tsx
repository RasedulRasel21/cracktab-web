import type { Metadata } from "next";
import PageHeader from "../components/PageHeader";
import Accordion from "../components/Accordion";
import CtaBand from "../components/CtaBand";
import ThemeCatalog from "./ThemeCatalog";
import { CALENDLY_URL, type Faq } from "../lib/site";

export const metadata: Metadata = {
  title: "Custom Shopify Themes",
  description:
    "High-converting custom Shopify themes built for speed, UX and scale — designed by Cracktab's senior UI/UX engineers and optimized for Core Web Vitals.",
};

const agencyFeatures = [
  {
    title: "Core Web Vitals & Speed First",
    body: "Light codebase, clean Liquid markup, and optimized asset loading.",
  },
  {
    title: "Conversion-Driven UI/UX",
    body: "Designed using real data and CRO principles tested across Cracktab's retainer clients.",
  },
  {
    title: "SEO-Engineered Architecture",
    body: "Built-in schema markup, structured heading hierarchies, and clean URL routing out-of-the-box.",
  },
  {
    title: "Built-in App Replacements",
    body: "Features that save merchants money on monthly app fees — built-in upsells, slide-out cart, quick view, size charts.",
  },
];

const customization = [
  "Custom Liquid & App Integrations",
  "Brand Identity Alignment & UI Polish",
  "Data Migration & Product Setup",
  "Dedicated SEO Migration Protection",
];

const support = [
  "Theme updates",
  "Bug fixes",
  "Theme setup documentation",
  "30-day installation support",
];

const reviews = [
  {
    quote:
      "Our theme swap cut load time nearly in half and product-page conversion jumped within the first month.",
    name: "Maya R.",
    role: "Founder, Apparel brand",
    rating: 5,
  },
  {
    quote:
      "Clean code, easy to customize, and the built-in upsell replaced two paid apps we were paying for monthly.",
    name: "Daniel K.",
    role: "Ecommerce Lead",
    rating: 5,
  },
  {
    quote:
      "The setup docs were clear and the 30-day support meant we launched without any stress.",
    name: "Priya S.",
    role: "Store Owner",
    rating: 5,
  },
];

const themesFaq: Faq[] = [
  {
    q: "Are these themes OS 2.0 compatible?",
    a: "Yes — every Cracktab theme is built on Shopify Online Store 2.0, with full support for sections, blocks, and the theme editor across all pages.",
  },
  {
    q: "Can I customize the layout without coding?",
    a: "Absolutely. You can add, remove, reorder, and restyle sections directly in Shopify's theme editor — no code required for most changes.",
  },
  {
    q: "What if I need custom dev work done after purchase?",
    a: "Our Shopify development team can tailor any theme with custom Liquid, integrations, or branding. Book a consultation and we'll scope it with you.",
  },
  {
    q: "How do theme updates work?",
    a: "You get ongoing updates and bug fixes. We notify you when an update is available, and it installs without wiping your customizations.",
  },
];

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="mt-0.5 shrink-0 text-accent">
      <path d="M3.5 9.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={i < rating ? "text-accent" : "text-white/20"}>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

export default function ThemesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Shopify Themes"
        title={
          <>
            High-converting custom Shopify themes built for{" "}
            <span className="text-accent">speed, UX &amp; scale.</span>
          </>
        }
        subtitle="Designed by Cracktab's senior UI/UX engineers and optimized out-of-the-box for mobile-first conversions and Core Web Vitals."
      />

      {/* 2. Live theme showcase / catalog grid */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="mb-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Live theme showcase
            </span>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight text-white">
              Browse the collection
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Filter by industry to find the theme built for your kind of store.
            </p>
          </div>
          <ThemeCatalog />
        </div>
      </section>

      {/* 3. Built by agency experts */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Built by agency experts
            </span>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight text-white">
              Not marketplace files — agency-tested themes
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Most theme marketplaces sell files built once and never touched
              again. Ours come out of an active Shopify Plus agency — every
              decision below is something we&apos;ve tested on a client&apos;s
              live store first.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {agencyFeatures.map((f, i) => (
              <div
                key={f.title}
                className="rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent/50"
              >
                <span className="font-display text-sm font-semibold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-display text-lg font-medium tracking-tight text-white">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Customization upsell */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-8 sm:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(45rem_22rem_at_100%_0%,rgba(180,240,58,0.12),transparent_70%)]"
            />
            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium leading-[1.08] tracking-tight text-white">
                  Love the design, but need custom features?
                </h2>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
                  Our Shopify development team can tailor any Cracktab theme to
                  your exact operational and design requirements.
                </p>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex h-13 items-center justify-center rounded-full bg-accent px-8 font-display text-sm font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong"
                >
                  Book a Consultation
                </a>
              </div>
              <ul className="grid grid-cols-1 gap-4 self-center sm:grid-cols-2 lg:grid-cols-1">
                {customization.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm text-white/85 sm:text-base">
                    <Check />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Social proof */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Merchant reviews
            </span>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight text-white">
              Loved by the merchants who ship on them
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <figure
                key={r.name}
                className="flex flex-col rounded-2xl border border-line bg-surface p-6"
              >
                <Stars rating={r.rating} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-white/90">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-2">
                  <span className="font-display text-sm font-medium text-white">
                    {r.name}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-accent">
                    Verified
                  </span>
                </figcaption>
                <span className="text-xs text-muted">{r.role}</span>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Support + FAQ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Support &amp; docs
            </span>
            <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.05] tracking-tight text-white">
              Everything you need to launch
            </h2>
            <ul className="mt-8 flex flex-col gap-3">
              {support.map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm text-white/85">
                  <Check />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Accordion items={themesFaq} />
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to launch on a faster theme?"
        subtitle="Browse the collection or book a consultation to tailor a theme to your brand."
      />
    </>
  );
}
