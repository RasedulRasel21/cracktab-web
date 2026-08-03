"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "./actions";

const initial: ContactState = { status: "idle", message: "" };

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-white placeholder:text-muted transition-colors focus:border-accent focus:outline-none disabled:opacity-60";

const labelClass =
  "mb-2 block text-xs font-medium uppercase tracking-wide text-muted";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial);

  if (state.status === "success") {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-accent/40 bg-accent/5 p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-ink">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-6 font-display text-xl font-medium text-white">
          Message sent
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-line bg-surface/40 p-6 sm:p-8"
    >
      {/* Honeypot (hidden from users) */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClass}>First Name</label>
          <input id="firstName" type="text" name="firstName" required disabled={pending} className={inputClass} placeholder="Jane" />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>Last Name</label>
          <input id="lastName" type="text" name="lastName" disabled={pending} className={inputClass} placeholder="Doe" />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email Address</label>
          <input id="email" type="email" name="email" required disabled={pending} className={inputClass} placeholder="jane@brand.com" />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>Company Name</label>
          <input id="company" type="text" name="company" disabled={pending} className={inputClass} placeholder="Brand Inc." />
        </div>
        <div>
          <label htmlFor="projectType" className={labelClass}>Project Type</label>
          <select id="projectType" name="projectType" defaultValue="" disabled={pending} className={inputClass}>
            <option value="" disabled>Select…</option>
            <option>New Shopify Store</option>
            <option>Store Redesign</option>
            <option>Store Migration</option>
            <option>Custom App Development</option>
            <option>SEO Optimization</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="budget" className={labelClass}>Budget Range</label>
          <select id="budget" name="budget" defaultValue="" disabled={pending} className={inputClass}>
            <option value="" disabled>Select…</option>
            <option>$1,000 – $2,500</option>
            <option>$2,500 – $5,000</option>
            <option>$5,000 – $10,000</option>
            <option>$10,000 – $25,000</option>
            <option>$25,000+</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="details" className={labelClass}>Project Details</label>
        <textarea id="details" name="details" rows={5} required disabled={pending} className={inputClass} placeholder="Tell us about your project…" />
      </div>

      {state.status === "error" && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 font-display text-sm font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
