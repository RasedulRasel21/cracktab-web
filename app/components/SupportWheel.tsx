/**
 * Circular card wheel.
 *
 * Cards sit on the rim of a large circle whose lower portion is cropped away,
 * so only the top arc shows; the rim rotates negatively, carrying them
 * right-to-left across the dome and tilting each to follow the curve.
 *
 * The item list is doubled so slots sit 22.5° apart instead of 45° — that puts
 * five cards in view across a gentler run of the arc, and the two copies of any
 * item are 180° apart, so they're never on screen together.
 *
 * The radius is a CSS variable rather than a JS number so it can shrink at
 * breakpoints; only each slot's fixed angle is computed here.
 *
 * Only part of the wheel is ever visible, so it's treated as decoration: the
 * accessible copy is the plain list, which is screen-reader-only until motion
 * is reduced (the wheel freezes then, stranding most cards off-arc).
 */
export default function SupportWheel({ items }: { items: string[] }) {
  const slots = [...items, ...items];
  const step = 360 / slots.length;

  return (
    <>
      <div
        aria-hidden="true"
        className="group relative h-[15rem] overflow-hidden [--wheel-r:300px] motion-reduce:hidden sm:h-[18rem] sm:[--wheel-r:480px] lg:h-[22rem] lg:[--wheel-r:700px]"
      >
        <div
          className="absolute left-1/2 top-16 animate-wheel group-hover:[animation-play-state:paused]"
          style={{
            width: "calc(2 * var(--wheel-r))",
            height: "calc(2 * var(--wheel-r))",
            marginLeft: "calc(-1 * var(--wheel-r))",
          }}
        >
          {slots.map((label, i) => (
            // Zero-size anchor: rotating it about the circle centre lands its
            // origin on the rim at this slot's angle, already tilted to match.
            <div
              key={`${label}-${i}`}
              className="absolute left-1/2 top-1/2 h-0 w-0"
              style={{
                transform: `rotate(${i * step}deg) translateY(calc(-1 * var(--wheel-r)))`,
              }}
            >
              <div className="absolute left-0 top-0 flex min-h-28 w-44 -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl border border-line bg-surface p-4 sm:w-56 sm:p-5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <Check />
                </span>
                <span className="mt-3 font-display text-xs font-semibold leading-snug tracking-tight text-white sm:text-sm">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ul className="sr-only grid grid-cols-1 gap-3 motion-reduce:not-sr-only motion-reduce:grid sm:grid-cols-2 lg:grid-cols-4">
        {items.map((label) => (
          <li
            key={label}
            className="flex min-h-28 flex-col rounded-2xl border border-line bg-surface p-5"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
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

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
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
