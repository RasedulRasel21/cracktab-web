"use client";

import { useState } from "react";

/**
 * "Our Process" timeline. The filled dot implies a selected step, so the steps
 * are real buttons — clicking one moves the highlight and fills the connector
 * up to it. Purely presentational: nothing navigates.
 */
export default function ProcessTimeline({ steps }: { steps: string[] }) {
  const [active, setActive] = useState(0);

  return (
    <ol className="mt-8 flex flex-col">
      {steps.map((step, i) => {
        const isActive = i === active;
        const isLast = i === steps.length - 1;

        return (
          <li key={step} className="relative pb-9 last:pb-0">
            {/* Connector — accent for the segments already stepped through */}
            {!isLast && (
              <span
                aria-hidden="true"
                className={`absolute left-[5px] top-3 h-full w-px transition-colors duration-300 ${
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
              <span
                aria-hidden="true"
                className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-300 ${
                  isActive
                    ? "bg-accent"
                    : "border border-muted/70 bg-background group-hover:border-accent"
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
                    isActive ? "text-white" : "text-white/55 group-hover:text-white"
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
  );
}
