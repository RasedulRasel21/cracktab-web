import Image from "next/image";
import AsciiField from "./AsciiField";

export default function Hero() {
  return (
    <section className="relative">
      {/* ---- Top block: title + subtitle over the cursor ASCII field ---- */}
      <div className="relative isolate flex min-h-dvh flex-col overflow-hidden">
        {/* Animated, cursor-reactive background — covers the whole section */}
        <AsciiField />

        {/* Light fade behind the text only, so the field stays visible right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.25)_40%,transparent_70%)]"
        />

        {/* Bottom fade — dissolves the ASCII field into black so the next
            section blends in seamlessly instead of cutting off abruptly */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-48 bg-[linear-gradient(to_bottom,transparent,#000)]"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-360 flex-1 flex-col justify-between px-5 py-28 sm:px-8">
          {/* Top group: badge button + headline */}
          <div>
            <a
              href="/work"
              className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/3 py-1.5 pl-1.5 pr-4 backdrop-blur-sm transition-colors hover:border-accent/50"
            >
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-ink">
                New
              </span>
              <span className="text-sm">
                <span className="font-semibold text-white">Latest</span>{" "}
                <span className="text-muted">Case Study</span>
              </span>
            </a>

            <h1 className="mt-8 max-w-4xl font-display text-[clamp(2.75rem,7.5vw,6rem)] font-medium leading-[1.08] tracking-tight text-white">
              Shopify Stores Built
              <br />
              To <span className="text-accent">Perform.</span>
            </h1>
          </div>

          {/* Description + Shopify badge — bottom right, narrow (multi-line) */}
          <div className="mt-16 flex justify-start sm:justify-end">
            <div className="max-w-sm">
              <p className="text-base font-medium leading-relaxed text-white/90 [text-shadow:0_1px_16px_rgba(0,0,0,0.95)] sm:text-lg">
                From launch to scale, Cracktab designs and develops Shopify
                stores that look premium, move fast, and turn browsers into
                buyers — built for brands ready to grow beyond their current
                platform.
              </p>
              <Image
                src="/shopify-badge.svg"
                alt="Shopify Partner"
                width={262}
                height={116}
                priority
                className="-ml-1.5 mt-8 h-14 w-auto sm:h-16"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
