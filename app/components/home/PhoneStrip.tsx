import { PhoneFrame } from "./ui";
import { clientNames, phoneScreens, whoFor } from "./content";
import MobilePhoneCarousel from "./MobilePhoneCarousel";

/**
 * Row of phones showing real mobile storefronts. The strip drifts sideways;
 * hovering a phone pauses the drift and scrolls that store's page.
 */
export default function PhoneStrip() {
  const row = [...phoneScreens, ...phoneScreens];
  return (
    <section aria-label="Stores we've built" className="pb-20 sm:pb-24">
      {/* Phones: swipeable auto-advancing carousel; the centred store scrolls. */}
      <MobilePhoneCarousel />
      {/* Tablet and up: drifting strip, hover a phone to scroll its page. */}
      <div className="edge-fade group/strip hidden overflow-hidden py-4 md:block">
        <ul className="animate-marquee flex w-max gap-5 [animation-duration:90s] group-hover/strip:[animation-play-state:paused] sm:gap-7">
          {row.map((s, i) => (
            <li key={`${s.src}-${i}`} className="w-[11rem] shrink-0 sm:w-[13rem]" aria-hidden={i >= phoneScreens.length}>
              <PhoneFrame className="group/phone aspect-[9/19]" notch={false}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={i < phoneScreens.length ? `${s.store} ${s.page.toLowerCase()} on mobile` : ""}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-x-0 top-0 w-full transition-transform duration-[6s] ease-in-out group-hover/phone:-translate-y-[62%]"
                />
                <span className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#141413]/85 px-2.5 py-1 text-[10px] font-semibold text-white">
                  {s.page}
                </span>
              </PhoneFrame>
              <p className="mt-3 text-center text-sm font-medium text-muted">{s.store}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-12 w-full max-w-360 px-5 sm:px-8">
        <p className="mx-auto max-w-3xl text-center font-display text-xl font-medium leading-snug text-foreground sm:text-2xl">
          {whoFor}
        </p>
        <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-line bg-surface px-5 py-5">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted">
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
