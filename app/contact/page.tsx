import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import BookCallButton from "../components/BookCallButton";
import { EMAIL, contact } from "../lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Call us, message us, or book a free audit — let's talk about your website.",
  alternates: { canonical: "/contact" },
};

const details = [
  { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { label: "Phone", value: contact.phone, href: contact.phoneHref },
  {
    label: "US Office",
    value: "6545 Market Ave N, Ste 100, Canton, OH 44721",
  },
  {
    label: "Bangladesh Office",
    value: "D/233 Mirpur DOHS, Dhaka 1216, Bangladesh",
  },
];

export default function ContactPage() {
  return (
    // Header + form share one viewport: compact spacing throughout, and
    // min-h (not h) so it can still grow rather than clip on short screens.
    <section className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-5 pb-12 pt-24 sm:px-8 sm:pb-14 sm:pt-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60rem_28rem_at_20%_-10%,rgba(180,240,58,0.10),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-360">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Contact
        </span>
        <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.04] tracking-tight text-white">
          Let&apos;s build your <span className="text-accent">website.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Call us, message us, book a free audit.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* Form (wired to a server action → SMTP) */}
          <ContactForm />

          {/* Details — paired two per row, map underneath */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {details.map((item) => (
                <div key={item.label}>
                  <span className="text-xs font-medium uppercase tracking-wide text-muted">
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-1 block text-sm text-white transition-colors hover:text-accent"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm leading-relaxed text-white/85">
                      {item.value}
                    </p>
                  )}
                </div>
              ))}
              <div className="sm:col-span-2">
                <span className="text-xs font-medium uppercase tracking-wide text-muted">
                  Business Hours
                </span>
                <p className="mt-1 text-sm text-white/85">
                  Mon–Fri 9 AM–6 PM EST · Sat 10 AM–4 PM EST
                </p>
              </div>
            </div>

            <iframe
              title="Cracktab US office location"
              src="https://www.google.com/maps?q=6545%20Market%20Ave%20N%2C%20Canton%2C%20OH%2044721&output=embed"
              loading="lazy"
              className="h-44 w-full rounded-2xl border border-line grayscale"
            />

            <BookCallButton className="inline-flex h-12 items-center justify-center rounded-full border border-line px-6 font-display text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-accent hover:text-accent">
              Prefer a call? Book a Call
            </BookCallButton>
          </div>
        </div>
      </div>
    </section>
  );
}
