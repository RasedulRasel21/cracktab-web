import AsciiField from "./AsciiField";
import HeroVideo from "./HeroVideo";

export default function Hero() {
  return (
    <section className="relative">
      {/* ---- Top block: title + subtitle over the cursor ASCII field ---- */}
      <div className="relative isolate overflow-hidden">
        {/* Animated, cursor-reactive background — covers the whole section */}
        <AsciiField />

        {/* Light fade behind the text only, so the field stays visible right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.25)_40%,transparent_70%)]"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Shopify Plus Partner
          </span>

          {/* Headline */}
          <h1 className="mt-7 max-w-4xl font-display text-[clamp(2.75rem,7.5vw,6rem)] font-bold leading-[1.08] tracking-tight text-white">
            Shopify Stores Built To <span className="text-accent">Perform.</span>{" "}
            Built To Last.
          </h1>

          {/* Sub copy */}
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            From launch to scale, Cracktab designs and develops Shopify stores
            that look premium, move fast, and turn browsers into buyers — built
            for brands ready to grow beyond their current platform.
          </p>
        </div>
      </div>

      {/* ---- Large showreel video ---- */}
      <div className="relative z-10 -mt-2 pb-16 sm:pb-24">
        <HeroVideo />
      </div>
    </section>
  );
}
