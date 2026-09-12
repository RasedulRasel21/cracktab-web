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

// The -50% translate only loops seamlessly while each half is wider than the
// viewport — otherwise the wrap shows a gap of empty track. Eight cards lay out
// to roughly 2200px, so each half repeats the list to clear any screen width.
const REPEATS = 2;

// Duration is set on the element rather than in `.animate-marquee`, whose 36s
// is tuned to the much shorter logo strip. ~45px/s here, matching that speed.
const DURATION = "[animation-duration:88s]";

function Check() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M3.5 9.5l3.5 3.5 7.5-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SupportSlider({ items }: { items: string[] }) {
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
          {row.map((label, i) => {
            // Keyed off the position in the *original* list, so every copy
            // highlights the same cards and the loop seam stays invisible.
            const highlight = i % items.length % 4 === 1;
            return (
              <li
                key={`${label}-${i}`}
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
                  <Check />
                </span>
                <span
                  className={`font-display text-lg font-medium leading-snug tracking-tight sm:text-xl ${
                    highlight ? "text-accent-ink" : "text-white"
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <ul className="sr-only grid grid-cols-1 gap-3 motion-reduce:not-sr-only motion-reduce:grid sm:grid-cols-2 lg:grid-cols-4">
        {items.map((label) => (
          <li
            key={label}
            className="flex min-h-28 flex-col rounded-2xl border border-line bg-surface p-5"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <Check />
            </span>
            <span className="mt-3 font-display text-sm font-semibold leading-snug tracking-tight text-white">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
