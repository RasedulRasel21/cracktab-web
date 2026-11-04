"use client";

import { useId, useState } from "react";
import BookCallButton from "../BookCallButton";
import { problem } from "./content";

const LIFTS = [5, 10, 20, 30];

const money = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : `$${Math.round(n).toLocaleString("en-US")}`;

function Range({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm text-white/70">
          {label}
        </label>
        <span className="font-display text-lg font-semibold text-white">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="leak-range mt-3 w-full"
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}

export default function LeakCalculator() {
  const [sessions, setSessions] = useState(50_000);
  const [cr, setCr] = useState(2);
  const [aov, setAov] = useState(70);
  const [lift, setLift] = useState(10);

  const revenue = sessions * (cr / 100) * aov;
  const extraMonth = revenue * (lift / 100);
  const lost = sessions - Math.round(sessions * (cr / 100));

  return (
    <section className="cream-dark-band relative overflow-hidden bg-[#141413] py-20 text-white sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_22rem_at_90%_10%,rgba(180,240,58,0.14),transparent_70%)]"
      />
      <div className="relative mx-auto grid w-full max-w-360 grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:pt-4">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {problem.eyebrow}
          </span>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3.1rem)] font-semibold leading-[1.06] tracking-tight">
            {problem.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{problem.body}</p>
          <p className="mt-8 max-w-xl rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-white/80">
            With your numbers, <strong className="text-white">{lost.toLocaleString("en-US")}</strong> of{" "}
            {sessions.toLocaleString("en-US")} monthly visitors leave without buying.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">What a lift is worth to you</p>
          <div className="mt-6 grid gap-6">
            <Range label="Monthly sessions" value={sessions} display={sessions.toLocaleString("en-US")} min={5_000} max={500_000} step={5_000} onChange={setSessions} />
            <Range label="Conversion rate" value={cr} display={`${cr.toFixed(1)}%`} min={0.5} max={6} step={0.1} onChange={setCr} />
            <Range label="Average order value" value={aov} display={`$${aov}`} min={20} max={300} step={5} onChange={setAov} />
            <div>
              <p className="text-sm text-white/70">Conversion lift from testing</p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {LIFTS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLift(l)}
                    aria-pressed={lift === l}
                    className={`rounded-full border py-2 text-sm font-semibold transition-colors ${
                      lift === l ? "border-accent bg-accent text-accent-ink" : "border-white/15 text-white/80 hover:border-white/40"
                    }`}
                  >
                    +{l}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-accent p-5 text-accent-ink">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">Extra revenue / month</p>
              <p className="mt-2 font-display text-4xl font-bold tracking-tight">{money(extraMonth)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Extra revenue / year</p>
              <p className="mt-2 font-display text-4xl font-bold tracking-tight">{money(extraMonth * 12)}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-xs text-xs leading-relaxed text-white/50">
              Same traffic, same ad spend. An estimate, not a promise — the audit tells you what&apos;s realistic for your store.
            </p>
            <BookCallButton className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 font-display text-sm font-semibold uppercase tracking-wide text-[#141413] transition-colors hover:bg-accent">
              Find my leaks
            </BookCallButton>
          </div>
        </div>
      </div>
    </section>
  );
}
