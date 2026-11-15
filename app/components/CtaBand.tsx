import Link from "next/link";
import BookCallButton from "./BookCallButton";

export default function CtaBand({
  title = "Ready to scale your ecommerce?",
  subtitle = "Let's discuss your project and create a custom solution that drives results.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="relative mx-auto w-full max-w-360 overflow-hidden rounded-[2rem] bg-accent px-7 py-14 text-center text-accent-ink sm:px-16 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/30 blur-3xl" />
        <div className="relative">
          <h2 className="mx-auto max-w-3xl font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.04] tracking-tight">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed opacity-80 sm:text-lg">{subtitle}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BookCallButton className="inline-flex h-13 items-center justify-center rounded-full bg-[#141413] px-8 font-display text-sm font-semibold uppercase tracking-wide text-[#fffdf8] transition-colors hover:bg-black">
              Get a free CRO audit
            </BookCallButton>
            <Link
              href="/contact"
              className="inline-flex h-13 items-center justify-center rounded-full border border-[#141413]/30 px-8 font-display text-sm font-semibold uppercase tracking-wide text-[#141413] transition-colors hover:border-[#141413]"
            >
              Start a project
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
