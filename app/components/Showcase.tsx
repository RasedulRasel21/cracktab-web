"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import LivePreviewModal, { type Shots } from "./LivePreviewModal";

type Card = {
  title: string;
  description: string;
  tags: string[];
  img: string;
  href: string;
  /**
   * Full-page screenshots. When set, clicking the card opens the device-mockup
   * preview instead of navigating; without it the card just links to `href`.
   * Drop the captures in /public/previews/ and point at them, e.g.
   *   shots: { desktop: "/previews/seetrue-desktop.png",
   *            mobile:  "/previews/seetrue-mobile.png" },
   */
  shots?: Shots;
  /** Real store URL — shown as "Open live site" inside the preview. */
  liveUrl?: string;
};

// Four cards per row: one loop of a row has to be at least as wide as the
// viewport, or the -50% marquee shift leaves a visible gap on large screens.
const rowA: Card[] = [
  {
    title: "Femdisc",
    description:
      "An education-led femcare storefront that explains the range clearly and makes the right product easy to find.",
    tags: ["UI/UX", "Development"],
    img: "/works/Femdisc.png",
    href: "/work",
  },
  {
    title: "Lockeroom",
    description:
      "A bold, high-contrast storefront for a performance recovery brand, built around fast browsing and a short path to cart.",
    tags: ["Development", "Ecommerce"],
    img: "/works/Lockeroom.jpg",
    href: "/work",
  },
  {
    title: "Luxe Cosmetics",
    description:
      "A beauty storefront built around product education and a frictionless purchase flow.",
    tags: ["UI/UX", "CRO"],
    img: "/works/Luxe-cosmetics.jpg",
    href: "/work",
  },
  {
    title: "ForChics",
    description:
      "A premium storefront refresh built to convert, with a faster, cleaner shopping experience.",
    tags: ["Shopify Plus", "UI/UX"],
    img: "/works/ForChics.png",
    href: "/work",
  },
];

const rowB: Card[] = [
  {
    title: "SeeTrue",
    description:
      "Conversion-focused redesign and testing programme that lifted revenue per session.",
    tags: ["Shopify Plus", "CRO"],
    img: "/works/seetrue.webp",
    href: "/work",
    liveUrl: "https://seetrueglasses.com",
    // Add `shots` once the captures exist to switch this card to the preview:
    // shots: { desktop: "/previews/seetrue-desktop.png",
    //          mobile:  "/previews/seetrue-mobile.png" },
  },
  {
    title: "The Conscious Bar",
    description:
      "A considered storefront with a refined product experience and streamlined checkout.",
    tags: ["Ecommerce", "CRO"],
    img: "/works/Theconsciousbar.png",
    href: "/work",
    liveUrl: "https://theconsciousbar.co/",
  },
  {
    title: "Collection Akhavan",
    description:
      "A polished, editorial storefront that balances brand storytelling with commerce.",
    tags: ["UI/UX", "CX Design"],
    img: "/works/collection-avakan.webp",
    href: "/work",
  },
  {
    title: "Die Schrothkur",
    description:
      "A robust Shopify Plus platform with custom development tailored to the brand's needs.",
    tags: ["Shopify Plus", "Development"],
    img: "/works/die-schrothkur.jpeg",
    href: "/work",
  },
];

function ShopifyPlus() {
  return (
    <div className="flex items-center gap-1.5 text-white">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
        <path d="M9 8a3 3 0 0 1 6 0" strokeLinecap="round" />
      </svg>
      <span className="text-sm font-semibold tracking-tight">
        shopify<span className="font-normal">plus</span>
      </span>
    </div>
  );
}

function CaseCard({ card }: { card: Card }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);
  const pos = useRef({ x: 0, y: 0 });
  const [preview, setPreview] = useState(false);
  // Stable identity so the modal's key/escape listeners aren't torn down and
  // re-attached on every parent render.
  const closePreview = useCallback(() => setPreview(false), []);

  // Write the arrow position at most once per frame, using GPU transform.
  const paint = () => {
    rafRef.current = 0;
    const c = cardRef.current;
    const a = arrowRef.current;
    if (!c || !a) return;
    const r = c.getBoundingClientRect();
    a.style.transform = `translate3d(${pos.current.x - r.left}px, ${
      pos.current.y - r.top
    }px, 0) translate(-50%, -50%)`;
  };

  const onMove = (e: React.MouseEvent) => {
    pos.current.x = e.clientX;
    pos.current.y = e.clientY;
    if (!rafRef.current) rafRef.current = requestAnimationFrame(paint);
  };

  const onLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  };

  const shell =
    "group/card relative block h-[360px] w-[320px] overflow-hidden rounded-2xl border border-line sm:h-[480px] sm:w-[460px] lg:h-[600px] lg:w-[600px]";

  const inner = (
    <>
      {/* image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover/card:scale-105"
          style={{ backgroundImage: `url(${card.img})` }}
        />
        {/* darken on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

        {/* Shopify Plus mark — top left */}
        <div className="absolute left-5 top-5 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
          <ShopifyPlus />
        </div>

        {/* cursor-following arrow */}
        <span
          ref={arrowRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-ink opacity-0 [transition:transform_140ms_ease-out,opacity_300ms_ease] [will-change:transform] group-hover/card:opacity-100"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>

        {/* content — bottom */}
        <div className="absolute inset-x-0 bottom-0 translate-y-3 p-6 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 sm:p-8">
          <h3 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
            {card.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
            {card.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {card.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-accent/60 px-3 py-1 text-xs font-medium text-white"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
    </>
  );

  return (
    <li className="shrink-0">
      {card.shots ? (
        // Real href kept so cmd/middle-click still opens something useful;
        // a plain click is intercepted for the in-page device preview.
        <a
          ref={cardRef}
          href={card.liveUrl ?? card.href}
          target={card.liveUrl ? "_blank" : undefined}
          rel={card.liveUrl ? "noopener noreferrer" : undefined}
          aria-haspopup="dialog"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            setPreview(true);
          }}
          className={shell}
        >
          {inner}
        </a>
      ) : (
        <Link
          ref={cardRef}
          href={card.href}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className={shell}
        >
          {inner}
        </Link>
      )}

      {preview && card.shots && (
        <LivePreviewModal
          title={card.title}
          shots={card.shots}
          liveUrl={card.liveUrl}
          onClose={closePreview}
        />
      )}
    </li>
  );
}

function Row({
  cards,
  reverse,
  duration,
}: {
  cards: Card[];
  reverse?: boolean;
  duration: string;
}) {
  const loop = [...cards, ...cards];
  return (
    <div className="group flex overflow-hidden">
      <ul
        className="flex w-max gap-5 pr-5 animate-marquee group-hover:[animation-play-state:paused]"
        style={{
          animationDuration: duration,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {loop.map((card, i) => (
          <CaseCard key={`${card.title}-${i}`} card={card} />
        ))}
      </ul>
    </div>
  );
}

export default function Showcase() {
  return (
    <section className="overflow-hidden py-20 sm:py-28">
      <div className="mx-auto mb-12 w-full max-w-360 px-5 sm:mb-16 sm:px-8">
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.02] tracking-tight text-white">
          Our finest <span className="text-accent">Case Studies</span>
        </h2>
      </div>

      <div className="flex flex-col gap-5">
        <Row cards={rowA} duration="55s" />
        <Row cards={rowB} reverse duration="70s" />
      </div>
    </section>
  );
}
