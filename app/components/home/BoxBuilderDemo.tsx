"use client";

import { useMemo, useState } from "react";
import { builder } from "./content";
import { SectionHead } from "./ui";

type Bar = { id: string; name: string; note: string; price: number; tag?: string };

/* Real flavours, photos and prices from The Conscious Bar. */
const BARS: Bar[] = [
  { id: "smooth-dark-chocolate", name: "Smooth Dark Chocolate", note: "70% dark, cacao + dates", price: 10, tag: "Bestseller" },
  { id: "orange-blossom", name: "Orange Blossom", note: "Bright citrus notes", price: 10 },
  { id: "almond-sea-salt", name: "Almond Sea Salt", note: "Roasted almonds, flaky salt", price: 10 },
  { id: "roasted-hazelnut", name: "Roasted Hazelnut", note: "Slow-roasted hazelnuts", price: 10 },
  { id: "toasted-coconut-flakes", name: "Toasted Coconut Flakes", note: "Crunchy toasted coconut", price: 10 },
  { id: "candied-pistachio-limited-edition", name: "Candied Pistachio", note: "Limited edition", price: 11, tag: "Limited" },
];

const MIN = 4;
const FREE_SHIP = 70;
const SUB_OFF = 0.3;

function BarArt({ bar }: { bar: Bar }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/home/clients/tcb-${bar.id}.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
  );
}

