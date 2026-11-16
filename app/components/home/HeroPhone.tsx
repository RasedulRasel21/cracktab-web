"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { PhoneFrame } from "./ui";

/**
 * Hero phone. Cycles through client product pages:
 *  - The Conscious Bar: their live page ("Before") against the page Cracktab
 *    designed and coded ("After"), which is fully interactive and scrolls
 *    through every block below the buy box.
 *  - Luxe Cosmetics, Pürishh and ForChics: real screenshots of their live
 *    product pages, scrolled top to bottom.
 * Autoplay stops as soon as the visitor touches anything.
 */

const barAlt = (id: string) => `The Conscious Bar ${FLAVORS.find((x) => x.id === id)?.name ?? "chocolate"} bar`;

const FLAVORS = [
  { id: "smooth-dark-chocolate", name: "Smooth Dark Chocolate" },
  { id: "orange-blossom", name: "Orange Blossom" },
  { id: "almond-sea-salt", name: "Almond Sea Salt" },
  { id: "roasted-hazelnut", name: "Roasted Hazelnut" },
  { id: "toasted-coconut-flakes", name: "Toasted Coconut Flakes" },
  { id: "espresso-crunch", name: "Espresso Crunch" },
];
const PACKS = [
  { n: 1, label: "1 bar", price: 7.5, note: "$35 min order" },
  { n: 6, label: "6 bars", price: 45, note: "Mix flavours", tag: "Popular" },
  { n: 12, label: "Case of 12", price: 78, note: "Free shipping", tag: "Best value" },
];
const FREE_SHIP = 70;
const tcb = (id: string) => `/home/clients/tcb-${id}.jpg`;

type Brand = {
  key: string;
  name: string;
  screen?: string;
  chips: [string, string][];
};

const BRANDS: Brand[] = [
  {
    key: "tcb",
    name: "The Conscious Bar",
    chips: [
      ["Real price first", "No code to copy"],
      ["Pack picker", "Clears $35 min"],
      ["Sticky add to bag", "Always in reach"],
    ],
  },
  {
    key: "luxe",
    name: "Luxe",
    screen: "/home/screens/luxe-brow-pdp.jpg",
    chips: [
      ["Set picker", "Single, Friends, Family"],
      ["Benefit checklist", "Six reasons to buy"],
      ["Trust row", "97,000+ happy customers"],
    ],
  },
  {
    key: "purishh",
    name: "Pürishh",
    screen: "/home/screens/purishh-pdp.jpg",
    chips: [
      ["Benefit pills", "Natural, potent"],
      ["UGC video reel", "Real customers"],
      ["Ingredient breakdown", "Dose by dose"],
    ],
  },
  {
    key: "forchics",
    name: "ForChics",
    screen: "/home/screens/forchics-pdp.jpg",
    chips: [
      ["Clinician proof", "357 recommend it"],
      ["Scent picker", "Best seller flagged"],
      ["Bundle tiers", "Buy more, save more"],
    ],
  },
];

/* Autoplay script: [brand index, variant, ms] */
const STEPS: [number, "before" | "after", number][] = [
  [0, "before", 3600],
  [0, "after", 11000],
  [1, "after", 8500],
  [2, "after", 8500],
  [3, "after", 8500],
];

/** Scrolls a container from top to bottom over `ms` while `active`. */
function useAutoScroll(ref: RefObject<HTMLDivElement | null>, active: boolean, ms: number, key: string) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = 0;
    if (!active) return;
    let raf = 0;
    let start = 0;
    const delay = 900;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, Math.max(0, (t - start - delay) / (ms - delay - 600)));
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      el.scrollTop = ease * (el.scrollHeight - el.clientHeight);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ref, active, ms, key]);
}

