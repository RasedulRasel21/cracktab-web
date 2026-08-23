import { testimonials } from "../lib/site";

/**
 * Client testimonials. Quotes are placeholders until real ones land — see
 * `testimonials` in lib/site.
 */
export default function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Testimonials
          </span>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.02] tracking-tight text-white">
            What our <span className="text-accent">clients</span> say
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">
            We keep our client list small so every project gets full attention —
            here&apos;s what that looks like from their side.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <li
              key={t.quote}
              className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-7 transition-colors duration-300 hover:border-accent/50"
            >
              <svg
                width="26"
                height="20"
                viewBox="0 0 26 20"
                fill="currentColor"
                aria-hidden="true"
                className="shrink-0 text-accent/60"
              >
                <path d="M0 20V11.2C0 5.02 3.53.9 10.02 0l.9 3.3c-3.6.9-5.4 2.9-5.4 5.9H10V20H0Zm15 0V11.2C15 5.02 18.53.9 25.02 0l.9 3.3c-3.6.9-5.4 2.9-5.4 5.9H25V20H15Z" />
              </svg>

              <blockquote className="mt-6 flex-1 text-sm leading-relaxed text-white/85">
                {t.quote}
              </blockquote>

              <figcaption className="mt-7 border-t border-line pt-5 text-sm not-italic">
                <span className="block font-display font-semibold tracking-tight text-white">
                  {t.name}
                </span>
                <span className="mt-1 block text-xs text-muted">
                  {t.title}, {t.brand}
                </span>
              </figcaption>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
