import { homeProcess } from "../lib/site";

/** "How we work" — the four stages, written for a first-time visitor. */
export default function HomeProcess() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Process
          </span>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.02] tracking-tight text-white">
            How we <span className="text-accent">work</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">
            A clear process, from first call to launch and beyond.
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homeProcess.map((step) => (
            <li
              key={step.no}
              className="rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-accent/50"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 font-display text-xs font-semibold text-accent">
                {step.no}
              </span>
              <h3 className="mt-6 font-display text-lg font-semibold leading-snug tracking-tight text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
