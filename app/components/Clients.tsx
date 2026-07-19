import { clients } from "../lib/site";

/**
 * Proud-clients strip: an infinite CSS marquee (no JS). Brand names stand in
 * as text "logos" — swap each <span> for an <Image>/SVG when real logos land.
 */
export default function Clients() {
  // Duplicate the list so the -50% translate loops seamlessly.
  const row = [...clients, ...clients];

  return (
    <section className="border-t border-line py-14 sm:py-16">
      <p className="mb-10 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">
        Proud clients — trusted by brands worldwide
      </p>

      <div className="group edge-fade overflow-hidden">
        <ul className="flex w-max animate-marquee items-center gap-14 pr-14 group-hover:[animation-play-state:paused] sm:gap-20 sm:pr-20">
          {row.map((name, i) => (
            <li
              key={`${name}-${i}`}
              aria-hidden={i >= clients.length ? "true" : undefined}
              className="shrink-0 whitespace-nowrap font-display text-xl font-semibold tracking-tight text-white/40 transition-colors duration-300 hover:text-white sm:text-2xl"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
