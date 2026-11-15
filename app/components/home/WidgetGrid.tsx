"use client";

import { useState, type ReactNode } from "react";
import { method } from "./content";
import { SectionHead } from "./ui";

/*
 * Six blocks we build into client themes, as small working demos.
 * Products, prices and rules come from The Conscious Bar redesign.
 */

const img = (id: string) => `/home/clients/tcb-${id}.jpg`;
const money = (n: number) => `$${n.toFixed(2)}`;

function Card({
  where,
  title,
  body,
  hint,
  children,
}: {
  where: string;
  title: string;
  body: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <li className="flex flex-col overflow-hidden rounded-3xl border border-line bg-surface">
      <div className="flex min-h-[19rem] items-center justify-center bg-[#f6efe4] p-5 sm:p-6">
        <div className="w-full max-w-[20rem] text-[#2a1810]">{children}</div>
      </div>
      <div className="flex flex-1 flex-col border-t border-line p-6">
        <span className="self-start rounded-full bg-[var(--cream-2)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          {where}
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-base leading-relaxed text-muted">{body}</p>
        <p className="mt-auto pt-4 text-sm font-semibold text-[var(--olive)]">↳ {hint}</p>
      </div>
    </li>
  );
}

/* 1 · Pack picker */
function PackPicker() {
  const packs = [
    { n: 1, label: "1 bar", price: 7.5, note: "$35 min order" },
    { n: 6, label: "6 bars", price: 45, note: "Mix flavours", tag: "Popular" },
    { n: 12, label: "Case of 12", price: 78, note: "Free shipping", tag: "Best value" },
  ];
  const [i, setI] = useState(1);
  const p = packs[i];
  const clears = p.price >= 35;
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-[#6b5a4e]">Choose your pack</p>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {packs.map((pk, k) => (
          <button
            key={pk.n}
            type="button"
            onClick={() => setI(k)}
            className={`relative rounded-xl border px-2 pb-2 pt-3 text-left transition-colors ${
              k === i ? "border-[#4a1d0f] bg-[#f4e9da]" : "border-[#e2d6c6] hover:border-[#b9a68f]"
            }`}
          >
            {pk.tag && (
              <span className="absolute -top-2 right-1.5 rounded bg-[#4a1d0f] px-1.5 text-[9px] font-bold uppercase text-white">{pk.tag}</span>
            )}
            <span className="block text-xs font-semibold">{pk.label}</span>
            <span className="block font-serif text-sm">{money(pk.price)}</span>
            <span className="block text-[10px] text-[#6b5a4e]">{pk.note}</span>
          </button>
        ))}
      </div>
      <p className={`mt-3 text-xs font-semibold ${clears ? "text-[#2f6b1f]" : "text-[#c8372d]"}`}>
        {clears ? "✓ Clears the $35 minimum order" : "✕ Below the $35 minimum — can't check out"}
      </p>
      <button type="button" className="mt-2 w-full rounded-xl bg-[#4a1d0f] py-2.5 text-sm font-semibold text-white">
        Add {p.label.toLowerCase()} to bag · {money(p.price)}
      </button>
    </div>
  );
}

