"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Device = "desktop" | "mobile";

export type Shots = { desktop: string; mobile: string };

/**
 * Shows a project inside a device mockup: a tall full-page screenshot in a
 * scrollable bezel, with a glass capsule to switch desktop/mobile.
 *
 * Screenshots rather than a live iframe on purpose — Shopify storefronts send
 * `X-Frame-Options: DENY` and `frame-ancestors 'none'`, so the browser refuses
 * to render them in a frame at all. The "Open live site" link covers the rest.
 */
export default function LivePreviewModal({
  title,
  shots,
  liveUrl,
  onClose,
}: {
  title: string;
  shots: Shots;
  liveUrl?: string;
  onClose: () => void;
}) {
  const [device, setDevice] = useState<Device>("desktop");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Start each device at the top of the page rather than mid-scroll.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [device]);

  const isDesktop = device === "desktop";

  return createPortal(
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${title} — preview`}
        className="relative flex max-h-full w-full flex-col items-center gap-5"
      >
        {/* Top bar — title, glass device toggle, close */}
        <div className="flex w-full max-w-5xl items-center justify-between gap-4">
          <span className="min-w-0 truncate font-display text-sm font-semibold uppercase tracking-[0.15em] text-white">
            {title}
          </span>

          {/* Glass capsule toggle */}
          <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1 shadow-lg backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              aria-pressed={isDesktop}
              aria-label="Desktop view"
              className={`inline-flex h-8 w-11 items-center justify-center rounded-full transition-colors ${
                isDesktop ? "bg-white/25 text-white" : "text-white/55 hover:text-white"
              }`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2.5" y="4" width="19" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
                <path d="M9 20.5h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              aria-pressed={!isDesktop}
              aria-label="Mobile view"
              className={`inline-flex h-8 w-11 items-center justify-center rounded-full transition-colors ${
                !isDesktop ? "bg-white/25 text-white" : "text-white/55 hover:text-white"
              }`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
                <path d="M10.75 18.75h2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition-colors hover:border-accent hover:text-accent"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Device mockup */}
        <div className="flex min-h-0 flex-col items-center">
          <div
            className={`relative bg-neutral-800 ${
              isDesktop ? "rounded-t-2xl p-2.5 pb-0" : "rounded-[2.75rem] p-3"
            }`}
          >
            {/* Phone notch */}
            <div
              aria-hidden="true"
              className={`absolute left-1/2 top-4 z-10 h-5 w-28 -translate-x-1/2 rounded-full bg-neutral-800 ${
                isDesktop ? "hidden" : ""
              }`}
            />
            <div
              ref={scrollRef}
              className={`relative overflow-y-auto overscroll-contain bg-white ${
                isDesktop
                  ? "aspect-16/10 h-[min(72dvh,44rem)] w-auto max-w-[92vw] rounded-lg"
                  : "aspect-9/19 h-[min(76dvh,46rem)] w-auto max-w-[86vw] rounded-[2rem]"
              }`}
            >
              {/* Plain <img>: these are tall full-page captures whose height is
                  unknown at build time, so they flow at natural aspect. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={isDesktop ? shots.desktop : shots.mobile}
                alt={`${title} — ${device} view`}
                className="block w-full"
              />
            </div>
          </div>

          {/* Laptop base */}
          <div
            aria-hidden="true"
            className={`h-3.5 w-[calc(100%+3rem)] rounded-b-xl bg-neutral-700 ${
              isDesktop ? "" : "hidden"
            }`}
          />
        </div>

        <p className="text-xs text-white/40">Scroll inside the frame to browse</p>

        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/60 transition-colors hover:text-accent"
          >
            Open live site
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M4 10L10 4M10 4H5M10 4v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
      </div>
    </div>,
    document.body,
  );
}
