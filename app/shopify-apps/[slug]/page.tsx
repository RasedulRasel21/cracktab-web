import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Accordion from "../../components/Accordion";
import AppCard from "../../components/AppCard";
import BookCallButton from "../../components/BookCallButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import JsonLd from "../../components/JsonLd";
import VideoEmbed from "../../components/VideoEmbed";
import {
  appAsset,
  appPath,
  appsWithPages,
  APPS_HUB_PATH,
  installUrl,
  shopifyApps,
} from "../../lib/apps";
import { findPublicAsset } from "../../lib/publicAsset";
import { absoluteUrl, SITE_URL } from "../../lib/site";

/**
 * The shared app page template from the hub doc (section 5). Every app except
 * AI Growth Kits gets one; the copy lives on the app's `page` in lib/apps.ts.
 */

// Only apps flagged `pageLive` exist; any other slug is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return appsWithPages().map((app) => ({ slug: app.slug }));
}

const findApp = (slug: string) => appsWithPages().find((app) => app.slug === slug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = findApp(slug);
  if (!app) return {};

  const { seoTitle, metaDescription } = app.page;
  const hero = findPublicAsset(appAsset(app.slug, "hero"));
  return {
    title: seoTitle,
    description: metaDescription,
    alternates: { canonical: appPath(app) },
    openGraph: {
      type: "website",
      url: absoluteUrl(appPath(app)),
      siteName: "Cracktab",
      title: seoTitle,
      description: metaDescription,
      ...(hero && { images: [{ url: hero, width: 1600, height: 900 }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: metaDescription,
      ...(hero && { images: [hero] }),
    },
  };
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium leading-[1.1] tracking-tight text-white">
      {children}
    </h2>
  );
}

function Section({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="px-5 pb-20 sm:px-8 sm:pb-28">
      <div className="mx-auto w-full max-w-360 border-t border-line pt-12 sm:pt-14">{children}</div>
    </section>
  );
}

const primaryButton =
  "inline-flex h-13 items-center justify-center rounded-full bg-accent px-8 font-display text-sm font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong";
const secondaryButton =
  "inline-flex h-13 items-center justify-center rounded-full border border-line px-8 font-display text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-accent hover:text-accent";

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = findApp(slug);
  if (!app) notFound();
  const { page } = app;

  const icon = findPublicAsset(appAsset(app.slug, "icon"));
  const hero = findPublicAsset(appAsset(app.slug, "hero"));
  const videoPoster = findPublicAsset(appAsset(app.slug, "video"));
  const featureImages = page.features.map((_, i) =>
    findPublicAsset(appAsset(app.slug, `feature-${i + 1}`)),
  );
  const anyFeatureImage = featureImages.some(Boolean);

  const otherApps = page.otherApps
    .map((s) => shopifyApps.find((other) => other.slug === s))
    .filter((other) => other !== undefined);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: app.name,
        description: page.metaDescription,
        url: page.appStoreUrl,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Shopify",
        ...(app.free && { offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }),
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Shopify Apps", item: absoluteUrl(APPS_HUB_PATH) },
          { "@type": "ListItem", position: 3, name: app.name, item: absoluteUrl(appPath(app)) },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60rem_28rem_at_20%_-10%,rgba(180,240,58,0.10),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-360">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Shopify Apps", href: APPS_HUB_PATH },
              { name: app.name },
            ]}
          />

          {icon && (
            <Image
              src={icon}
              alt={`${app.name} app icon`}
              width={72}
              height={72}
              unoptimized={icon.endsWith(".svg")}
              className="mt-10 h-18 w-18 rounded-2xl"
            />
          )}

          <span className="mt-8 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {page.eyebrow}
          </span>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.04] tracking-tight text-white">
            {page.heading}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
            {page.subhead}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href={installUrl(app, "hero")} rel="noopener" className={primaryButton}>
              Install free on Shopify
            </a>
            {page.demoUrl && (
              <a href={page.demoUrl} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
                {page.demoLabel}
              </a>
            )}
          </div>

          {hero && (
            <Image
              src={hero}
              alt={`${app.name} dashboard`}
              width={1600}
              height={900}
              priority
              sizes="(min-width: 1440px) 1376px, 100vw"
              className="mt-14 h-auto w-full rounded-3xl border border-line"
            />
          )}
        </div>
      </section>

      {/* ---- Problem → solution strip ---- */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <ul className="mx-auto grid w-full max-w-360 grid-cols-1 gap-5 md:grid-cols-3">
          {page.problems.map((problem) => (
            <li
              key={problem}
              className="rounded-3xl border border-line bg-surface p-6 font-display text-lg font-medium leading-snug tracking-tight text-white sm:p-8"
            >
              {problem}
            </li>
          ))}
        </ul>
      </section>

      {/* ---- Feature rows ---- */}
      <Section>
        {anyFeatureImage ? (
          <div className="flex flex-col gap-16 sm:gap-24">
            {page.features.map((feature, i) => (
              <div key={feature.title} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.1] tracking-tight text-white">
                    {feature.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{feature.body}</p>
                </div>
                {featureImages[i] && (
                  <Image
                    src={featureImages[i]}
                    alt={feature.title}
                    width={1600}
                    height={900}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="h-auto w-full rounded-3xl border border-line"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          // No screenshots yet: a card grid reads better than six
          // half-empty alternating rows.
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {page.features.map((feature) => (
              <li key={feature.title} className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
                <h2 className="font-display text-xl font-medium tracking-tight text-white">
                  {feature.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{feature.body}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* ---- How it works ---- */}
      <Section>
        <SectionHeading>How it works</SectionHeading>
        <ol className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {page.steps.map((step, i) => (
            <li key={step} className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
              <span className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-4 text-base leading-relaxed text-white">{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ---- Demo video — only once the video exists ---- */}
      {page.videoId && (
        <Section>
          <SectionHeading>{page.videoHeading}</SectionHeading>
          <div className="mt-8 max-w-5xl">
            <VideoEmbed videoId={page.videoId} title={page.videoHeading} poster={videoPoster} />
          </div>
        </Section>
      )}

      {/* ---- Who it's for ---- */}
      <Section>
        <SectionHeading>Who it&apos;s for</SectionHeading>
        <ul className="mt-8 flex flex-wrap gap-3">
          {page.whoFor.map((who) => (
            <li
              key={who}
              className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-white/80"
            >
              {who}
            </li>
          ))}
        </ul>
      </Section>

      {/* ---- Optional statement (AI SEO: "Why it's free") ---- */}
      {page.note && (
        <Section>
          <SectionHeading>{page.note.heading}</SectionHeading>
          <blockquote className="mt-8 max-w-4xl font-display text-[clamp(1.25rem,2.5vw,1.75rem)] font-medium leading-[1.35] tracking-tight text-white">
            &ldquo;{page.note.quote}&rdquo;
          </blockquote>
        </Section>
      )}

      {/* ---- Comparison ---- */}
      <Section>
        <SectionHeading>Comparison</SectionHeading>
        {/* Scrolls inside its own box if a column ever gets too wide. */}
        <div className="mt-8 max-w-4xl overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                <td className="py-4 pr-4" />
                <th scope="col" className="py-4 pr-4 font-semibold text-accent">
                  {page.comparison.oursLabel}
                </th>
                <th scope="col" className="py-4 font-semibold">
                  {page.comparison.theirsLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {page.comparison.rows.map((row) => (
                <tr key={row.label} className="border-b border-line">
                  <th scope="row" className="py-4 pr-4 font-medium text-white/80">
                    {row.label}
                  </th>
                  <td className="py-4 pr-4 font-semibold text-white">{row.ours}</td>
                  <td className="py-4 text-muted">{row.theirs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---- FAQ ---- */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <SectionHeading>FAQ</SectionHeading>
          <div className="mt-8">
            <Accordion items={page.faq} />
          </div>
        </div>
      </Section>

      {/* ---- Final CTA band ---- */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="relative mx-auto w-full max-w-360 overflow-hidden rounded-3xl border border-line bg-surface px-6 py-14 text-center sm:px-16 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50rem_24rem_at_50%_0%,rgba(180,240,58,0.12),transparent_70%)]"
          />
          <div className="relative">
            <h2 className="mx-auto max-w-3xl font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.08] tracking-tight text-white">
              {page.finalCta.heading}
            </h2>
            <a href={installUrl(app, "footer")} rel="noopener" className={`${primaryButton} mt-9`}>
              Install free on Shopify
            </a>
            <p className="mt-6 text-sm text-muted">
              {page.finalCta.supportLine}{" "}
              <BookCallButton className="font-semibold text-white underline-offset-4 transition-colors hover:text-accent hover:underline">
                Book a call with Cracktab.
              </BookCallButton>
            </p>
          </div>
        </div>
      </section>

      {/* ---- Other Cracktab apps ---- */}
      {otherApps.length > 0 && (
        <Section>
          <SectionHeading>Other Cracktab apps</SectionHeading>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {otherApps.map((other) => (
              <AppCard
                key={other.slug}
                app={other}
                icon={findPublicAsset(appAsset(other.slug, "icon"))}
                fallbackHref={`${APPS_HUB_PATH}#apps`}
              />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
