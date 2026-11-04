"use client";

import { useEffect, useState } from "react";
import { method } from "./content";
import { SectionHead } from "./ui";

function Panel({ k }: { k: string }) {
  if (k === "measure")
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Funnel · mobile · paid social</p>
        <div className="mt-5 space-y-3">
          {[
            ["Product page", 100],
            ["Add to cart", 38],
            ["Checkout", 14],
            ["Purchase", 6],
          ].map(([l, v], i) => (
            <div key={l as string}>
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{l}</span>
                {i === 1 && <span className="font-semibold text-[#c2410c]">Biggest drop-off</span>}
              </div>
              <div className="mt-1.5 h-3 rounded-full bg-[var(--cream-2)]">
                <div
                  className={`h-full rounded-full ${i === 1 ? "bg-[#f97316]" : "bg-foreground/80"}`}
                  style={{ width: `${v}%`, transition: "width .8s ease" }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
          {["GA4", "Heatmaps", "Session replays"].map((t) => (
            <span key={t} className="rounded-full border border-line bg-background py-1.5 text-muted">
              {t}
            </span>
          ))}
        </div>
      </div>
    );
  if (k === "rank")
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Test backlog</p>
        <ul className="mt-5 divide-y divide-[var(--line)] rounded-2xl border border-line bg-background">
          {[
            ["Show price + reviews above the fold", "High", "Low", 1],
            ["Sticky add-to-cart on mobile", "High", "Low", 2],
            ["Free-shipping progress bar in cart", "Med", "Low", 3],
            ["Bundle offer on product page", "Med", "Med", 4],
          ].map(([t, impact, effort, n]) => (
            <li key={t as string} className="flex items-center gap-3 px-4 py-3 text-sm">
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${n === 1 ? "bg-accent text-accent-ink" : "bg-[var(--cream-2)] text-muted"}`}>
                {n}
              </span>
              <span className="flex-1 text-foreground">{t}</span>
              <span className="hidden text-xs text-muted sm:inline">Impact {impact} · Effort {effort}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  if (k === "test")
    return (
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">A/B test · product page</p>
          <span className="rounded-full bg-[var(--cream-2)] px-3 py-1 text-xs text-muted">Day 12 of 21</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            ["A · Control", "50% of traffic", false],
            ["B · Variant", "50% of traffic", true],
          ].map(([t, s, win]) => (
            <div key={t as string} className={`rounded-2xl border p-4 ${win ? "border-foreground bg-background" : "border-line bg-background"}`}>
              <div className="h-20 rounded-lg bg-[var(--cream-2)] p-2">
                <div className="h-full w-1/2 rounded bg-white/70" />
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">{t}</p>
              <p className="text-xs text-muted">{s}</p>
              {win && <p className="mt-2 inline-block rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-ink">Leading</p>}
            </div>
          ))}
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--cream-2)]">
          <div className="h-full w-[57%] rounded-full bg-foreground" />
        </div>
      </div>
    );
  if (k === "ship")
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Shipped to your theme</p>
        <pre className="mt-5 overflow-hidden rounded-2xl bg-[#141413] p-5 font-mono text-[12px] leading-relaxed text-white/80">
{`sections/main-product.liquid
`}<span className="text-[#ff7b72]">{`- {% render 'price' %}`}</span>{`
`}<span className="text-accent">{`+ {% render 'rating-summary' %}
+ {% render 'price', show_badge: true %}
+ {% render 'sticky-atc' %}`}</span>
        </pre>
        <ul className="mt-5 space-y-2 text-sm text-foreground">
          {["Winning variant becomes permanent code", "Test scripts removed — no app lag", "You own every line"].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-ink">✓</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    );
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Monthly report</p>
      <div className="mt-5 rounded-2xl border border-line bg-background p-5">
        <p className="font-display text-lg font-semibold text-foreground">What happened this month</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ["Tests run", "3"],
            ["Winners", "1"],
            ["Next up", "2"],
          ].map(([l, v]) => (
            <div key={l} className="rounded-xl bg-[var(--cream-2)] py-3">
              <p className="font-display text-2xl font-bold text-foreground">{v}</p>
              <p className="text-[11px] text-muted">{l}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          What won, what it was worth in revenue per visitor, and the next three tests — on one page.
        </p>
      </div>
    </div>
  );
}

export default function MethodTabs() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % method.steps.length), 5000);
    return () => window.clearInterval(id);
  }, [paused]);

  const step = method.steps[active];

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
        <SectionHead eyebrow={method.eyebrow} title={method.title} body={method.body} />
        <div
          className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <ol className="flex flex-col gap-2" role="tablist" aria-label="Method steps">
            {method.steps.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.key}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => {
                      setActive(i);
                      setPaused(true);
                    }}
                    className={`relative w-full overflow-hidden rounded-2xl border px-5 py-4 text-left transition-colors ${
                      on ? "border-foreground bg-surface" : "border-line hover:bg-surface/60"
                    }`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className={`font-display text-sm font-bold ${on ? "text-[var(--olive)]" : "text-muted"}`}>{s.no}</span>
                      <span className="flex-1">
                        <span className="font-display text-lg font-semibold text-foreground sm:text-xl">{s.title}</span>
                        <span className="ml-2 text-sm text-muted">— {s.lead}</span>
                      </span>
                    </div>
                    <div className={`grid transition-all duration-300 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <p className="overflow-hidden pl-9 text-sm leading-relaxed text-muted">
                        <span className="block pt-2">{s.body}</span>
                      </p>
                    </div>
                    {on && !paused && (
                      <span aria-hidden="true" className="method-progress absolute bottom-0 left-0 h-0.5 bg-foreground" key={active} />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
            <div key={step.key} className="animate-[fade-in_.4s_ease]">
              <Panel k={step.key} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
