"use client";

import { useState } from "react";
import Link from "next/link";
import { services } from "../lib/site";

function PlusIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-accent transition-transform duration-300 ${
        open ? "rotate-45" : ""
      }`}
    >
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Services() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="services" className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Left — heading */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Services
          </span>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.02] tracking-tight text-white">
            Our <span className="text-accent">service</span> offering
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            A quick look at what we do — each one links out to its own page with
            the full detail.
          </p>
        </div>

        {/* Right — expandable list */}
        <div className="flex flex-col">
          {services.map((s, i) => {
            const isOpen = open === i;
            return (
              <div key={s.href} className="border-t border-line last:border-b">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center gap-4 py-6 text-left"
                >
                  <PlusIcon open={isOpen} />
                  <span className="flex-1 font-display text-xl font-medium tracking-tight text-white transition-colors group-hover:text-accent sm:text-2xl">
                    {s.title}
                  </span>
                </button>

                {/* Expandable panel (grid-rows trick — smooth, no JS height calc) */}
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-7 pl-9 pr-2">
                      <p className="max-w-xl text-sm leading-relaxed text-muted">
                        {s.description}
                      </p>
                      {s.tag && (
                        <span className="mt-4 inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-accent">
                          {s.tag}
                        </span>
                      )}
                      <div className="mt-5">
                        <Link
                          href={s.href}
                          className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-5 font-display text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink"
                        >
                          Know more
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                            <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
