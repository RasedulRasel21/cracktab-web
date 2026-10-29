import { contact, SITE_URL, type Faq } from "./site";

/**
 * Structured data (schema.org JSON-LD) for the pages search engines and AI
 * tools read to describe Cracktab: the company on the homepage, each service
 * page, and the FAQ. Blog posts build their own BlogPosting data.
 */

const ORG_ID = `${SITE_URL}/#organization`;

const sameAs = [
  "https://linkedin.com/company/cracktab",
  "https://facebook.com/cracktabagency",
  "https://www.instagram.com/cracktab/",
  "https://youtube.com/channel/UCNb4MhdV2wfhYcR6yvqU4wQ",
];

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": ORG_ID,
  name: "Cracktab",
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  image: `${SITE_URL}/opengraph-image`,
  description:
    "Shopify agency for store design and development, custom Shopify apps, ecommerce SEO and conversion rate optimization.",
  telephone: contact.phone,
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "6545 Market Ave N, Ste 100",
      addressLocality: "Canton",
      addressRegion: "OH",
      postalCode: "44721",
      addressCountry: "US",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "24/A, Road 1, Mirpur DOHS",
      addressLocality: "Dhaka",
      postalCode: "1216",
      addressCountry: "BD",
    },
  ],
  areaServed: "Worldwide",
  sameAs,
};

export function serviceSchema(service: { slug: string; name: string; intro: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.intro,
    url: `${SITE_URL}/services/${service.slug}`,
    serviceType: service.name,
    provider: { "@id": ORG_ID, "@type": "ProfessionalService", name: "Cracktab", url: SITE_URL },
    areaServed: "Worldwide",
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}
