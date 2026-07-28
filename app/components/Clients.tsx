const logos = [
  "/logos/logo1.png",
  "/logos/logo2.png",
  "/logos/logo3.svg",
  "/logos/logo4.webp",
  "/logos/logo5.svg",
  "/logos/logo6.svg",
  "/logos/logo7.svg",
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
          {row.map((src, i) => (
            <li
              key={`${src}-${i}`}
              aria-hidden={i >= logos.length ? "true" : undefined}
              className="shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-8 w-auto object-contain opacity-60 brightness-0 invert transition-opacity duration-300 hover:opacity-100 sm:h-9"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
