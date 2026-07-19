import { SHOWREEL_SRC } from "../lib/site";

/**
 * Large hero showreel. Muted autoplay loop — no JS/library required.
 */
export default function HeroVideo() {
  return (
    <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
      <div className="group relative overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_0_120px_-40px_rgba(180,240,58,0.35)]">
        {/* placeholder tint shown behind the poster/video */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(180,240,58,0.14),transparent_70%)]"
        />
        <video
          className="relative aspect-video w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={SHOWREEL_SRC} type="video/mp4" />
        </video>

        {/* corner label */}
        <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-line bg-black/40 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-white backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Selected Work
        </div>
      </div>
    </div>
  );
}
