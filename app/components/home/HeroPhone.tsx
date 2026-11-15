"use client";

import { useEffect, useState } from "react";
import { PhoneFrame } from "./ui";

/**
 * The Conscious Bar product page on a phone: their live page ("Before")
 * against the page Cracktab designed and coded ("Cracktab"). Flavours,
 * pack sizes and the add-to-bag button all work in the Cracktab view.
 */

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
const img = (id: string) => `/home/clients/tcb-${id}.jpg`;

export default function HeroPhone() {
  const [variant, setVariant] = useState<"before" | "after">("after");
  const [flavor, setFlavor] = useState(0);
  const [pack, setPack] = useState(1);
  const [cart, setCart] = useState(0);
  const [added, setAdded] = useState(false);
  const [touched, setTouched] = useState(false);

  // Alternate the two versions until the visitor interacts.
  useEffect(() => {
    if (touched) return;
    const id = window.setInterval(() => setVariant((v) => (v === "before" ? "after" : "before")), 3600);
    return () => window.clearInterval(id);
  }, [touched]);

  useEffect(() => {
    if (!added) return;
    const id = window.setTimeout(() => setAdded(false), 1400);
    return () => window.clearTimeout(id);
  }, [added]);

  const touch = () => setTouched(true);
  const after = variant === "after";
  const f = FLAVORS[flavor];
  const p = PACKS[pack];
  const toShip = Math.max(0, FREE_SHIP - p.price);

  return (
    <div className="relative mx-auto w-full max-w-[22.5rem]">
      {/* Before / Cracktab switch */}
      <div className="mb-5 flex items-center justify-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">The Conscious Bar</span>
        <div role="tablist" aria-label="Page version" className="flex rounded-full border border-line bg-surface p-1">
          {(["before", "after"] as const).map((v) => (
            <button
              key={v}
              role="tab"
              type="button"
              aria-selected={variant === v}
              onClick={() => {
                touch();
                setVariant(v);
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                variant === v ? "bg-foreground text-background" : "text-muted hover:text-foreground"
              }`}
            >
              {v === "before" ? "Before" : "Cracktab"}
            </button>
          ))}
        </div>
      </div>

      <PhoneFrame className="aspect-[9/18.6] w-full">
        <div className="relative flex h-full flex-col bg-[#fbf7f0] text-[#2a1810]">
          {/* promo bar */}
          <div className="bg-[#4a1d0f] px-3 pb-1.5 pt-8 text-center text-[9.5px] font-semibold uppercase tracking-[0.06em] text-white">
            {after ? "25% off core flavours · auto-applied" : (
              <span className="underline">Subscribe &amp; save up to 30%</span>
            )}
          </div>
          {/* header */}
          <div className="flex items-center justify-between px-4 py-2">
            <span className="flex flex-col gap-[3px]" aria-hidden="true">
              <span className="h-[1.5px] w-4 bg-current" />
              <span className="h-[1.5px] w-4 bg-current" />
              <span className="h-[1.5px] w-4 bg-current" />
            </span>
            <span className="font-serif text-[15px] leading-none tracking-tight">
              <span className="text-[8px] align-top">The</span> Conscious <span className="text-[8px]">Bar</span>
            </span>
            <span className="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 7h12l-1 13H7L6 7Z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              <span
                className={`absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#4a1d0f] px-1 text-[9px] font-bold text-white transition-transform ${
                  added ? "scale-125" : "scale-100"
                }`}
              >
                {cart}
              </span>
            </span>
          </div>

          {/* product image */}
          <div className="relative mx-3 aspect-[4/3.2] shrink-0 overflow-hidden rounded-xl bg-[#e8d5bd]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={after ? f.id : "before"}
              src={img(after ? f.id : "smooth-dark-chocolate")}
              alt={after ? `${f.name} bar` : "Smooth Dark Chocolate bar"}
              className="h-full w-full animate-[fade-in_.35s_ease] object-cover"
            />
            {after ? (
              <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-semibold">
                No added sugar · Sweetened with dates
              </span>
            ) : (
              <span className="absolute -right-0 top-1/3 rounded-l-xl bg-[#3a1a10] px-1.5 py-3 text-[9px] font-semibold text-white [writing-mode:vertical-rl]">
                Sweet Deal
              </span>
            )}
          </div>

          {/* details */}
          <div className="flex flex-1 flex-col overflow-hidden px-4 pt-2.5">
            {!after && (
              <span className="self-start rounded bg-[#1d1d1d] px-1.5 py-0.5 text-[9px] font-semibold text-white">Early Access Sale</span>
            )}
            <p className={`font-serif leading-tight ${after ? "text-[16px]" : "mt-1.5 text-[15px]"}`}>
              {after ? f.name : "Smooth Dark Chocolate"}
            </p>
            <p className="mt-0.5 text-[10px] text-[#6b5a4e]">
              <span className="tracking-[1px] text-[#2a1810]">★★★★★</span> 4.81{" "}
              {after ? <span className="underline">6,830 reviews</span> : "(6830)"}
            </p>

            {after ? (
              <>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {["No added sugar", "2 ingredients", "Organic", "Vegan"].map((c) => (
                    <span key={c} className="rounded-full border border-[#dccdbb] bg-white px-1.5 py-0.5 text-[8.5px] font-medium">
                      {c}
                    </span>
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
                    <button
                      key={fl.id}
                      type="button"
                      aria-label={fl.name}
                      onClick={() => {
                        touch();
                        setFlavor(i);
                      }}
                      className={`h-8 w-8 shrink-0 overflow-hidden rounded-md border-2 ${i === flavor ? "border-[#4a1d0f]" : "border-transparent"}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img(fl.id)} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>

                <div className="mt-2 grid grid-cols-3 gap-1">
                  {PACKS.map((pk, i) => (
                    <button
                      key={pk.n}
                      type="button"
                      onClick={() => {
                        touch();
                        setPack(i);
                      }}
                      className={`relative rounded-lg border px-1.5 pb-1 pt-1.5 text-left ${
                        i === pack ? "border-[#4a1d0f] bg-[#f4e9da]" : "border-[#e2d6c6] bg-white"
                      }`}
                    >
                      {pk.tag && (
                        <span className="absolute -top-1.5 right-1 rounded bg-[#4a1d0f] px-1 text-[6.5px] font-bold uppercase text-white">
                          {pk.tag}
                        </span>
                      )}
                      <span className="block text-[9.5px] font-semibold">{pk.label}</span>
                      <span className="block font-serif text-[10px]">${pk.price.toFixed(2)}</span>
                      <span className="block text-[7.5px] text-[#6b5a4e]">{pk.note}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="mt-1.5 font-serif text-[14px]">$10.00</p>
                <div className="mt-2 rounded-lg bg-[#efe9e1] p-2.5">
                  <p className="text-[10.5px] font-semibold leading-snug">Use code EARLYACCESS25 at checkout for 25% off</p>
                  <p className="mt-1 text-[10px]">
                    $7.50 with code <span className="rounded-full bg-[#3a1a10] px-1.5 py-0.5 text-[8px] font-bold text-white">EARLYACCESS25</span>
                  </p>
                  <span className="mt-1.5 inline-block rounded-full bg-[#3a1a10] px-3 py-1 text-[9px] font-semibold text-white">Apply now</span>
                </div>
                <p className="mt-2 text-[9px] text-[#6b5a4e]">Flavor</p>
                <div className="mt-1 grid grid-cols-3 gap-1.5">
                  {FLAVORS.slice(0, 3).map((fl) => (
                    <div key={fl.id} className="overflow-hidden rounded-lg border border-[#e2d6c6] bg-white p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img(fl.id)} alt="" className="aspect-square w-full rounded object-cover" />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* bottom: sticky add to bag vs. no button in view */}
          {after ? (
            <div className="flex items-center gap-2 border-t border-[#eadfce] bg-white px-3 py-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(f.id)} alt="" className="h-8 w-8 rounded object-cover" />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-[9.5px] font-semibold">
                  {p.label} · {f.name.split(" ")[0]}
                </p>
                <p className="text-[8.5px] text-[#6b5a4e]">
                  ${p.price.toFixed(2)} · {toShip > 0 ? `$${toShip.toFixed(0)} to free shipping` : "Free shipping"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  touch();
                  setCart((c) => c + p.n);
                  setAdded(true);
                }}
                className="rounded-lg bg-[#4a1d0f] px-3 py-2 text-[10px] font-semibold text-white active:scale-95"
              >
                {added ? "Added ✓" : "Add to bag"}
              </button>
            </div>
          ) : (
            <div className="bg-[#c8372d] px-3 py-2.5 text-center text-[10px] font-semibold text-white">
              Add to bag is 1.5 screens further down
            </div>
          )}
          <span className="mx-auto my-1.5 h-1 w-24 rounded-full bg-[#2a1810]" aria-hidden="true" />
        </div>
      </PhoneFrame>

      {/* what changed */}
      <ul className="mt-4 grid grid-cols-3 gap-2">
        {[
          ["Real price first", "No code to copy"],
          ["Pack picker", "Clears $35 min"],
          ["Sticky add to bag", "Always in reach"],
        ].map(([t, sub]) => (
          <li
            key={t}
            className={`rounded-xl border px-2.5 py-2 text-center transition-colors ${
              after ? "border-[var(--olive)] bg-surface" : "border-line bg-surface/60"
            }`}
          >
            <span className={`block text-[12px] font-semibold leading-tight ${after ? "text-foreground" : "text-muted"}`}>
              {after ? "✓ " : ""}{t}
            </span>
            <span className="mt-0.5 block text-[11px] leading-tight text-muted">{sub}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-center text-sm text-muted">
        Before: their live page. Cracktab: our CRO redesign. Tap the flavours, packs and button.
      </p>
    </div>
  );
}
