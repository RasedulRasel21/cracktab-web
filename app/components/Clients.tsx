// A single shared height normalizes each logo's *bounding box*, not its
// glyphs — so tight wordmarks read huge while stacked lockups (icon + small
// text) read tiny. `size` optically balances the odd ones out; the rest keep
// the default.
const DEFAULT_SIZE = "h-8 sm:h-9";

const logos: { src: string; size?: string }[] = [
  { src: "/logos/logo1.png" }, // The Conscious Bar
  { src: "/logos/logo2.png" },
  { src: "/logos/logo3.svg" },
  // Die Schrothkur — stacked lockup; its text is only ~20% of the box height,
  // so it still needs a slightly taller box than the wordmarks to stay legible.
  { src: "/logos/logo6.svg", size: "h-10 sm:h-12" },
  // akhavan collection — single-line wordmark whose cap height fills the box,
  // so it needs less than the default.
  { src: "/logos/logo7.svg", size: "h-6 sm:h-7" },
];

// The -50% translate only loops seamlessly while each half is wider than the
// viewport — otherwise the wrap shows a gap of empty track. Five logos lay out
// to roughly 1330px, so each half repeats the list to clear any screen width.
const REPEATS = 3;

/**
 * Proud-clients strip: an infinite CSS marquee (no JS) of client logos.
 * Logos are forced to a uniform white monochrome so they read consistently
 * on the black background; they brighten on hover.
 */
export default function Clients() {
  // Two identical halves, each REPEATS copies of the list.
  const half = Array.from({ length: REPEATS }, () => logos).flat();
  const row = [...half, ...half];

  return (
    <section className="py-14 sm:py-16">
      <p className="mb-10 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">
        Proud clients — trusted by brands worldwide
      </p>

      <div className="group edge-fade overflow-hidden">
        <ul className="flex w-max animate-marquee items-center gap-14 pr-14 [animation-duration:80s] group-hover:[animation-play-state:paused] sm:gap-20 sm:pr-20">
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
