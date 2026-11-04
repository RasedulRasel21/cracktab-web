import { PhoneFrame } from "./ui";
import { clientNames, phoneScreens, whoFor } from "./content";

/**
 * Row of phones showing real mobile storefronts. The strip drifts sideways;
 * hovering a phone pauses the drift and scrolls that store's page.
 */
export default function PhoneStrip() {
  const row = [...phoneScreens, ...phoneScreens];
  return (
    <section aria-label="Stores we've built" className="pb-20 sm:pb-24">
      <div className="edge-fade group/strip overflow-hidden py-4">
        <ul className="animate-marquee flex w-max gap-5 [animation-duration:60s] group-hover/strip:[animation-play-state:paused] sm:gap-7">
          {row.map((s, i) => (
            <li key={`${s.src}-${i}`} className="w-[10.5rem] shrink-0 sm:w-[12.5rem]" aria-hidden={i >= phoneScreens.length}>
              <PhoneFrame className="group/phone aspect-[9/19]" notch>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={i < phoneScreens.length ? `${s.label} on mobile` : ""}
                  loading="lazy"
                  className="absolute inset-x-0 top-0 w-full transition-transform duration-[6s] ease-in-out group-hover/phone:-translate-y-[70%]"
                />
              </PhoneFrame>
              <p className="mt-3 text-center text-xs font-medium text-muted">{s.label}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-12 w-full max-w-360 px-5 sm:px-8">
        <p className="mx-auto max-w-3xl text-center font-display text-xl font-medium leading-snug text-foreground sm:text-2xl">
          {whoFor}
        </p>
        <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-line bg-surface px-5 py-5">
          <p className="text-center text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">
            Brands we&apos;ve built and optimised for
          </p>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {clientNames.map((n) => (
              <li key={n} className="font-display text-lg font-bold tracking-tight text-foreground/70 sm:text-xl">
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
