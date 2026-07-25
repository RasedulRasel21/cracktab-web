export default function CtaSection() {
  return (
    <section className="border-t border-line bg-black py-20 sm:py-28">
      <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          {/* Left — heading */}
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.05] tracking-tight text-white">
            Let&apos;s work together
          </h2>

          {/* Right — description */}
          <p className="max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            Great stores come from teams that are close enough to care — and
            opinionated enough to change things.
          </p>
        </div>
      </div>
    </section>
  );
}
