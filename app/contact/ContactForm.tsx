"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "./actions";
import { countries } from "../lib/countries";

const initial: ContactState = { status: "idle", message: "" };

const fieldClass =
  "w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-white transition-colors focus:border-accent focus:outline-none disabled:opacity-60";

// Native select arrows sit tight against the edge and vary by browser, so the
// arrow is drawn here instead — `pr-11` reserves the gap it sits in.
const selectClass = `${fieldClass} appearance-none pr-11`;

const labelClass =
  "mb-2 block text-xs font-medium uppercase tracking-wide text-muted";

function Chevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
    >
      <path
        d="M3.5 6l4.5 4.5L12.5 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial);

  if (state.status === "success") {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-accent/40 bg-accent/5 p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-ink">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12.5l4 4 10-10"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
      className="rounded-2xl border border-line bg-surface/40 p-5 sm:p-6"
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
          <label htmlFor="firstName" className={labelClass}>
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            autoComplete="given-name"
            required
            disabled={pending}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            autoComplete="family-name"
            disabled={pending}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
            disabled={pending}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>
            Company Name
          </label>
          <input
            id="company"
            type="text"
            name="company"
            autoComplete="organization"
            disabled={pending}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone Number
          </label>
          <div className="flex gap-2">
            <div className="relative shrink-0">
              <select
                name="phoneCountry"
                defaultValue="US +1"
                aria-label="Country dialling code"
                disabled={pending}
                className={`${selectClass} w-28`}
              >
                {countries.map((c) => (
                  <option key={c.code} value={`${c.code} ${c.dial}`}>
                    {c.flag} {c.dial}
                  </option>
                ))}
              </select>
              <Chevron />
            </div>
            <input
              id="phone"
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              disabled={pending}
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="projectType" className={labelClass}>
            Project Type
          </label>
          <div className="relative">
            <select
              id="projectType"
              name="projectType"
              defaultValue=""
              disabled={pending}
              className={selectClass}
            >
              <option value="" disabled>
                Select…
              </option>
              <option>New Shopify Store</option>
              <option>Store Redesign</option>
              <option>Store Migration</option>
              <option>Custom App Development</option>
              <option>SEO Optimization</option>
              <option>Other</option>
            </select>
            <Chevron />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="details" className={labelClass}>
          Project Details
        </label>
        <textarea
          id="details"
          name="details"
          rows={4}
          required
          disabled={pending}
          className={fieldClass}
        />
      </div>

      {state.status === "error" && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 font-display text-sm font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
