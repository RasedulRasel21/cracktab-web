"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

/**
 * 3D coverflow slider.
 *
 * The active card sits upright and nearest the viewer; neighbours fall back in
 * perspective, tilt away and dim. Click a side card to bring it to centre, or
 * use the arrow keys. Autoplay runs right-to-left and pauses on hover.
 *
 * Paint order inside a `preserve-3d` context follows 3D position rather than
 * z-index, which is why depth is expressed as translateZ instead of stacking.
 *
 * Only three cards are legible at a time, so the slider is decorative
 * (`aria-hidden`); the accessible copy is the plain list beneath, which is
 * screen-reader-only until motion is reduced.
 */
const PERSPECTIVE = 1600;
const DEPTH = 240; // z pushback per step away from centre
const SCALE_STEP = 0.16;
const TILT = 12; // rotateY per step
const SIDE_TILT = 8; // rotateZ per step
const MAX_VISIBLE = 2;
const DIM = 0.45; // black overlay opacity on inactive cards
const DUR = 0.6;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const AUTOPLAY_MS = 3200;

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

export default function SupportCoverflow({ items }: { items: string[] }) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const lockRef = useRef(false);

  // Card size follows the container rather than fixed breakpoints, so the
  // scene stays proportionate at any width.
  const rootRef = useRef<HTMLDivElement>(null);
  const [cardW, setCardW] = useState(340);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      setCardW(Math.max(210, Math.min(340, w * 0.32)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cardH = Math.round(cardW * 0.72);
  const spread = Math.round(cardW * 0.72); // horizontal offset per step

  // Ignore input mid-move so rapid clicks don't stack up and jitter.
  const step = useCallback(
    (dir: number) => {
      if (lockRef.current) return;
      lockRef.current = true;
      window.setTimeout(() => {
        lockRef.current = false;
      }, DUR * 1000);
      setActive((a) => (((a + dir) % n) + n) % n);
    },
    [n],
  );

  const goTo = useCallback(
    (i: number) => {
      if (lockRef.current) return;
      lockRef.current = true;
      window.setTimeout(() => {
        lockRef.current = false;
      }, DUR * 1000);
      setActive((a) => (i === a ? (a + 1) % n : i));
    },
    [n],
  );

  useEffect(() => {
    if (paused || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => step(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, n, step]);

  return (
    <>
      <div
        ref={rootRef}
        aria-hidden="true"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="relative flex w-full items-center justify-center overflow-hidden motion-reduce:hidden"
        style={{ perspective: `${PERSPECTIVE}px`, height: cardH + 90 }}
      >
        <div
          className="relative"
          style={{
            width: cardW,
            height: cardH,
            transformStyle: "preserve-3d",
          }}
        >
          {items.map((label, i) => {
            // Shortest way round the loop, so wrapping doesn't fly across.
            let rel = i - active;
            if (rel > n / 2) rel -= n;
            if (rel < -n / 2) rel += n;

            const dist = Math.abs(rel);
            const visible = dist <= MAX_VISIBLE;
            const isActive = rel === 0;

            const cardStyle: CSSProperties = {
              position: "absolute",
              left: "50%",
              top: "50%",
              width: cardW,
              height: cardH,
              transformStyle: "preserve-3d",
              transform: `translate(-50%, -50%) translateX(${rel * spread}px) translateZ(${-dist * DEPTH}px) rotateY(${-rel * TILT}deg) rotateZ(${rel * SIDE_TILT}deg) scale(${Math.max(0.4, 1 - dist * SCALE_STEP)})`,
              transition: `transform ${DUR}s ${EASE}, opacity ${DUR}s ${EASE}, border-color ${DUR}s ${EASE}`,
              opacity: visible ? 1 : 0,
              pointerEvents: visible ? "auto" : "none",
              cursor: isActive ? "default" : "pointer",
            };

            return (
              <div
                key={label}
                style={cardStyle}
                onClick={() => goTo(i)}
                className={`flex flex-col justify-between overflow-hidden rounded-2xl border bg-surface p-6 ${
                  isActive ? "border-accent/45" : "border-line"
                }`}
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Check />
                </span>
                <span className="font-display text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl">
                  {label}
                </span>

                {/* Dims everything but the card in the spotlight */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-black"
                  style={{
                    opacity: isActive ? 0 : DIM,
                    transition: `opacity ${DUR}s ${EASE}`,
                  }}
                />
              </div>
            );
          })}
        </div>
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