export default function BoxBuilderDemo() {
  const [qty, setQty] = useState<Record<string, number>>({ "orange-blossom": 1, "roasted-hazelnut": 1 });
  const [plan, setPlan] = useState<"sub" | "once">("sub");

  const items = useMemo(() => BARS.filter((b) => (qty[b.id] ?? 0) > 0), [qty]);
  const count = items.reduce((n, b) => n + qty[b.id], 0);
  const full = items.reduce((n, b) => n + qty[b.id] * b.price, 0);
  const total = plan === "sub" ? full * (1 - SUB_OFF) : full;
  const toShip = Math.max(0, FREE_SHIP - full);
  const need = Math.max(0, MIN - count);

  const set = (id: string, d: number) => setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(12, (q[id] ?? 0) + d)) }));
  const fill = () =>
    setQty((q) => {
      const next = { ...q };
      let c = Object.values(next).reduce((a, b) => a + b, 0);
      const avail = BARS;
      let i = 0;
      while (c < 6) {
        const b = avail[i % avail.length];
        next[b.id] = (next[b.id] ?? 0) + 1;
        c++;
        i++;
      }
      return next;
    });

  return (
    <section className="ui-demo py-20 sm:py-28">
      <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
        <SectionHead eyebrow={builder.eyebrow} title={builder.title} body={builder.body} />

        <div className="mt-12 rounded-[2rem] border border-line bg-[#fdf8ee] p-4 sm:p-8">
          <div className="text-center">
            <p className="text-sm text-[#55534e]">
              <span className="tracking-[1px] text-[#c98a1b]">★★★★★</span> 4.81 from 6,830 reviews · The Conscious Bar
            </p>
            <p className="mt-1 font-serif text-3xl text-[#2b1d14] sm:text-4xl">Build your box</p>
            <p className="mt-1 text-base text-[#55534e]">Mix any {MIN}+ bars. Subscribe and save {SUB_OFF * 100}% on your first box.</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem]">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {BARS.map((b) => {
                const n = qty[b.id] ?? 0;
                return (
                  <li
                    key={b.id}
                    className={`flex flex-col overflow-hidden rounded-2xl border bg-white transition-colors ${n > 0 ? "border-[#2b1d14]" : "border-[#e8e0d0]"}`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#efe2cc]">
                      <BarArt bar={b} />
                      {b.tag && (
                        <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#2b1d14]">{b.tag}</span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-3">
                      <p className="text-sm font-semibold text-[#2b1d14]">{b.name}</p>
                      <p className="text-sm text-[#7a7065]">{b.note}</p>
                      <p className="mt-2 text-center text-sm font-semibold text-[#2b1d14]">${b.price.toFixed(2)}</p>
                      <div className="mt-2">
                        {n === 0 ? (
                          <button
                            type="button"
                            onClick={() => set(b.id, 1)}
                            className="block w-full rounded-full bg-[#2b1d14] py-2 text-xs font-bold uppercase tracking-wide text-white transition-transform active:scale-95"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center justify-between rounded-full border border-[#2b1d14] text-[#2b1d14]">
                            <button type="button" aria-label={`Remove one ${b.name}`} onClick={() => set(b.id, -1)} className="h-8 w-9 text-lg">
                              −
                            </button>
                            <span className="text-sm font-semibold">{n}</span>
                            <button type="button" aria-label={`Add one ${b.name}`} onClick={() => set(b.id, 1)} className="h-8 w-9 text-lg">
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="self-start rounded-2xl border border-[#e8e0d0] bg-white p-5 lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a7065]">Your box · {count} bars</p>
              <p className="mt-3 text-sm text-[#2b1d14]">
                {toShip > 0 ? (
                  <>
                    You&apos;re <strong>${toShip.toFixed(2)}</strong> away from free shipping
                  </>
                ) : (
                  <strong>Free shipping unlocked</strong>
                )}
              </p>
              <div className="mt-2 h-2 rounded-full bg-[#efe7d8]">
                <div
                  className="h-full rounded-full bg-[#e2571f] transition-[width] duration-500"
                  style={{ width: `${Math.min(100, (full / FREE_SHIP) * 100)}%` }}
                />
              </div>

              <ul className="mt-4 max-h-44 space-y-2 overflow-auto">
                {items.length === 0 && <li className="text-sm text-[#7a7065]">Your box is empty.</li>}
                {items.map((b) => (
                  <li key={b.id} className="flex items-center gap-3 text-sm text-[#2b1d14]">
                    <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-[#efe2cc]">
                      <BarArt bar={b} />
                    </span>
                    <span className="flex-1">{b.name}</span>
                    <span className="text-[#7a7065]">× {qty[b.id]}</span>
                    <button type="button" aria-label={`Remove ${b.name}`} onClick={() => setQty((q) => ({ ...q, [b.id]: 0 }))} className="text-[#7a7065] hover:text-[#2b1d14]">
                      ×
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => setPlan("sub")}
                  className={`w-full rounded-xl border p-3 text-left transition-colors ${plan === "sub" ? "border-[#2b1d14] bg-[#fbf6ec]" : "border-[#e8e0d0]"}`}
                >
                  <span className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold text-[#2b1d14]">
                      <span className={`h-4 w-4 rounded-full border-2 ${plan === "sub" ? "border-[5px] border-[#2b1d14]" : "border-[#bfb4a3]"}`} />
                      Subscribe &amp; save {SUB_OFF * 100}%
                    </span>
                    <span className="text-sm text-[#2b1d14]">
                      {full > 0 && <s className="mr-1 text-xs text-[#a39587]">${full.toFixed(2)}</s>}${(full * (1 - SUB_OFF)).toFixed(2)}
                    </span>
                  </span>
                  <span className="mt-1 block pl-6 text-xs text-[#7a7065]">Skip or cancel any time</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlan("once")}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors ${plan === "once" ? "border-[#2b1d14] bg-[#fbf6ec]" : "border-[#e8e0d0]"}`}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-[#2b1d14]">
                    <span className={`h-4 w-4 rounded-full border-2 ${plan === "once" ? "border-[5px] border-[#2b1d14]" : "border-[#bfb4a3]"}`} />
                    One-time purchase
                  </span>
                  <span className="text-sm text-[#2b1d14]">${full.toFixed(2)}</span>
                </button>
              </div>

              <button
                type="button"
                disabled={need > 0}
                className="mt-4 w-full rounded-full bg-[#2b1d14] py-3 text-sm font-bold text-white transition-colors disabled:bg-[#a39587]"
              >
                {need > 0 ? `Add ${need} more bar${need > 1 ? "s" : ""}` : `Add box to cart · $${total.toFixed(2)}`}
              </button>
              <button
                type="button"
                onClick={fill}
                className="mt-2 w-full rounded-full border border-[#2b1d14] py-2.5 text-sm font-semibold text-[#2b1d14]"
              >
                Fill with bestsellers
              </button>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-muted">A working copy of the build-your-own-box flow we designed for The Conscious Bar. Prices from their store.</p>
      </div>
    </section>
  );
}
