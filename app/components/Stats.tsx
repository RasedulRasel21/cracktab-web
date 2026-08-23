import { stats } from "../lib/site";

/**
 * Credibility numbers. Shared so the homepage About block and the services hub
 * show the same figures from one source.
 */
export default function Stats() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s, i) => {
        const highlight = i === 1;
        return (
          <div
            key={s.label}
            className={`flex aspect-square flex-col justify-between rounded-2xl border p-6 transition-colors duration-300 sm:p-7 ${
              highlight
                ? "border-accent bg-accent text-accent-ink"
                : "border-line bg-surface text-white hover:border-accent/50"
            }`}
          >
            <span className="font-display text-5xl font-medium tracking-tight sm:text-6xl">
              {s.value}
            </span>
            <span
              className={`text-lg font-medium sm:text-2xl lg:text-3xl ${
                highlight ? "text-accent-ink/70" : "text-muted"
              }`}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
