"use client";

import { useState } from "react";
import Link from "next/link";
import { services } from "../lib/site";

function PlusIcon({ open }: { open: boolean }) {
  // Plus that collapses to a minus (vertical bar scales to 0) when open.
  return (
    <span className="relative flex h-5 w-5 shrink-0 items-center justify-center text-accent">
      <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
      <span
        className={`absolute h-3.5 w-0.5 rounded-full bg-current transition-transform duration-300 ${
          open ? "scale-y-0" : "scale-y-100"
        }`}
      />
    </span>
  );
}

export default function Services() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="services" className="py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:gap-52">
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
          <Link
            href="/services"
            className="group/all mt-6 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:text-accent"
          >
            View all services
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover/all:translate-x-1">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
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
                          className="group/btn inline-flex h-10 items-center gap-2 rounded-full border border-line bg-transparent px-5 font-display text-xs font-semibold uppercase tracking-[0.12em] text-white transition-[color,background-color,border-color] duration-[400ms] ease-out hover:border-accent hover:bg-accent hover:text-accent-ink"
                        >
                          Know more
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover/btn:translate-x-1"
                          >
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
