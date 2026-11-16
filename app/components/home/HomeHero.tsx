import BookCallButton from "../BookCallButton";
import HeroPhone from "./HeroPhone";
import { hero } from "./content";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28">
      {/* soft warm glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(48rem_28rem_at_85%_20%,rgba(180,240,58,0.18),transparent_65%),radial-gradient(40rem_26rem_at_0%_0%,rgba(255,255,255,0.7),transparent_70%)]"
      />
      <div className="relative mx-auto grid w-full max-w-360 grid-cols-1 items-center gap-14 px-5 pb-16 sm:px-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10 lg:pb-24">
        {/* Laptop: the buttons sit right under the headline so they show on the first screen; phones keep text first. */}
        <div className="flex flex-col items-start">
          {/* H1 for search engines, styled as the line above the headline */}
          <h1 className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-2 font-display text-sm font-bold uppercase tracking-[0.18em] text-foreground sm:text-base">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent ring-1 ring-[#141413]/15" />
            {hero.h1}
          </h1>
          <p className="mt-6 font-display text-[clamp(2.6rem,6.4vw,5.6rem)] lg:text-[clamp(3.4rem,5.2vw,5.2rem)] font-bold leading-[0.98] tracking-[-0.025em] text-foreground">
            Helping DTC brands turn more visitors into{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">revenue</span>
              <span aria-hidden="true" className="absolute inset-x-[-0.05em] bottom-[0.06em] z-0 h-[0.3em] rounded-sm bg-accent" />
            </span>
          </p>
          <p className="mt-8 max-w-2xl text-lg font-semibold leading-snug text-foreground sm:text-xl lg:order-1">{hero.lead}</p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg lg:order-1">{hero.support}</p>

          <div className="mt-9 grid w-full grid-cols-2 gap-2.5 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-3 lg:mt-8">
            <BookCallButton className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-3 text-center font-display text-[0.8rem] font-semibold uppercase leading-tight tracking-wide text-background transition-colors hover:bg-black sm:h-13 sm:px-8 sm:text-sm">
              {hero.primaryCta}
            </BookCallButton>
            <a
              href="#proof"
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-line bg-surface px-3 text-center font-display text-[0.8rem] font-semibold uppercase leading-tight tracking-wide text-foreground transition-colors hover:border-foreground sm:h-13 sm:gap-2 sm:px-7 sm:text-sm"
            >
              {hero.secondaryCta}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
          <a href="/contact?type=video-audit" className="mt-4 text-[0.95rem] font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-4 hover:decoration-foreground">
            Or get a free 3-minute video audit of your store →
          </a>

          {/* Credentials: one scrolling row on phones, a wrapped list above. */}
          <div className="edge-fade mt-8 w-full overflow-hidden sm:hidden lg:order-1" aria-hidden="true">
            <ul className="flex w-max animate-marquee gap-6 pr-6 text-[0.95rem] font-medium text-muted [animation-duration:22s]">
              {[...hero.credentials, ...hero.credentials].map((c, i) => (
                <li key={`${c}-${i}`} className="flex shrink-0 items-center gap-2">
                  <span className="text-[var(--olive)]">✓</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <ul className="mt-9 hidden flex-wrap items-center gap-x-5 gap-y-2 text-base font-medium text-muted sm:flex lg:order-1">
            {hero.credentials.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-[var(--olive)]">✓</span>
                {c}
              </li>
            ))}
          </ul>
          <ul className="sr-only sm:hidden">
            {hero.credentials.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        <HeroPhone />
      </div>
    </section>
  );
}
