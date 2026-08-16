"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BookCallButton from "./BookCallButton";
import { primaryNav, secondaryNav } from "../lib/site";

/**
 * Hamburger button (left side of the header) + the left slide-in panel.
 * Keeps interactivity isolated to a tiny client island so the rest of
 * the page stays fully static / server-rendered.
 */
export default function MenuPanel() {
  const [open, setOpen] = useState(false);

  // Lock body scroll + allow Escape to close while the panel is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="site-menu"
        className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-white transition-colors hover:border-accent hover:text-accent"
      >
        <span className="sr-only">Menu</span>
        <span aria-hidden="true" className="flex flex-col items-center gap-[5px]">
          <span className="block h-0.5 w-5 rounded-full bg-current" />
          <span className="block h-0.5 w-5 rounded-full bg-current" />
          <span className="block h-0.5 w-5 rounded-full bg-current" />
        </span>
      </button>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Left slide-in panel */}
      <aside
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed left-0 top-0 z-50 flex h-dvh w-[min(88vw,22rem)] flex-col border-r border-line bg-surface px-7 pb-8 pt-6 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 flex items-center justify-between">
          <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-white transition-colors hover:border-accent hover:text-accent"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Each row is a full-width band with a rule under it, so the links
            read as a list rather than a stack of text. */}
        <nav className="flex flex-col border-t border-line">
          {primaryNav.map((item) => {
            const className =
              "block border-b border-line py-4 font-display text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:text-accent";

            // Off-domain links can't use next/link routing — plain anchor, new tab.
            return item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className={className}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={className}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Secondary links + CTA sit together at the bottom of the panel */}
        <div className="mt-auto flex flex-col">
          {secondaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-line py-3 text-[0.7rem] font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Closes the drawer as it opens — the modal is portaled to <body>,
            so it isn't dragged off-screen with the panel. */}
        <BookCallButton
          onClick={() => setOpen(false)}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 font-display text-sm font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong"
        />
      </aside>
    </>
  );
}
