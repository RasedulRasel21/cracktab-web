import { stats } from "../lib/site";

export default function About() {
  return (
    <section id="about" className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
        {/* Label (left) + statement & cards (right, aligned together) */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-[200px_1fr]">
          <div className="lg:pt-2">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              About Cracktab
            </span>
          </div>

          {/* Right column — statement + stat cards share this left edge */}
          <div>
            <p className="max-w-3xl font-display text-[clamp(1.5rem,3vw,2.5rem)] font-medium leading-[1.15] tracking-tight text-white">
              A Shopify-focused design and development team helping brands
              launch, scale, and manage stores that convert. We keep our client
              list intentionally small —{" "}
              <span className="text-accent">
                fewer projects, more attention
              </span>{" "}
              on each one.
            </p>

          </div>
        </div>

        {/* Stat cards — big squares, value top / label bottom */}
        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
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
                  className={`text-sm font-medium ${
                    highlight ? "text-accent-ink/70" : "text-muted"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
