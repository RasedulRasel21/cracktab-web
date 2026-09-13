/**
 * Support items as an auto-sliding strip of cards.
 *
 * Same card treatment as the homepage stat grid — square, rounded, one lime
 * card in every four — carried on the shared CSS marquee, so it slides on its
 * own with no JS and no state (hover pause is a CSS animation-play-state).
 *
 * The strip is decorative (`aria-hidden`); the accessible copy is the plain
 * list beneath, which is screen-reader-only until motion is reduced.
 */

export type SupportItem = {
  label: string;
  /** Path under /public — an SVG whose shape is used, not its colour. */
  icon: string;
};

// The -50% translate only loops seamlessly while each half is wider than the
// viewport — otherwise the wrap shows a gap of empty track. Eight cards lay out
// to roughly 2200px, so each half repeats the list to clear any screen width.
const REPEATS = 2;

// Duration is set on the element rather than in `.animate-marquee`, whose 36s
// is tuned to the much shorter logo strip. ~45px/s here, matching that speed.
const DURATION = "[animation-duration:88s]";

/**
 * The SVG drawn as a mask filled with the current text colour. The files carry
 * a fixed lime stroke, which would vanish on the lime cards; masking keeps
 * their shape and lets each card choose the colour, as the old check did.
 */
function Icon({ src, size = 22 }: { src: string; size?: number }) {
  const mask = `url("${src}") center / contain no-repeat`;
  return (
    <span
      aria-hidden="true"
      className="block bg-current"
      style={{ width: size, height: size, mask, WebkitMask: mask }}
    />
  );
}

export default function SupportSlider({ items }: { items: SupportItem[] }) {
  // Two identical halves, each REPEATS copies of the list.
  const half = Array.from({ length: REPEATS }, () => items).flat();
  const row = [...half, ...half];

  return (
    <>
      <div
        aria-hidden="true"
        className="group edge-fade overflow-hidden motion-reduce:hidden"
      >
        <ul
          className={`flex w-max animate-marquee gap-4 pr-4 ${DURATION} group-hover:[animation-play-state:paused]`}
        >
          {row.map((item, i) => {
            // Keyed off the position in the *original* list, so every copy
            // highlights the same cards and the loop seam stays invisible.
            const highlight = i % items.length % 4 === 1;
            return (
              <li
                key={`${item.label}-${i}`}
                className={`flex aspect-square w-56 shrink-0 flex-col justify-between rounded-2xl border p-6 sm:w-64 sm:p-7 ${
                  highlight
                    ? "border-accent bg-accent"
                    : "border-line bg-surface"
                }`}
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                    highlight
                      ? "bg-accent-ink/10 text-accent-ink"
                      : "bg-accent/15 text-accent"
                  }`}
                >
                  <Icon src={item.icon} />
                </span>
                <span
                  className={`font-display text-lg font-medium leading-snug tracking-tight sm:text-xl ${
                    highlight ? "text-accent-ink" : "text-white"
                  }`}
                >
                  {item.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <ul className="sr-only grid grid-cols-1 gap-3 motion-reduce:not-sr-only motion-reduce:grid sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex min-h-28 flex-col rounded-2xl border border-line bg-surface p-5"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <Icon src={item.icon} size={18} />
            </span>
            <span className="mt-3 font-display text-sm font-semibold leading-snug tracking-tight text-white">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
