"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { oneTeam } from "./content";
import { SectionHead } from "./ui";

/*
 * Real before/after screenshots from The Conscious Bar. "Before" is the live
 * page; "after" is the Cracktab CRO redesign. Numbers on the screenshots
 * match the notes under the slider.
 */

type View = {
  key: string;
  label: string;
  before: string;
  after: string;
  /** width / height of the screenshots */
  ratio: number;
  maxW: string;
  beforeNotes: [string, string][];
  afterNotes: [string, string][];
};

const VIEWS: View[] = [
  {
    key: "desktop",
    label: "Desktop",
    before: "/home/before-after/tcb-desk-before.jpg",
    after: "/home/before-after/tcb-desk-after.jpg",
    ratio: 1519 / 948,
    maxW: "max-w-5xl",
    beforeNotes: [
      ["4 discount messages compete", "Top bar, popup, code box and side tab"],
      ["$10 is the headline price", "The real $7.50 sits in a grey box"],
      ["8 large flavour cards", "Add to bag pushed 1,118px down"],
      ["Mixed thumbnails and radii", "4 image radii and 5 button radii"],
      ["No benefit summary", "No added sugar, organic, vegan only on the pack"],
      ["Hidden $35 minimum", "Shoppers only find out in the cart"],
    ],
    afterNotes: [
      ["One promo, auto-applied", "No code to copy, no popup"],
      ["Sale price first", "$10 struck through, savings badge"],
      ["Benefit chips", "Answer “is this actually healthy?”"],
      ["Compact flavour swatches", "Add to bag above the fold"],
      ["Pack picker", "6 bars by default, every pack clears $35"],
      ["Subscribe + free-shipping progress", "Right at the button"],
    ],
  },
  {
    key: "mobile",
    label: "Mobile",
    before: "/home/before-after/tcb-mob-before.jpg",
    after: "/home/before-after/tcb-mob-after.jpg",
    ratio: 798 / 1680,
    maxW: "max-w-[26rem]",
    beforeNotes: [
      ["Sweet Deal tab", "Covers the product image"],
      ["Code box", "Asks for a code the cart already applies"],
      ["$10 shown first", "$7.50 sits lower in a grey box"],
      ["Add to bag 1.5 screens down", "No sticky button on mobile"],
    ],
    afterNotes: [
      ["Sticky add to bag", "Shows pack, price and distance to free shipping"],
      ["Real price first", "No code needed"],
      ["Benefit chips", "Above the price"],
      ["Pack picker", "6 bars default, clears the $35 minimum"],
    ],
  },
  {
    key: "drawer",
    label: "Cart drawer",
    before: "/home/before-after/tcb-drawer-before.jpg",
    after: "/home/before-after/tcb-drawer-after.jpg",
    ratio: 900 / 1688,
    maxW: "max-w-[28rem]",
    beforeNotes: [
      ["Two separate progress bars", "$70 shipping on top, $35 minimum below"],
      ["Checkout greyed out", "Under $35, with no way to fix it here"],
      ["No add-ons or case upgrade", "Nothing helps reach the minimum"],
      ["Sweet Deal tab", "Covers the cart"],
    ],
    afterNotes: [
      ["One milestone bar", "$35 to check out, $70 to ship free"],
      ["Case of 12 upgrade", "Unlocks checkout and free shipping in one tap"],
      ["One-tap flavour adds", "Fill the bag fast"],
      ["Subscribe toggle", "With the real perks"],
      ["Build your own box", "For shoppers who want variety"],
      ["The button says what to do", "“Add 4 more bars to check out”"],
    ],
  },
];

const STATS = [
  ["Add to bag position", "1,118px down", "Above the fold"],
  ["Discount messages", "4", "1, auto-applied"],
  ["Pack options", "1 bar", "1, 6 or 12 bars"],
  ["Cart add-ons", "0", "5 one-tap offers"],
];

