// A single shared height normalizes each logo's *bounding box*, not its
// glyphs — so tight wordmarks read huge while stacked lockups (icon + small
// text) read tiny. `size` optically balances the odd ones out; the rest keep
// the default.
const DEFAULT_SIZE = "h-8 sm:h-9";

const logos: { src: string; size?: string }[] = [
  { src: "/logos/logo1.png" }, // The Conscious Bar
  { src: "/logos/logo2.png" },
  { src: "/logos/logo3.svg" },
  { src: "/logos/logo4.webp" },
  // KHAITE — all-caps wordmark, cap height fills the box, so it needs less.
  { src: "/logos/logo5.svg", size: "h-6 sm:h-7" },
  // Die Schrothkur — stacked lockup; its text is only ~20% of the box height,
  // so it still needs a slightly taller box than the wordmarks to stay legible.
  { src: "/logos/logo6.svg", size: "h-10 sm:h-12" },
  // akhavan collection — single-line wordmark, same treatment as KHAITE.
  { src: "/logos/logo7.svg", size: "h-6 sm:h-7" },
];

/**
 * Proud-clients strip: an infinite CSS marquee (no JS) of client logos.
 * Logos are forced to a uniform white monochrome so they read consistently
 * on the black background; they brighten on hover.
 */
export default function Clients() {
  // Duplicate the list so the -50% translate loops seamlessly.
  const row = [...logos, ...logos];

  return (
    <section className="py-14 sm:py-16">
      <p className="mb-10 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">
        Proud clients — trusted by brands worldwide
      </p>

      <div className="group edge-fade overflow-hidden">
        <ul className="flex w-max animate-marquee items-center gap-14 pr-14 group-hover:[animation-play-state:paused] sm:gap-20 sm:pr-20">
          {row.map((logo, i) => (
            <li
              key={`${logo.src}-${i}`}
              aria-hidden={i >= logos.length ? "true" : undefined}
              className="shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt=""
                loading="lazy"
                className={`${logo.size ?? DEFAULT_SIZE} w-auto object-contain opacity-60 brightness-0 invert transition-opacity duration-300 hover:opacity-100`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
