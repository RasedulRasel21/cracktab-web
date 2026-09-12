"use client";

import { useState } from "react";
import Image from "next/image";
import LivePreviewModal, { type Shots } from "../components/LivePreviewModal";

const INDUSTRIES = [
  "All",
  "Fashion & Apparel",
  "Beauty & Skincare",
  "Health & Wellness",
  "Pet Supplies",
] as const;

type Theme = {
  name: string;
  /**
   * Screenshot filename prefix in /public/themes — the three captures are
   * `<slug>-cover.png` (card), `<slug>-desktop.png` and `<slug>-mobile.png`
   * (preview modal). Note `blome` is the prefix on disk for Bloom.
   */
  slug: string;
  industry: Exclude<(typeof INDUSTRIES)[number], "All">;
  /** Both render only once set — no placeholder figures on a card that sells. */
  price?: string;
  rating?: number;
};

const themes: Theme[] = [
  { name: "Verve", slug: "verve", industry: "Fashion & Apparel" },
  { name: "Skinova", slug: "skinova", industry: "Beauty & Skincare" },
  { name: "Bloom", slug: "blome", industry: "Health & Wellness" },
  { name: "Dune", slug: "dune", industry: "Pet Supplies" },
];

const shotsFor = (slug: string): Shots => ({
  desktop: `/themes/${slug}-desktop.png`,
  mobile: `/themes/${slug}-mobile.png`,
});

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={i < rating ? "text-accent" : "text-white/20"}>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

export default function ThemeCatalog() {
  const [active, setActive] = useState<(typeof INDUSTRIES)[number]>("All");
  const [preview, setPreview] = useState<Theme | null>(null);
  const filtered = active === "All" ? themes : themes.filter((t) => t.industry === active);

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {INDUSTRIES.map((ind) => (
          <button
            key={ind}
            type="button"
            onClick={() => setActive(ind)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              active === ind
                ? "border-accent bg-accent text-accent-ink"
                : "border-line text-white/80 hover:border-accent hover:text-accent"
            }`}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <div
            key={t.slug}
            className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-accent/50"
          >
            {/* The captures are ~2.26:1 store hero shots, so the crop is
                anchored to the top — that keeps the header and headline, which
                is what identifies the theme at card size. */}
            <div className="relative aspect-16/10 overflow-hidden">
              <Image
                src={`/themes/${t.slug}-cover.png`}
                alt={`${t.name} theme homepage`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-medium tracking-tight text-white">
                  {t.name}
                </h3>
                {t.price && (
                  <span className="font-display text-sm font-semibold text-accent">
                    {t.price}
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xs font-medium uppercase tracking-wide text-muted">
                  {t.industry}
                </span>
                {t.rating && <Stars rating={t.rating} />}
              </div>
              <button
                type="button"
                onClick={() => setPreview(t)}
                className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-line font-display text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink"
              >
                Live Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shopify storefronts refuse to be framed, so the preview is the pair of
          full-page captures in a device mockup — same modal as the work cards. */}
      {preview && (
        <LivePreviewModal
          title={preview.name}
          shots={shotsFor(preview.slug)}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}
