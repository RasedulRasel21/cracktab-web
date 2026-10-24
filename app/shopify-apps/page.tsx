import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../components/PageHeader";
import Accordion from "../components/Accordion";
import AppCard from "../components/AppCard";
import BookCallButton from "../components/BookCallButton";
import JsonLd from "../components/JsonLd";
import {
  agencyReasons,
  appAsset,
  appHref,
  appPicker,
  APPS_HUB_PATH,
  hubFaq,
  shopifyApps,
} from "../lib/apps";
import { findPublicAsset } from "../lib/publicAsset";
import { absoluteUrl } from "../lib/site";

const TITLE = "Shopify Apps by Cracktab: CRO, SEO, Reviews & Upsells";
const DESCRIPTION =
  "Shopify apps built by a Shopify CRO agency: AI SEO, conversion blocks, photo reviews, upsells and a custom ring builder. Install free from the App Store.";

// 1200×630, the five app icons on the dark/lime background.
const ogImage = findPublicAsset("/apps/og-shopify-apps");

export const metadata: Metadata = {
  // Already carries the brand, so skip the layout's "· Cracktab" template.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: APPS_HUB_PATH },
  openGraph: {
    type: "website",
    url: absoluteUrl(APPS_HUB_PATH),
    siteName: "Cracktab",
    title: TITLE,
    description: DESCRIPTION,
    ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    ...(ogImage && { images: [ogImage] }),
  },
};

const appBySlug = (slug: string) => shopifyApps.find((app) => app.slug === slug)!;

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium leading-[1.1] tracking-tight text-white">
      {children}
    </h2>
  );
}

export default function ShopifyAppsPage() {
  // No aggregateRating until ratings are shown on the page (hub doc).
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: "Shopify apps by Cracktab",
        url: absoluteUrl(APPS_HUB_PATH),
        itemListElement: shopifyApps.map((app, i) => {
          const link = appHref(app);
          return {
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "SoftwareApplication",
              name: app.name,
              description: app.line,
              ...(link && { url: link.external ? link.href : absoluteUrl(link.href) }),
              applicationCategory: "BusinessApplication",
              operatingSystem: "Shopify",
              ...(app.free && {
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              }),
            },
          };
        }),
      },
      {
        "@type": "FAQPage",
        mainEntity: hubFaq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ---- A. Hero ---- */}
      <PageHeader
        eyebrow="Shopify Apps"
        title={
          <>
            Shopify apps built by <span className="text-accent">a CRO agency</span>
          </>
        }
        subtitle="We've worked on 170+ Shopify stores. These apps are the tools we kept rebuilding for clients, packaged so any merchant can install them in minutes."
        action={
          <>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="#apps"
                className="inline-flex h-13 items-center justify-center rounded-full bg-accent px-8 font-display text-sm font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong"
              >
                Browse the apps
              </a>
              <BookCallButton className="inline-flex h-13 items-center justify-center rounded-full border border-line px-8 font-display text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-accent hover:text-accent">
                Book a CRO call
              </BookCallButton>
            </div>
            <p className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-muted">
              Built by Cracktab · Published on the Shopify App Store · Support from the team that
              built them
            </p>
          </>
        }
      />

      {/* ---- B. App grid ---- */}
      <section id="apps" className="scroll-mt-24 px-5 pb-20 sm:px-8 sm:pb-28">
        <h2 className="sr-only">All Cracktab Shopify apps</h2>
        <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shopifyApps.map((app) => (
            <AppCard
              key={app.slug}
              app={app}
              wide={app.featured}
              icon={findPublicAsset(appAsset(app.slug, "icon"))}
              vignette={findPublicAsset(appAsset(app.slug, "card"))}
            />
          ))}
        </div>
      </section>

      {/* ---- C. Which app do I need? ---- */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto w-full max-w-360 border-t border-line pt-12 sm:pt-14">
          <SectionHeading>Which app do I need?</SectionHeading>
          <table className="mt-8 w-full max-w-4xl text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                <th scope="col" className="py-4 pr-6 font-semibold">
                  If you want to…
                </th>
                <th scope="col" className="py-4 font-semibold">
                  Start with
                </th>
              </tr>
            </thead>
            <tbody>
              {appPicker.map((row) => {
                const app = appBySlug(row.app);
                const link = appHref(app);
                return (
                  <tr key={row.goal} className="border-b border-line">
                    <td className="py-5 pr-6 leading-relaxed text-white/80">{row.goal}</td>
                    <td className="py-5 font-display font-semibold text-white">
                      {link ? (
                        link.external ? (
                          <a href={link.href} rel="noopener" className="text-accent hover:underline">
                            {app.name}
                          </a>
                        ) : (
                          <Link href={link.href} className="text-accent hover:underline">
                            {app.name}
                          </Link>
                        )
                      ) : (
                        app.name
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---- D. Why apps from an agency ---- */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto w-full max-w-360 border-t border-line pt-12 sm:pt-14">
          <SectionHeading>Why apps from an agency</SectionHeading>
          <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {agencyReasons.map((reason) => (
              <li key={reason.title} className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
                <h3 className="font-display text-xl font-medium tracking-tight text-white">
                  {reason.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{reason.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- E. Need more than an app? ---- */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="relative mx-auto w-full max-w-360 overflow-hidden rounded-3xl border border-line bg-surface px-6 py-12 sm:px-16 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50rem_24rem_at_50%_0%,rgba(180,240,58,0.12),transparent_70%)]"
          />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <SectionHeading>Need more than an app?</SectionHeading>
              <p className="mt-5 text-base leading-relaxed text-muted">
                Apps cover the common fixes. If your conversion rate is stuck, our team runs full
                CRO audits, A/B tests and redesigns.
              </p>
            </div>
            <BookCallButton className="inline-flex h-13 shrink-0 items-center justify-center rounded-full bg-accent px-8 font-display text-sm font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong" />
          </div>
        </div>
      </section>

      {/* ---- F. FAQ ---- */}
      <section id="faq" className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto w-full max-w-3xl">
          <SectionHeading>FAQ</SectionHeading>
          <div className="mt-8">
            <Accordion items={hubFaq} />
          </div>
        </div>
      </section>
    </>
  );
}
