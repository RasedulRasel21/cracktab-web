import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "../../components/PageHeader";
import { appPrivacy, findAppPrivacy, PRIVACY_EMAIL, PRIVACY_UPDATED } from "../../lib/appPrivacy";

export const dynamicParams = false;

export function generateStaticParams() {
  return appPrivacy.map((app) => ({ app: app.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ app: string }> }): Promise<Metadata> {
  const { app: slug } = await params;
  const app = findAppPrivacy(slug);
  if (!app) return {};
  return {
    title: `${app.name} Privacy Policy`,
    description: `What data the ${app.name} Shopify app collects, how it is used, and how to have it deleted.`,
    alternates: { canonical: `/privacy/${app.slug}` },
  };
}

function Section({
  n,
  heading,
  children,
}: {
  n?: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-3 font-display text-xl font-medium text-white">
        {n && <span className="text-accent">{n}. </span>}
        {heading}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function AppPrivacyPage({ params }: { params: Promise<{ app: string }> }) {
  const { app: slug } = await params;
  const app = findAppPrivacy(slug);
  if (!app) notFound();

  // Numbering shifts by one when the shoppers' section is shown.
  let n = 0;
  const next = () => String(++n);

  return (
    <>
      <PageHeader eyebrow="Legal" title={`${app.name} Privacy Policy`} />

      <section className="pb-24">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="max-w-3xl text-base leading-relaxed text-muted">
            <p className="mb-2 text-sm text-white/70">Last updated: {PRIVACY_UPDATED}</p>
            <p className="mb-4">
              {`This policy explains what information the ${app.name} app for Shopify (the “App”), made by Cracktab (“we,” “us”), collects when a merchant installs it, how we use it, and how it is deleted.`}
            </p>
            <p className="mb-10">{app.summary}</p>

            <div className="space-y-10">
              <Section n={next()} heading="Information We Collect">
                {app.collect.map((group) => (
                  <div key={group.heading}>
                    <h3 className="mb-2 font-medium text-white">{group.heading}</h3>
                    <List items={group.items} />
                  </div>
                ))}
              </Section>

              <Section n={next()} heading="How We Use It">
                <p>We use this information only to run the App for you:</p>
                <List items={app.use} />
                <p>We do not sell your data or your customers&apos; data, and we do not use it for advertising.</p>
              </Section>

              <Section n={next()} heading="Who We Share It With">
                <p>We share data only with the services the App needs to work:</p>
                <ul className="list-disc space-y-2 pl-5">
                  {app.providers.map((provider) => (
                    <li key={provider.name}>
                      <span className="text-white">{provider.name}</span>: {provider.purpose}.
                    </li>
                  ))}
                </ul>
                <p>We may also disclose information when the law requires it.</p>
              </Section>

              <Section n={next()} heading="How Long We Keep It">
                <List items={app.retention} />
              </Section>

              {app.shoppers && (
                <Section n={next()} heading="If You Are a Shopper">
                  <p>{app.shoppers}</p>
                </Section>
              )}

              <Section n={next()} heading="Your Rights">
                <p>
                  You can change or delete your settings in the App at any time, and uninstalling the App
                  removes your store&apos;s data as described above. Depending on where you live, you may
                  have rights under the GDPR, the CCPA or other laws to access, correct, export or delete
                  your information. Email {PRIVACY_EMAIL} and we will respond within 30 days.
                </p>
                <p>
                  We handle Shopify&apos;s required privacy requests (customer data requests, customer
                  deletion and store deletion) for this App.
                </p>
              </Section>

              <Section n={next()} heading="Security">
                <p>
                  Data is sent over encrypted connections (HTTPS) and stored with access controls on our
                  hosting providers. No method of transmission or storage is 100% secure, but we work to
                  protect your information.
                </p>
              </Section>

              <Section n={next()} heading="International Transfers">
                <p>
                  Our service providers may process data in countries other than yours, including the
                  United States. Where required, we rely on appropriate safeguards such as standard
                  contractual clauses.
                </p>
              </Section>

              <Section n={next()} heading="Children">
                <p>The App is for merchants and is not intended for anyone under 13.</p>
              </Section>

              <Section n={next()} heading="Changes to This Policy">
                <p>
                  If we change how the App handles data, we will update this page and its date. For
                  significant changes we will also tell you in the App or by email.
                </p>
              </Section>

              <Section n={next()} heading="Contact Us">
                <p>
                  Questions or requests: {PRIVACY_EMAIL}. Cracktab, 6545 Market Ave N, Ste 100, Canton, OH
                  44721. For our website and agency services, see the{" "}
                  <Link href="/privacy" className="text-white underline underline-offset-4">
                    Cracktab privacy policy
                  </Link>
                  .
                </p>
              </Section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