export default function HeroPhone() {
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState(false);
  // While autoplaying, brand and version come from the script; once the
  // visitor touches anything their own choice takes over.
  const [manualBrand, setManualBrand] = useState(0);
  const [manualVariant, setManualVariant] = useState<"before" | "after">("after");
  const [flavor, setFlavor] = useState(0);
  const [pack, setPack] = useState(1);
  const [cart, setCart] = useState(0);
  const [added, setAdded] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  // Autoplay through the script until the visitor interacts.
  useEffect(() => {
    if (touched) return;
    const ms = STEPS[step][2];
    const id = window.setTimeout(() => setStep((s) => (s + 1) % STEPS.length), ms);
    return () => window.clearTimeout(id);
  }, [step, touched]);

  useEffect(() => {
    if (!added) return;
    const id = window.setTimeout(() => setAdded(false), 1400);
    return () => window.clearTimeout(id);
  }, [added]);

  const brand = touched ? manualBrand : STEPS[step][0];
  const variant = touched ? manualVariant : STEPS[step][1];
  const setBrand = setManualBrand;
  const setVariant = setManualVariant;
  const stepMs = STEPS[step][2];
  const autoScrolling = !touched && (brand !== 0 || variant === "after");
  useAutoScroll(scroller, autoScrolling, stepMs, `${brand}-${variant}-${step}`);

  const touch = useCallback(() => {
    if (touched) return;
    setManualBrand(STEPS[step][0]);
    setManualVariant(STEPS[step][1]);
    setTouched(true);
  }, [touched, step]);
  const b = BRANDS[brand];
  const isTcb = b.key === "tcb";
  const after = variant === "after";
  const f = FLAVORS[flavor];
  const p = PACKS[pack];
  const toShip = Math.max(0, FREE_SHIP - p.price);

  return (
    <div className="ui-demo relative mx-auto w-full max-w-[22.5rem]">
      {/* brand switch */}
      <div role="tablist" aria-label="Client" className="mb-3 flex flex-wrap justify-center gap-1.5">
        {BRANDS.map((x, i) => (
          <button
            key={x.key}
            role="tab"
            type="button"
            aria-selected={i === brand}
            onClick={() => {
              touch();
              setBrand(i);
              if (i === 0) setVariant("after");
            }}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              i === brand ? "border-foreground bg-foreground text-background" : "border-line bg-surface text-muted hover:text-foreground"
            }`}
          >
            {x.name}
          </button>
        ))}
      </div>

      {/* before / after (The Conscious Bar only) */}
      <div className={`mb-4 flex items-center justify-center gap-2 transition-opacity ${isTcb ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <div role="tablist" aria-label="Page version" className="flex rounded-full border border-line bg-surface p-1">
          {(["before", "after"] as const).map((v) => (
            <button
              key={v}
              role="tab"
              type="button"
              aria-selected={variant === v}
              tabIndex={isTcb ? 0 : -1}
              onClick={() => {
                touch();
                setVariant(v);
              }}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                variant === v ? (v === "before" ? "bg-[#c8372d] text-white" : "bg-[#2f6b1f] text-white") : "text-muted hover:text-foreground"
              }`}
            >
              {v === "before" ? "Before" : "After Cracktab"}
            </button>
          ))}
        </div>
      </div>

      <PhoneFrame className="aspect-[9/18.6] w-full">
        {isTcb ? (
          <div className="relative flex h-full flex-col bg-[#fbf7f0] text-[#2a1810]">
            {/* promo bar + header (fixed) */}
            <div className="bg-[#4a1d0f] px-3 pb-1.5 pt-8 text-center text-[9.5px] font-semibold uppercase tracking-[0.06em] text-white">
              {after ? "25% off core flavours · auto-applied" : <span className="underline">Subscribe &amp; save up to 30%</span>}
            </div>
            <div className="flex items-center justify-between px-4 py-2">
              <span className="flex flex-col gap-[3px]" aria-hidden="true">
                <span className="h-[1.5px] w-4 bg-current" />
                <span className="h-[1.5px] w-4 bg-current" />
                <span className="h-[1.5px] w-4 bg-current" />
              </span>
              <span className="font-serif text-[15px] leading-none tracking-tight">
                <span className="align-top text-[8px]">The</span> Conscious <span className="text-[8px]">Bar</span>
              </span>
              <span className="relative">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 7h12l-1 13H7L6 7Z" />
                  <path d="M9 7a3 3 0 0 1 6 0" />
                </svg>
                <span className={`absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#4a1d0f] px-1 text-[9px] font-bold text-white transition-transform ${added ? "scale-125" : ""}`}>
                  {cart}
                </span>
              </span>
            </div>

            {/* scrolling page */}
            <div
              ref={scroller}
              onWheel={touch}
              onTouchStart={touch}
              className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="relative mx-3 aspect-[4/3.2] overflow-hidden rounded-xl bg-[#e8d5bd]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={after ? f.id : "b"} src={tcb(after ? f.id : "smooth-dark-chocolate")} alt={barAlt(after ? f.id : "smooth-dark-chocolate")} className="h-full w-full animate-[fade-in_.35s_ease] object-cover" />
                {after ? (
                  <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-semibold">No added sugar · Sweetened with dates</span>
                ) : (
                  <span className="absolute right-0 top-1/3 rounded-l-xl bg-[#3a1a10] px-1.5 py-3 text-[9px] font-semibold text-white [writing-mode:vertical-rl]">Sweet Deal</span>
                )}
              </div>

              <div className="px-4 pb-4 pt-2.5">
                {!after && <span className="rounded bg-[#1d1d1d] px-1.5 py-0.5 text-[9px] font-semibold text-white">Early Access Sale</span>}
                <p className={`font-serif leading-tight ${after ? "text-[16px]" : "mt-1.5 text-[15px]"}`}>{after ? f.name : "Smooth Dark Chocolate"}</p>
                <p className="mt-0.5 text-[10px] text-[#6b5a4e]">
                  <span className="tracking-[1px] text-[#2a1810]">★★★★★</span> 4.81 {after ? <span className="underline">6,830 reviews</span> : "(6830)"}
                </p>

                {after ? (
                  <>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {["No added sugar", "2 ingredients", "Organic", "Vegan"].map((c) => (
                        <span key={c} className="rounded-full border border-[#dccdbb] bg-white px-1.5 py-0.5 text-[8.5px] font-medium">{c}</span>
                      ))}
                    </div>
                    <p className="mt-1.5 flex items-baseline gap-1.5">
                      <span className="font-serif text-[17px]">${(p.price / p.n).toFixed(2)}</span>
                      <s className="text-[10px] text-[#9a8b7e]">$10.00</s>
                      <span className="rounded-full bg-[#dff0d6] px-1.5 py-0.5 text-[8.5px] font-bold text-[#2f6b1f]">SAVE 25%</span>
                    </p>
                    <p className="text-[8.5px] text-[#6b5a4e]">Applied automatically at checkout, no code needed.</p>
                    <div className="mt-1.5 flex gap-1">
                      {FLAVORS.map((fl, i) => (
                        <button key={fl.id} type="button" aria-label={fl.name} onClick={() => { touch(); setFlavor(i); }} className={`h-8 w-8 shrink-0 overflow-hidden rounded-md border-2 ${i === flavor ? "border-[#4a1d0f]" : "border-transparent"}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={tcb(fl.id)} alt={barAlt(fl.id)} className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-1">
                      {PACKS.map((pk, i) => (
                        <button key={pk.n} type="button" onClick={() => { touch(); setPack(i); }} className={`relative rounded-lg border px-1.5 pb-1 pt-1.5 text-left ${i === pack ? "border-[#4a1d0f] bg-[#f4e9da]" : "border-[#e2d6c6] bg-white"}`}>
                          {pk.tag && <span className="absolute -top-1.5 right-1 rounded bg-[#4a1d0f] px-1 text-[6.5px] font-bold uppercase text-white">{pk.tag}</span>}
                          <span className="block text-[9.5px] font-semibold">{pk.label}</span>
                          <span className="block font-serif text-[10px]">${pk.price.toFixed(2)}</span>
                          <span className="block text-[7.5px] text-[#6b5a4e]">{pk.note}</span>
                        </button>
                      ))}
                    </div>
                    <label className="mt-2 flex items-center gap-1.5 rounded-lg border border-dashed border-[#d8c9b5] px-2 py-1.5 text-[8.5px]">
                      <span className="h-3 w-3 rounded-sm border border-[#4a1d0f]" />
                      Subscribe and save up to 30% · free gift every 3rd order
                    </label>

                    {/* below the buy box */}
                    <div className="mt-4 rounded-xl bg-white p-2.5">
                      <p className="text-[10px] font-semibold">★★★★★ 4.81 from 6,830 reviews</p>
                      <p className="mt-0.5 text-[8.5px] text-[#6b5a4e]">Photo reviews first · filter by flavour</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {["All", "Smooth Dark", "Orange Blossom", "Hazelnut"].map((c, i) => (
                          <span key={c} className={`rounded-full px-1.5 py-0.5 text-[8px] font-semibold ${i === 0 ? "bg-[#4a1d0f] text-white" : "border border-[#dccdbb]"}`}>{c}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="font-serif text-[13px]">What&apos;s inside</p>
                      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                        {[["🍫", "Cacao"], ["🌴", "Dates"]].map(([e, t]) => (
                          <div key={t} className="flex items-center gap-1.5 rounded-lg bg-white p-2 text-[9px] font-semibold"><span className="text-[14px]">{e}</span>{t}</div>
                        ))}
                      </div>
                      <p className="mt-1.5 text-[8.5px] text-[#6b5a4e]">Two ingredients. Nutrition panel and pack claims as icons.</p>
                    </div>
                    <div className="mt-3 rounded-xl bg-white p-2.5">
                      <p className="font-serif text-[13px]">Dates vs sugar</p>
                      <div className="mt-1.5 grid grid-cols-3 gap-y-1 text-[8.5px]">
                        <span />
                        <span className="text-center font-semibold">Ours</span>
                        <span className="text-center font-semibold text-[#9a8b7e]">Typical bar</span>
                        {[["Sweetened with", "Dates", "Sugar"], ["Added sugar", "None", "Yes"]].map(([k, a, z]) => (
                          <span key={k} className="contents">
                            <span>{k}</span>
                            <span className="text-center font-semibold text-[#2f6b1f]">{a}</span>
                            <span className="text-center text-[#9a8b7e]">{z}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="font-serif text-[13px]">Real customers</p>
                      <div className="mt-1.5 grid grid-cols-3 gap-1">
                        {["orange-blossom", "almond-sea-salt", "roasted-hazelnut"].map((id) => (
                          <div key={id} className="relative aspect-[3/4] overflow-hidden rounded-lg">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={tcb(id)} alt={barAlt(id)} className="h-full w-full object-cover" />
                            <span className="absolute inset-0 flex items-center justify-center text-[14px] text-white drop-shadow">▶</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 divide-y divide-[#eadfce] rounded-xl bg-white px-2.5">
                      {["How long does shipping take?", "Will it melt in summer?", "Is there a minimum order?"].map((q) => (
                        <p key={q} className="flex justify-between py-2 text-[9px] font-semibold">{q}<span>+</span></p>
                      ))}
                    </div>
                    <p className="mt-3 font-serif text-[13px]">Pairs well with</p>
                    <div className="mt-1.5 grid grid-cols-3 gap-1">
                      {["toasted-coconut-flakes", "espresso-crunch", "orange-blossom"].map((id) => (
                        <div key={id} className="rounded-lg bg-white p-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={tcb(id)} alt={barAlt(id)} className="aspect-square w-full rounded object-cover" />
                          <p className="mt-0.5 text-center text-[8px] font-semibold">+ $7.50</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-1.5 font-serif text-[14px]">$10.00</p>
                    <div className="mt-2 rounded-lg bg-[#efe9e1] p-2.5">
                      <p className="text-[10.5px] font-semibold leading-snug">Use code EARLYACCESS25 at checkout for 25% off</p>
                      <p className="mt-1 text-[10px]">$7.50 with code <span className="rounded-full bg-[#3a1a10] px-1.5 py-0.5 text-[8px] font-bold text-white">EARLYACCESS25</span></p>
                      <span className="mt-1.5 inline-block rounded-full bg-[#3a1a10] px-3 py-1 text-[9px] font-semibold text-white">Apply now</span>
                    </div>
                    <p className="mt-2 text-[9px] text-[#6b5a4e]">Flavor</p>
                    <div className="mt-1 grid grid-cols-3 gap-1.5">
                      {FLAVORS.map((fl) => (
                        <div key={fl.id} className="overflow-hidden rounded-lg border border-[#e2d6c6] bg-white p-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={tcb(fl.id)} alt={barAlt(fl.id)} className="aspect-square w-full rounded object-cover" />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {after ? (
              <div className="flex items-center gap-2 border-t border-[#eadfce] bg-white px-3 py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={tcb(f.id)} alt={barAlt(f.id)} className="h-8 w-8 rounded object-cover" />
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-[9.5px] font-semibold">{p.label} · {f.name.split(" ")[0]}</p>
                  <p className="text-[8.5px] text-[#6b5a4e]">${p.price.toFixed(2)} · {toShip > 0 ? `$${toShip.toFixed(0)} to free shipping` : "Free shipping"}</p>
                </div>
                <button type="button" onClick={() => { touch(); setCart((c) => c + p.n); setAdded(true); }} className="rounded-lg bg-[#4a1d0f] px-3 py-2 text-[10px] font-semibold text-white">
                  {added ? "Added ✓" : "Add to bag"}
                </button>
              </div>
            ) : (
              <div className="bg-[#c8372d] px-3 py-2.5 text-center text-[10px] font-semibold text-white">Add to bag is 1.5 screens further down</div>
            )}
            <span className="mx-auto my-1.5 h-1 w-24 rounded-full bg-[#2a1810]" aria-hidden="true" />
          </div>
        ) : (
          <div ref={scroller} onWheel={touch} onTouchStart={touch} className="h-full overflow-y-auto bg-white pt-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={b.key} src={b.screen} alt={`${b.name} live product page on mobile`} className="block w-full animate-[fade-in_.4s_ease]" />
          </div>
        )}
      </PhoneFrame>

      <ul className="mt-4 grid grid-cols-3 gap-2">
        {b.chips.map(([t, sub]) => (
          <li key={t} className="rounded-xl border border-line bg-surface px-2 py-2 text-center">
            <span className="block text-[12px] font-semibold leading-tight text-foreground">✓ {t}</span>
            <span className="mt-0.5 block text-[11px] leading-tight text-muted">{sub}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-center text-[13px] text-muted">
        {isTcb
          ? after
            ? "The Conscious Bar after our CRO redesign. Tap flavours, packs and the button."
            : "The Conscious Bar's live page before the redesign."
          : `${b.name} — live product page on a client store.`}
      </p>
    </div>
  );
}