function Notes({ items, tone }: { items: [string, string][]; tone: "before" | "after" }) {
  const dot = tone === "before" ? "bg-[#c8372d]" : "bg-[#2f6b1f]";
  return (
    <ol className="space-y-3">
      {items.map(([t, s], i) => (
        <li key={t} className="flex gap-3">
          <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${dot}`}>
            {i + 1}
          </span>
          <span className="text-base leading-snug text-foreground">
            <span className="font-semibold">{t}.</span> <span className="text-muted">{s}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function BeforeAfter() {
  const [view, setView] = useState(0);
  const [pos, setPos] = useState(50);
  const wrap = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [hinted, setHinted] = useState(false);
  const v = VIEWS[view];

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
        const frames = [50, 36, 26, 40, 64, 74, 60, 50];
        frames.forEach((f, i) => window.setTimeout(() => !dragging.current && setPos(f), 250 + i * 150));
      },
      { threshold: 0.4 },
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
    <section id="before-after" className="scroll-mt-20 py-14 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
        <SectionHead eyebrow={oneTeam.eyebrow} title={oneTeam.title} body={oneTeam.body} center />

        <div role="tablist" aria-label="Page" className="mx-auto mt-10 flex w-fit flex-nowrap justify-center gap-1 rounded-full border border-line bg-surface p-1.5 sm:gap-2">
          {VIEWS.map((x, i) => (
            <button
              key={x.key}
              role="tab"
              type="button"
              aria-selected={i === view}
              onClick={() => {
                setView(i);
                setPos(50);
              }}
              className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors sm:px-5 ${
                i === view ? "bg-foreground text-background" : "text-muted hover:text-foreground"
              }`}
            >
              {x.label}
            </button>
          ))}
        </div>

        <div className={`relative mx-auto mt-8 ${v.maxW}`}>
          <div className="mb-3 flex justify-between px-1 font-serif text-lg italic text-muted sm:text-2xl">
            <span>before cracktab</span>
            <span>after cracktab</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_40px_90px_-40px_rgba(20,20,19,0.45)]">
            {v.key === "desktop" && (
              <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="mx-auto rounded-md bg-[var(--cream-2)] px-6 py-1 text-xs text-muted">
                  theconsciousbar.co/products/smooth-dark-chocolate
                </span>
              </div>
            )}
            <div
              ref={wrap}
              key={v.key}
              className="relative cursor-ew-resize touch-none select-none bg-white"
              style={{ aspectRatio: String(v.ratio) }}
              onPointerDown={(e) => {
                dragging.current = true;
                move(e.clientX);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.after} alt={`The Conscious Bar ${v.key === "drawer" ? "cart drawer" : `${v.label.toLowerCase()} product page`} after the Cracktab redesign`} className="absolute inset-0 h-full w-full object-cover object-top" draggable={false} />
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.before} alt={`The Conscious Bar ${v.key === "drawer" ? "cart drawer" : `${v.label.toLowerCase()} product page`} before`} className="absolute inset-0 h-full w-full object-cover object-top" draggable={false} />
              </div>
              <span className="absolute left-3 top-3 rounded-full bg-[#c8372d] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">Before</span>
              <span className="absolute right-3 top-3 rounded-full bg-[#2f6b1f] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">After</span>
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
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-[#c8372d]">Before</p>
            <Notes items={v.beforeNotes} tone="before" />
          </div>
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-[#2f6b1f]">After</p>
            <Notes items={v.afterNotes} tone="after" />
          </div>
        </div>

        <dl className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 sm:mt-14 lg:grid-cols-4">
          {STATS.map(([l, b, a]) => (
            <div key={l} className="min-w-0 rounded-2xl border border-line bg-surface p-4 sm:p-5">
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{l}</dt>
              <dd className="mt-3">
                <s className="block text-sm text-[#c8372d]">{b}</s>
                <span className="mt-1 block font-display text-lg font-bold leading-tight text-[#2f6b1f] sm:text-2xl">{a}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mx-auto mt-6 max-w-xl text-center text-sm text-muted">
          Before: live page, Nov 15, 2026. After: Cracktab CRO redesign. Every change ships as an A/B test.
        </p>
      </div>
    </section>
  );
}
