import Stats from "./Stats";

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
        {/* Header aligned to the 4-card grid: label over card 1,
            description spanning cards 2–4 */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 lg:grid-cols-4">
          <div className="lg:pt-2">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              About Cracktab
            </span>
          </div>

          <p className="font-display text-[clamp(1.5rem,3vw,2.5rem)] font-medium leading-[1.15] tracking-tight text-white lg:col-span-3 lg:col-start-2">
            A Shopify-focused design and development team helping brands launch,
            scale, and manage stores that convert. We keep our client list
            intentionally small —{" "}
            <span className="text-accent">fewer projects, more attention</span>{" "}
            on each one.
          </p>
        </div>

        {/* Credibility numbers — shared with the services hub */}
        <div className="mt-14">
          <Stats />
        </div>
      </div>
    </section>
  );
}
