import Accordion from "./Accordion";
import { homeFaq } from "../lib/site";

/** Buyer-intent FAQ on the homepage — reuses the shared Accordion. */
export default function HomeFaq() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-360 grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            FAQ
          </span>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.02] tracking-tight text-white">
            Frequently asked <span className="text-accent">questions</span>
          </h2>
        </div>
        <Accordion items={homeFaq} />
      </div>
    </section>
  );
}
