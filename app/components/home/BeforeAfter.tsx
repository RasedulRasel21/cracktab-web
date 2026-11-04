"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { oneTeam } from "./content";
import { SectionHead } from "./ui";

/* Two coded storefront mock-ups of the same product page. */

function Shot({ tone }: { tone: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${tone}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="70" cy="30" r="18" fill="#fff" opacity=".25" />
        <rect x="34" y="34" width="32" height="54" rx="7" fill="#e7b04f" />
        <rect x="38" y="52" width="24" height="12" rx="2" fill="#fff" opacity=".85" />
        <rect x="42" y="24" width="16" height="11" rx="2" fill="#f4f1ea" />
        <rect x="45" y="14" width="10" height="11" rx="4" fill="#fff" />
      </svg>
    </div>
  );
}

function Before() {
  return (
    <div className="flex h-full flex-col bg-[#ececec] text-[#222]">
      <div className="bg-[#c0392b] py-1 text-center text-[9px] font-bold uppercase text-white sm:text-[10px]">
        !!! SALE SALE SALE — USE CODE SAVE10 — FREE SHIPPING OVER $100 — SALE !!!
      </div>
      <div className="flex items-center justify-between border-b border-[#ccc] bg-white px-4 py-2 text-[10px] sm:text-xs">
        <span className="font-serif text-sm font-bold">Northfold Skincare Shop</span>
        <span className="hidden gap-3 text-[#555] sm:flex">
          <span>Home</span><span>Shop</span><span>Blog</span><span>About</span><span>FAQ</span><span>Contact</span><span>Wholesale</span>
        </span>
        <span>Cart (0)</span>
      </div>
      <div className="grid flex-1 grid-cols-[0.8fr_1.2fr] gap-4 p-4 sm:gap-6 sm:p-6">
        <div className="space-y-2">
          <div className="relative aspect-square w-full border-[6px] border-white bg-white outline outline-1 outline-[#ccc]">
            <Shot tone="bg-[#d9d9d9]" />
          </div>
          <div className="grid grid-cols-4 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-square border border-[#ccc] bg-[#ddd]" />
            ))}
          </div>
        </div>
        <div className="min-w-0 text-[9px] leading-snug text-[#444] sm:text-[11px]">
          <p className="font-serif text-sm font-bold text-[#222] sm:text-lg">DAILY GLOW FACIAL OIL 30ML (SQUALANE/ROSEHIP) - NEW FORMULA</p>
          <p className="mt-1 text-[#888]">SKU: NF-DGO-30-V2 · In stock</p>
          <p className="mt-2 text-sm font-bold text-[#c0392b] sm:text-base">$48.00</p>
          <p className="mt-2">
            Our facial oil is made with natural ingredients. It contains squalane and rosehip and many other oils that are good for
            your skin. Apply 2-3 drops morning and night. Avoid eyes. For external use only. Results may vary. See full ingredients
            list below. Made in a facility that also handles nuts. Store in a cool dry place...
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span>Size:</span>
            <span className="border border-[#aaa] bg-white px-2 py-0.5">30ml ▾</span>
            <span>Qty:</span>
            <span className="border border-[#aaa] bg-white px-2 py-0.5">1</span>
          </div>
          <span className="mt-3 inline-block bg-[#bbb] px-4 py-1.5 text-[10px] font-bold uppercase text-white">Add to cart</span>
          <p className="mt-3 text-[#999]">No reviews yet. Be the first to write a review!</p>
        </div>
      </div>
    </div>
  );
}