/* 2 · Sticky add to bag */
function StickyAtc() {
  const [added, setAdded] = useState(false);
  return (
    <div className="relative mx-auto h-[17rem] w-[12.5rem] overflow-hidden rounded-[1.6rem] border-[5px] border-[#1a1a1a] bg-[#fbf7f0] shadow-lg">
      <div className="h-full overflow-y-auto pb-14 [scrollbar-width:none]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img("smooth-dark-chocolate")} alt="" className="aspect-square w-full object-cover" />
        <div className="space-y-2 p-3">
          <p className="font-serif text-sm">Smooth Dark Chocolate</p>
          <p className="text-[10px] text-[#6b5a4e]">★★★★★ 4.81 · 6,830 reviews</p>
          {["What's inside", "Dates vs sugar", "Reviews", "FAQ", "Best sellers"].map((s) => (
            <div key={s} className="rounded-lg bg-[#efe6d8] p-2">
              <p className="text-[10px] font-semibold">{s}</p>
              <div className="mt-1 h-1.5 w-4/5 rounded bg-[#e0d2bf]" />
              <div className="mt-1 h-1.5 w-3/5 rounded bg-[#e0d2bf]" />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 border-t border-[#eadfce] bg-white px-2 py-1.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img("smooth-dark-chocolate")} alt="" className="h-7 w-7 rounded object-cover" />
        <span className="flex-1 text-[9px] leading-tight">
          <b>6 bars</b> · $45.00
          <br />
          <span className="text-[#6b5a4e]">$25 to free shipping</span>
        </span>
        <button type="button" onClick={() => setAdded((a) => !a)} className="rounded-md bg-[#4a1d0f] px-2 py-1.5 text-[9px] font-semibold text-white">
          {added ? "Added ✓" : "Add to bag"}
        </button>
      </div>
      <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-semibold text-white">
        Scroll me ↓
      </span>
    </div>
  );
}

/* 3 · Milestone bar */
function MilestoneBar() {
  const [bars, setBars] = useState(1);
  const total = bars * 7.5;
  const pct = Math.min(100, (total / 70) * 100);
  const toCheckout = Math.max(0, Math.ceil((35 - total) / 7.5));
  const toShip = Math.max(0, 70 - total);
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs leading-snug">
        {toCheckout > 0 ? (
          <>
            Add <b>{money(35 - total)}</b> to check out. <b>{money(toShip)}</b> more ships free.
          </>
        ) : toShip > 0 ? (
          <>
            Checkout unlocked. <b>{money(toShip)}</b> more ships free.
          </>
        ) : (
          <b className="text-[#2f6b1f]">Free shipping unlocked 🎉</b>
        )}
      </p>
      <div className="relative mt-3 h-2 rounded-full bg-[#efe6d8]">
        <div className="h-full rounded-full bg-[#2f6b1f] transition-[width] duration-500" style={{ width: `${pct}%` }} />
        <span className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white ${total >= 35 ? "bg-[#2f6b1f]" : "bg-[#4a1d0f]"}`} style={{ left: "calc(50% - 7px)" }} />
        <span className={`absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white ${total >= 70 ? "bg-[#2f6b1f]" : "bg-[#4a1d0f]"}`} />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-[#6b5a4e]">
        <span>{money(total)} in bag</span>
        <span>$35 checkout</span>
        <span>$70 free shipping</span>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#eadfce] p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img("smooth-dark-chocolate")} alt="" className="h-9 w-9 rounded object-cover" />
        <span className="flex-1 text-xs font-semibold">Smooth Dark</span>
        <div className="flex items-center rounded-full border border-[#4a1d0f]">
          <button type="button" aria-label="Remove a bar" onClick={() => setBars((b) => Math.max(1, b - 1))} className="h-7 w-7">−</button>
          <span className="w-5 text-center text-xs font-semibold">{bars}</span>
          <button type="button" aria-label="Add a bar" onClick={() => setBars((b) => Math.min(12, b + 1))} className="h-7 w-7">+</button>
        </div>
      </div>
      <button type="button" className={`mt-3 w-full rounded-xl py-2.5 text-sm font-semibold text-white ${toCheckout > 0 ? "bg-[#4a1d0f]" : "bg-[#2f6b1f]"}`}>
        {toCheckout > 0 ? `Add ${toCheckout} more bar${toCheckout > 1 ? "s" : ""} to check out` : "Check out"}
      </button>
    </div>
  );
}

/* 4 · One-tap cart adds */
function OneTapAdds() {
  const offers = [
    { id: "orange-blossom", name: "Orange Blossom" },
    { id: "almond-sea-salt", name: "Almond Sea Salt" },
    { id: "roasted-hazelnut", name: "Roasted Hazelnut" },
  ];
  const [inBag, setInBag] = useState<string[]>([]);
  const subtotal = 7.5 * (1 + inBag.length);
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#6b5a4e]">Or add bars in one tap</p>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {offers.map((o) => {
          const on = inBag.includes(o.id);
          return (
            <div key={o.id} className={`rounded-xl border p-1.5 text-center transition-colors ${on ? "border-[#2f6b1f] bg-[#eef6ea]" : "border-[#e2d6c6]"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(o.id)} alt="" className="aspect-square w-full rounded-lg object-cover" />
              <p className="mt-1 text-[10px] font-semibold leading-tight">{o.name}</p>
              <button
                type="button"
                onClick={() => setInBag((b) => (on ? b.filter((x) => x !== o.id) : [...b, o.id]))}
                className={`mt-1 w-full rounded-full border py-1 text-[10px] font-semibold ${on ? "border-[#2f6b1f] bg-[#2f6b1f] text-white" : "border-[#4a1d0f]"}`}
              >
                {on ? "Added ✓" : "+ $7.50"}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-baseline justify-between border-t border-[#eadfce] pt-2.5 text-sm">
        <span className="text-[#6b5a4e]">Subtotal · {1 + inBag.length} bars</span>
        <span className="font-serif text-lg">{money(subtotal)}</span>
      </div>
    </div>
  );
}

/* 5 · Subscribe toggle */
function SubscribeToggle() {
  const [on, setOn] = useState(false);
  const price = 45;
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img("toasted-coconut-flakes")} alt="" className="h-11 w-11 rounded-lg object-cover" />
        <div className="flex-1">
          <p className="text-sm font-semibold">6 bars · mixed</p>
          <p className="text-xs text-[#6b5a4e]">{on ? "Every 4 weeks" : "One-time purchase"}</p>
        </div>
        <p className="text-right font-serif">
          {on && <s className="mr-1 text-xs text-[#9a8b7e]">{money(price)}</s>}
          {money(on ? price * 0.7 : price)}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn((x) => !x)}
        className={`mt-3 flex w-full items-center gap-3 rounded-xl border border-dashed p-3 text-left transition-colors ${on ? "border-[#2f6b1f] bg-[#eef6ea]" : "border-[#d8c9b5]"}`}
      >
        <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-[#2f6b1f]" : "bg-[#d6cbbb]"}`}>
          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
        </span>
        <span className="text-xs leading-snug">
          <b>Subscribe and save:</b> 30% off your first order, $30 gift every 3rd order
        </span>
      </button>
      <ul className={`mt-3 grid grid-cols-2 gap-1 text-[11px] transition-opacity ${on ? "opacity-100" : "opacity-40"}`}>
        {["Skip or cancel any time", "Early access to new flavours", "Free gift every 3rd box", "Change flavours monthly"].map((t) => (
          <li key={t}>✓ {t}</li>
        ))}
      </ul>
    </div>
  );
}

/* 6 · Auto-applied promo */
function AutoPromo() {
  const [after, setAfter] = useState(true);
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex w-fit rounded-full border border-[#e2d6c6] p-0.5 text-[11px] font-semibold">
        {(["Before", "After"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setAfter(t === "After")}
            className={`rounded-full px-3 py-1 ${after === (t === "After") ? "bg-[#4a1d0f] text-white" : "text-[#6b5a4e]"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <p className="font-serif text-base">Smooth Dark Chocolate</p>
      {after ? (
        <div className="animate-[fade-in_.3s_ease]">
          <div className="mt-2 flex flex-wrap gap-1">
            {["No added sugar", "2 ingredients", "USDA Organic", "Vegan"].map((c) => (
              <span key={c} className="rounded-full border border-[#dccdbb] px-2 py-0.5 text-[10px] font-medium">{c}</span>
            ))}
          </div>
          <p className="mt-2.5 flex items-baseline gap-2">
            <span className="font-serif text-2xl">$7.50</span>
            <s className="text-sm text-[#9a8b7e]">$10.00</s>
            <span className="rounded-full bg-[#dff0d6] px-2 py-0.5 text-[10px] font-bold text-[#2f6b1f]">SAVE 25%</span>
          </p>
          <p className="mt-1 text-[11px] text-[#6b5a4e]">Applied automatically at checkout, no code needed.</p>
        </div>
      ) : (
        <div className="animate-[fade-in_.3s_ease]">
          <p className="mt-2 font-serif text-xl">$10.00</p>
          <div className="mt-2 rounded-xl bg-[#efe9e1] p-3">
            <p className="text-xs font-semibold">Use code EARLYACCESS25 at checkout for 25% off</p>
            <p className="mt-1.5 text-xs">
              $7.50 with code <span className="rounded-full bg-[#3a1a10] px-2 py-0.5 text-[9px] font-bold text-white">EARLYACCESS25</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WidgetGrid() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
        <SectionHead eyebrow={method.eyebrow} title={method.title} body={method.body} />
        <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Card where="Product page" title="Pack picker" body="Six bars by default and a case of 12. Every pack clears the $35 minimum, so nobody hits a wall in the cart." hint="Tap a pack">
            <PackPicker />
          </Card>
          <Card where="Product page · mobile" title="Sticky add to bag" body="The button, pack, price and distance to free shipping follow the shopper down the page." hint="Scroll inside the phone">
            <StickyAtc />
          </Card>
          <Card where="Product page" title="One auto-applied promo" body="The real price first, savings badge and benefit chips — instead of a code shoppers have to copy." hint="Switch before and after">
            <AutoPromo />
          </Card>
          <Card where="Cart drawer" title="Milestone bar" body="One bar for both goals: $35 to check out and $70 to ship free. The button says exactly what to do next." hint="Add bars with +">
            <MilestoneBar />
          </Card>
          <Card where="Cart drawer" title="One-tap flavour adds" body="Matching flavours added straight from the cart, so shoppers fill the bag without going back." hint="Add a flavour">
            <OneTapAdds />
          </Card>
          <Card where="Cart drawer · cart page" title="Subscribe toggle" body="Subscription offered where the decision happens, with the real perks instead of a block of text." hint="Flip the switch">
            <SubscribeToggle />
          </Card>
        </ul>
      </div>
    </section>
  );
}
