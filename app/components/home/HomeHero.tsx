import Image from "next/image";
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
      <div className="relative mx-auto grid w-full max-w-360 grid-cols-1 items-center gap-14 px-5 pb-16 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:pb-24">
        <div>
          <p className="max-w-xl text-[0.72rem] font-semibold uppercase leading-relaxed tracking-[0.2em] text-muted sm:text-[0.8rem]">
            <span className="mr-2 inline-block h-1.5 w-1.5 -translate-y-0.5 rounded-full bg-[var(--olive)] align-middle" />
            {hero.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-[clamp(3rem,8.6vw,7.4rem)] font-bold uppercase leading-[0.9] tracking-[-0.02em] text-foreground">
            Shopify <span className="relative whitespace-nowrap">
              <span className="relative z-10">CRO</span>
              <span aria-hidden="true" className="absolute inset-x-[-0.06em] bottom-[0.08em] z-0 h-[0.32em] rounded-sm bg-accent" />
            </span>
            <br />
            Agency
          </h1>
          <p className="mt-8 max-w-2xl text-lg font-semibold leading-snug text-foreground sm:text-xl">{hero.lead}</p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{hero.support}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <BookCallButton className="inline-flex h-13 items-center justify-center rounded-full bg-foreground px-8 font-display text-sm font-semibold uppercase tracking-wide text-background transition-colors hover:bg-black">
              {hero.primaryCta}
            </BookCallButton>
            <a
              href="#proof"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-line bg-surface px-7 font-display text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-foreground"
            >
              {hero.secondaryCta}
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Image src="/shopify-badge.svg" alt="Shopify Partner" width={262} height={116} priority className="h-11 w-auto invert" />
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-muted">
              {hero.credentials.map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-[var(--olive)]">✓</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <HeroPhone />
      </div>
    </section>
  );
}
