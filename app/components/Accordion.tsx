"use client";

import { useState } from "react";
import type { Faq } from "../lib/site";

function PlusMinus({ open }: { open: boolean }) {
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

export default function Accordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex flex-col">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className="border-t border-line last:border-b">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group flex w-full items-center gap-4 py-6 text-left"
            >
              <PlusMinus open={isOpen} />
              <span className="flex-1 font-display text-lg font-medium tracking-tight text-white transition-colors group-hover:text-accent sm:text-xl">
                {it.q}
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-7 pl-9 pr-2 text-sm leading-relaxed text-muted">
                  {it.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
