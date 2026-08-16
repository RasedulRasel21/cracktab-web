import { SUB_COLS, SUB_ROWS, DOT_R, landDots, project } from "../lib/worldMap";

const DOTS = landDots();

/**
 * Static dot-matrix world map with office pins — no image asset, no mapping
 * library. The cursor-reactive variant used behind the About hero lives in
 * `WorldDotField`; both draw from the same land mask in `lib/worldMap`.
 */
export type Pin = { label: string; address: string; lon: number; lat: number };

function Dots() {
  return (
    <svg
      viewBox={`0 0 ${SUB_COLS} ${SUB_ROWS}`}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {DOTS.map(([col, row]) => (
        <circle
          key={`${row}-${col}`}
          cx={col + 0.5}
          cy={row + 0.5}
          r={DOT_R}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export default function WorldMap({ pins = [] }: { pins?: Pin[] }) {
  return (
    <div className="relative w-full">
      {/* The box matches the viewBox ratio exactly, so "meet" adds no
          letterboxing and the percentage-positioned pins stay aligned. */}
      <div className="relative aspect-[60/28] w-full text-white/15">
        <Dots />

        {pins.map((pin) => {
          const { x, y } = project(pin.lon, pin.lat);
          return (
            <span
              key={pin.label}
              className="absolute"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span className="relative -ml-1 -mt-1 block h-2 w-2">
                <span className="absolute -inset-2 rounded-full bg-accent/30 blur-md" />
                <span className="absolute inset-0 rounded-full bg-accent" />
              </span>
              <span className="absolute bottom-4 left-1/2 hidden w-44 -translate-x-1/2 rounded-lg border border-line bg-surface/90 px-3 py-2 backdrop-blur-sm sm:block">
                <span className="block font-display text-xs font-semibold tracking-tight text-white">
                  {pin.label}
                </span>
                <span className="mt-1 block text-[0.7rem] leading-snug text-muted">
                  {pin.address}
                </span>
              </span>
            </span>
          );
        })}
      </div>

      {/* Pin labels would collide at phone widths — list them instead. */}
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:hidden">
        {pins.map((pin) => (
          <li
            key={pin.label}
            className="rounded-xl border border-line bg-surface p-4"
          >
            <span className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {pin.label}
            </span>
            <span className="mt-1.5 block text-xs leading-relaxed text-muted">
              {pin.address}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
