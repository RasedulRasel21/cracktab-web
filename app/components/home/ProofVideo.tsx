import { proof } from "./content";
import { SectionHead } from "./ui";
import AutoVideo from "./AutoVideo";

export default function ProofVideo() {
  return (
    <section id="proof" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-360 grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <div>
          <SectionHead eyebrow={proof.eyebrow} title={proof.title} body={proof.body} />
          <dl className="mt-10 grid grid-cols-2 gap-3 sm:gap-4">
            {proof.stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-line bg-surface p-5">
                <dt className="text-sm leading-snug text-muted sm:text-base">{s.label}</dt>
                <dd className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{s.value}</span>
                  {s.delta && (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-ink">{s.delta}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-muted">Figures as shown in the recording. Deltas compare with the previous 30 days.</p>
        </div>

        <div className="relative mx-auto w-full max-w-[24rem]">
          <div
            aria-hidden="true"
            className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(closest-side,rgba(180,240,58,0.35),transparent)]"
          />
          <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-[0_40px_80px_-30px_rgba(20,20,19,0.4)]">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-xs font-medium text-muted">Shopify admin · Analytics</span>
              <span className="ml-auto inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--olive)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--olive)]" />
                Real recording
              </span>
            </div>
            <AutoVideo
              className="block aspect-[384/594] w-full bg-white object-cover"
              src="/home/store-results.mp4"
              poster="/home/store-results-poster.jpg"
              label="Screen recording of a client's Shopify analytics dashboard"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
