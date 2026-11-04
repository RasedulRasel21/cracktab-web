"use client";

import { useEffect, useState } from "react";
import { PhoneFrame } from "./ui";

const SIZES = [
  { label: "15 ml", price: 32 },
  { label: "30 ml", price: 48 },
  { label: "50 ml", price: 68 },
];

function Bottle() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="oil" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f6c86a" />
          <stop offset="1" stopColor="#d99a2b" />
        </linearGradient>
        <linearGradient id="glass" x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".55" />
          <stop offset=".5" stopColor="#ffffff" stopOpacity=".1" />
          <stop offset="1" stopColor="#ffffff" stopOpacity=".45" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="176" rx="52" ry="7" fill="#000" opacity=".08" />
      <rect x="62" y="70" width="76" height="104" rx="14" fill="url(#oil)" />
      <rect x="62" y="70" width="76" height="104" rx="14" fill="url(#glass)" />
      <rect x="70" y="104" width="60" height="30" rx="3" fill="#fff" opacity=".85" />
      <rect x="78" y="112" width="44" height="4" rx="2" fill="#141413" opacity=".7" />
      <rect x="84" y="121" width="32" height="3" rx="1.5" fill="#141413" opacity=".35" />
      <rect x="80" y="50" width="40" height="22" rx="4" fill="#f4f1ea" />
      <rect x="88" y="26" width="24" height="26" rx="10" fill="#fff" />
      <rect x="132" y="96" width="44" height="10" rx="5" fill="#fff" transform="rotate(28 150 100)" />
      <rect x="150" y="118" width="6" height="40" rx="3" fill="#fff" opacity=".9" transform="rotate(28 150 100)" />
    </svg>
  );
}