function After() {
  return (
    <div className="flex h-full flex-col bg-[#faf8f4] text-[#141413]">
      <div className="bg-[#141413] py-1 text-center text-[9px] font-medium text-white sm:text-[10px]">
        Free shipping over $50 · 60-day returns
      </div>
      <div className="flex items-center justify-between bg-white px-4 py-2.5 text-[10px] sm:text-xs">
        <span className="hidden gap-4 text-[#55534e] sm:flex">
          <span>Shop</span><span>Bestsellers</span><span>Routine finder</span>
        </span>
        <span className="text-xs font-bold tracking-[0.3em] sm:text-sm">NORTHFOLD</span>
        <span className="rounded-full bg-[#141413] px-3 py-1 text-[10px] font-semibold text-white">Bag · 0</span>
      </div>
      <div className="grid flex-1 grid-cols-[1.05fr_0.95fr] gap-4 p-4 sm:gap-7 sm:p-6">
        <div className="relative overflow-hidden rounded-xl">
          <Shot tone="bg-[#f3d9dd]" />
          <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-0.5 text-[9px] font-semibold sm:text-[10px]">Bestseller</span>
        </div>
        <div className="flex min-w-0 flex-col justify-center text-[10px] sm:text-xs">
          <p className="text-[#55534e]">
            <span className="tracking-[1px] text-[#141413]">★★★★★</span> 4.8 · 1,240 reviews
          </p>
          <p className="mt-1.5 font-display text-base font-semibold leading-tight sm:text-2xl">Daily Glow Facial Oil</p>
          <p className="mt-1 text-[#55534e]">Squalane + rosehip. Glow in 14 days or your money back.</p>
          <div className="mt-3 flex gap-1.5">
            {["15 ml", "30 ml", "50 ml"].map((s, i) => (
              <span
                key={s}
                className={`rounded-full px-2.5 py-1 text-[10px] font-medium sm:text-[11px] ${i === 1 ? "bg-[#141413] text-white" : "bg-[#e9e7e2]"}`}
              >
                {s}
              </span>
            ))}
          </div>
          <span className="mt-3 block rounded-lg bg-[#141413] py-2 text-center text-[11px] font-semibold text-white sm:text-xs">
            Add to cart · $48
          </span>
          <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-[#55534e] sm:text-[10px]">
            <span>✓ Free returns</span>
            <span>✓ Vegan</span>
            <span>✓ Ships in 24h</span>
          </div>
          <div className="mt-3 rounded-lg bg-white p-2 text-[9px] text-[#55534e] sm:text-[10px]">
            “My skin hasn’t looked this good in years.” — Verified buyer
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const wrap = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [hinted, setHinted] = useState(false);

  const move = useCallback((clientX: number) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  // One gentle sweep when the block first scrolls into view, to show it moves.
  useEffect(() => {
    const el = wrap.current;
    if (!el || hinted) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setHinted(true);
        io.disconnect();
        const frames = [50, 38, 28, 40, 62, 72, 60, 50];
        frames.forEach((v, i) => window.setTimeout(() => !dragging.current && setPos(v), 250 + i * 140));
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hinted]);

  useEffect(() => {
    const up = () => (dragging.current = false);
    const mv = (e: PointerEvent) => dragging.current && move(e.clientX);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointermove", mv);
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointermove", mv);
    };
  }, [move]);

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
        <SectionHead eyebrow={oneTeam.eyebrow} title={oneTeam.title} body={oneTeam.body} center />

        <div className="relative mx-auto mt-14 max-w-5xl">
          <div className="mb-3 flex justify-between px-1 font-serif text-lg italic text-muted sm:text-2xl">
            <span>before cracktab</span>
            <span>after cracktab</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_40px_90px_-40px_rgba(20,20,19,0.45)]">
            <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="mx-auto rounded-md bg-[var(--cream-2)] px-6 py-1 text-[11px] text-muted">northfold.com/products/daily-glow</span>
            </div>
            <div
              ref={wrap}
              className="relative aspect-[4/3] cursor-ew-resize touch-none select-none sm:aspect-[16/9]"
              onPointerDown={(e) => {
                dragging.current = true;
                move(e.clientX);
              }}
            >
              <div className="absolute inset-0">
                <After />
              </div>
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
                <Before />
              </div>
              <div className="absolute inset-y-0 z-10 w-0.5 bg-[#141413]" style={{ left: `${pos}%` }}>
                <button
                  type="button"
                  aria-label="Drag to compare before and after"
                  role="slider"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(pos)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
                    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
                  }}
                  className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#141413] text-white shadow-lg"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-4 sm:gap-4 sm:py-2 sm:pl-2 sm:pr-6 shadow-[0_20px_40px_-18px_rgba(20,20,19,0.4)]">
            <span className="whitespace-nowrap rounded-full bg-[#141413] px-4 py-2 font-display text-lg font-bold text-white sm:px-5 sm:py-2.5 sm:text-2xl">
              {oneTeam.result} <span className="text-xs font-medium text-white/70 sm:text-base">{oneTeam.resultLabel}</span>
            </span>
            <svg width="30" height="20" viewBox="0 0 30 20" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-foreground" aria-hidden="true">
              <path d="M2 17l8-8 5 5 11-11M19 3h7v7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <p className="mx-auto mt-14 max-w-xl text-center text-xs text-muted">
          Illustration of a typical product-page test. Drag the handle to compare.
        </p>
      </div>
    </section>
  );
}
