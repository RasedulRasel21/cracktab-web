"use client";

import { useState } from "react";
import { pexels } from "../lib/site";

const INDUSTRIES = [
  "All",
  "Fashion & Apparel",
  "Electronics",
  "Single-Product",
  "High-Volume Catalog",
] as const;

type Theme = {
  name: string;
  industry: (typeof INDUSTRIES)[number];
  price: string;
  rating: number;
  img: string;
};

// Placeholder catalog — swap for real theme previews when available.
const themes: Theme[] = [
  { name: "Aurora", industry: "Fashion & Apparel", price: "$180", rating: 5, img: pexels(996329, 800, 600) },
  { name: "Vertex", industry: "Electronics", price: "$200", rating: 5, img: pexels(1029757, 800, 600) },
  { name: "Mono", industry: "Single-Product", price: "$160", rating: 4, img: pexels(2649403, 800, 600) },
  { name: "Bazaar", industry: "High-Volume Catalog", price: "$220", rating: 5, img: pexels(264636, 800, 600) },
  { name: "Silk", industry: "Fashion & Apparel", price: "$180", rating: 5, img: pexels(1488463, 800, 600) },
  { name: "Circuit", industry: "Electronics", price: "$200", rating: 4, img: pexels(356056, 800, 600) },
  { name: "Solo", industry: "Single-Product", price: "$160", rating: 5, img: pexels(1204464, 800, 600) },
  { name: "Emporium", industry: "High-Volume Catalog", price: "$220", rating: 5, img: pexels(230544, 800, 600) },
];

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
            key={t.name}
            className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-accent/50"
          >
            <div
              className="aspect-[4/3] bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: `url(${t.img})` }}
            />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-medium tracking-tight text-white">
                  {t.name}
                </h3>
                <span className="font-display text-sm font-semibold text-accent">
                  {t.price}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xs font-medium uppercase tracking-wide text-muted">
                  {t.industry}
                </span>
                <Stars rating={t.rating} />
              </div>
              <a
                href="#"
                className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-line font-display text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink"
              >
                Live Preview
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