export default function HeroPhone() {
  const [variant, setVariant] = useState<"A" | "B">("B");
  const [size, setSize] = useState(1);
  const [cart, setCart] = useState(0);
  const [added, setAdded] = useState(false);
  const [touched, setTouched] = useState(false);

  // Gently alternate variants until the visitor interacts.
  useEffect(() => {
    if (touched) return;
    const id = window.setInterval(() => setVariant((v) => (v === "A" ? "B" : "A")), 3200);
    return () => window.clearInterval(id);
  }, [touched]);

  useEffect(() => {
    if (!added) return;
    const id = window.setTimeout(() => setAdded(false), 1400);
    return () => window.clearTimeout(id);
  }, [added]);

  const price = SIZES[size].price;
  const b = variant === "B";

  return (
    <div className="relative mx-auto w-full max-w-[22rem]">
      {/* A/B switch */}
      <div className="mb-5 flex items-center justify-center gap-3">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">Live A/B test</span>
        <div role="tablist" aria-label="Test variant" className="flex rounded-full border border-line bg-surface p-1">
          {(["A", "B"] as const).map((v) => (
            <button
              key={v}
              role="tab"
              type="button"
              aria-selected={variant === v}
              onClick={() => {
                setTouched(true);
                setVariant(v);
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                variant === v ? "bg-foreground text-background" : "text-muted hover:text-foreground"
              }`}
            >
              {v === "A" ? "Control" : "Variant B"}
            </button>
          ))}
        </div>
      </div>

      <PhoneFrame className="aspect-[9/17] w-full sm:aspect-[9/18.5]">
        <div className="flex h-full flex-col bg-[#f6f5f2] text-[#141413]">
          {/* status bar */}
          <div className="flex items-center justify-between px-6 pt-3 text-[10px] font-semibold">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-3 rounded-[2px] bg-[#141413]" />
            </span>
          </div>
          {/* store header */}
          <div className="flex items-center justify-between px-4 pb-2 pt-3">
            <span className="flex flex-col gap-[3px]" aria-hidden="true">
              <span className="h-[2px] w-4 bg-current" />
              <span className="h-[2px] w-4 bg-current" />
              <span className="h-[2px] w-3 bg-current" />
            </span>
            <span className="text-[12px] font-bold tracking-[0.35em]">NORTHFOLD</span>
            <span className="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 7h12l-1 13H7L6 7Z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              <span
                className={`absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#141413] px-1 text-[9px] font-bold text-white transition-transform ${
                  added ? "scale-125" : "scale-100"
                }`}
              >
                {cart}
              </span>
            </span>
          </div>

          {/* image */}
          <div className="relative mx-0 aspect-[4/3.3] shrink-0 bg-[#f6dfe2]">
            <div className="absolute inset-x-10 inset-y-3">
              <Bottle />
            </div>
            <span
              className={`absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold transition-all duration-500 ${
                b ? "opacity-100" : "-translate-y-1 opacity-0"
              }`}
            >
              Bestseller
            </span>
            <span className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1" aria-hidden="true">
              <span className="h-1.5 w-4 rounded-full bg-white" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
            </span>
          </div>

          {/* details */}
          <div className="flex flex-1 flex-col px-4 pt-3">
            <div
              className={`grid transition-all duration-500 ${b ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <p className="flex items-center gap-1.5 pb-1.5 text-[10px] text-[#55534e]">
                  <span className="tracking-[1px] text-[#141413]">★★★★★</span> 4.8 · 1,240 reviews
                </p>
              </div>
            </div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className={`font-semibold leading-tight transition-all ${b ? "text-[15px]" : "text-[13px]"}`}>
                  Daily Glow Facial Oil
                </p>
                <p className={`text-[10.5px] text-[#55534e] transition-opacity ${b ? "opacity-100" : "opacity-0"}`}>
                  Squalane + rosehip
                </p>
              </div>
              <p className={`font-semibold transition-all ${b ? "text-[15px]" : "text-[12px] text-[#55534e]"}`}>
                ${price}
              </p>
            </div>

            {/* sizes */}
            <div className="mt-2.5 flex gap-1.5">
              {SIZES.map((s, i) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => {
                    setTouched(true);
                    setSize(i);
                  }}
                  className={`rounded-full px-3 py-1.5 text-[10.5px] font-medium transition-colors ${
                    size === i
                      ? "bg-[#141413] text-white"
                      : b
                        ? "bg-[#e9e7e2] text-[#141413]"
                        : "border border-[#d6d3cc] bg-white text-[#141413]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setTouched(true);
                setCart((c) => c + 1);
                setAdded(true);
              }}
              className={`mt-3 w-full rounded-xl py-2.5 text-[12px] font-semibold transition-all ${
                b ? "bg-[#141413] text-white" : "border border-[#141413] bg-transparent text-[#141413]"
              }`}
            >
              {added ? "Added ✓" : b ? `Add to cart · $${price}` : "Add to cart"}
            </button>

            <div
              className={`mt-2.5 flex justify-between text-[9.5px] text-[#55534e] transition-opacity duration-500 ${
                b ? "opacity-100" : "opacity-0"
              }`}
            >
              <span>✓ Free returns</span>
              <span>✓ Vegan</span>
              <span>✓ Ships in 24h</span>
            </div>
          </div>
          <span className="mx-auto mb-2 h-1 w-24 rounded-full bg-[#141413]" aria-hidden="true" />
        </div>
      </PhoneFrame>

      {/* floating result card */}
      <div className="absolute -left-4 bottom-24 hidden w-44 rounded-2xl border border-line bg-surface/95 p-3 shadow-[0_18px_40px_-18px_rgba(20,20,19,0.35)] backdrop-blur sm:block lg:-left-16">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">Revenue / visitor</p>
        <div className="mt-2 space-y-1.5">
          <div>
            <div className="flex justify-between text-[11px] text-muted">
              <span>Control</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-[var(--cream-2)]">
              <div className="h-full w-[52%] rounded-full bg-[#b9b2a5]" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] font-semibold text-foreground">
              <span>Variant B</span>
              <span className="text-[var(--olive)]">Winning</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-[var(--cream-2)]">
              <div className="h-full w-[78%] rounded-full bg-accent" />
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-muted">Example test on a demo store. Tap the sizes and the button.</p>
    </div>
  );
}
