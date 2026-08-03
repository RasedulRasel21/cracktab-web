import type { Metadata } from "next";
import PageHeader from "../components/PageHeader";
import ContactForm from "./ContactForm";
import { EMAIL, contact, CALENDLY_URL } from "../lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Ready to transform your ecommerce vision into reality? Get in touch and let's discuss your project.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Let&apos;s build your <span className="text-accent">dream store.</span>
          </>
        }
        subtitle="Ready to transform your ecommerce vision into reality? Get in touch and let's discuss your project."
      />

      <section className="pb-20 sm:pb-28">
        <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Form (wired to a server action → Resend) */}
          <ContactForm />

          {/* Details */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-muted">Email</span>
                <a href={`mailto:${EMAIL}`} className="mt-1 block text-white transition-colors hover:text-accent">
                  {EMAIL}
                </a>
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-muted">Phone</span>
                <a href={contact.phoneHref} className="mt-1 block text-white transition-colors hover:text-accent">
                  {contact.phone}
                </a>
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-muted">US Office</span>
                <p className="mt-1 text-white/85">6545 Market Ave N, Ste 100, Canton, OH 44721</p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-muted">Bangladesh Office</span>
                <p className="mt-1 text-white/85">D/233 Mirpur DOHS, Dhaka 1216, Bangladesh</p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-muted">Business Hours</span>
                <p className="mt-1 text-white/85">Mon–Fri 9 AM–6 PM EST · Sat 10 AM–4 PM EST</p>
              </div>
            </div>

            <iframe
              title="Cracktab US office location"
              src="https://www.google.com/maps?q=6545%20Market%20Ave%20N%2C%20Canton%2C%20OH%2044721&output=embed"
              loading="lazy"
              className="h-64 w-full rounded-2xl border border-line grayscale"
            />

            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border border-line px-6 font-display text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-accent hover:text-accent"
            >
              Prefer a call? Book a Call
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
