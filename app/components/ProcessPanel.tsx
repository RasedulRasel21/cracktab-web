"use client";

import { useState } from "react";
import ServiceIcon from "./ServiceIcon";
import { bulletCopy } from "../lib/serviceBulletNotes";

/**
 * "Our Process" timeline paired with the panel it drives.
 *
 * Both columns share one selection, so they live in a single client component.
 * Step 01 shows the "What's included" cards; every later step swaps the panel
 * for that stage's image.
 */
export default function ProcessPanel({
  steps,
  bullets,
  slug,
  images,
}: {
  steps: string[];
  bullets: string[];
  /** Service slug — selects that page's own card copy. */
  slug: string;
  images: string[];
}) {
  const [active, setActive] = useState(0);

  const showCards = active === 0 || images.length === 0;
  const image = images.length ? images[(active - 1) % images.length] : null;

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_2.2fr] lg:gap-16">
      {/* ---- Timeline ---- */}
      <div>
        <h2 className="font-display text-xl font-medium tracking-tight text-white sm:text-2xl">
          Our Process
        </h2>

        <ol className="mt-8 flex flex-col">
          {steps.map((step, i) => {
            const isActive = i === active;
            const isLast = i === steps.length - 1;

            return (
              <li key={step} className="relative pb-9 last:pb-0">
                {/* Connector — accent for segments already stepped through */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={`absolute left-1.5 top-3 h-full w-px transition-colors duration-300 ${
                      i < active ? "bg-accent/60" : "bg-line"
                    }`}
                  />
                )}

                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={isActive ? "step" : undefined}
                  className="group relative flex w-full items-start gap-5 rounded-sm text-left"
                >
                  {/* Filled in both states — a hairline ring on black was
                      effectively invisible at this size. */}
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-3 w-3 shrink-0 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-accent ring-4 ring-accent/20"
                        : "bg-muted/60 group-hover:bg-accent/70"
                    }`}
                  />
                  <span className="-mt-0.5 block">
                    <span
                      className={`block font-display text-sm font-medium transition-colors duration-300 ${
                        isActive ? "text-accent" : "text-muted"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`mt-1.5 block font-display text-base font-semibold leading-snug tracking-tight transition-colors duration-300 ${
                        isActive
                          ? "text-white"
                          : "text-white/55 group-hover:text-white"
                      }`}
                    >
                      {step}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* ---- Panel the timeline drives ---- */}
      <div>
        <h2 className="font-display text-xl font-medium tracking-tight text-white sm:text-2xl">
          {showCards ? "What's included" : steps[active]}
        </h2>

        {showCards ? (
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {bullets.map((label) => {
              const meta = bulletCopy(slug, label);
              return (
                <li
                  key={label}
                  className="group rounded-xl border border-line bg-surface p-5 transition-colors duration-300 hover:border-accent/50"
                >
                  {meta && (
                    <span className="inline-flex text-accent">
                      <ServiceIcon name={meta.icon} />
                    </span>
                  )}
                  <h3 className="mt-6 font-display text-sm font-semibold leading-snug tracking-tight text-white transition-colors group-hover:text-accent">
                    {label}
                  </h3>
                  {meta && (
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {meta.note}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div
            // `key` restarts the fade whenever the step changes.
            key={active}
            className="mt-8 animate-[fade-in_400ms_ease-out] overflow-hidden rounded-2xl border border-line"
          >
            <div
              className="aspect-[16/10] bg-cover bg-top"
              style={{ backgroundImage: `url(${image})` }}
              role="img"
              aria-label={steps[active]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
