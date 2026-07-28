"use client";

import { useRef } from "react";
import Link from "next/link";

type Card = {
  title: string;
  description: string;
  tags: string[];
  img: string;
  href: string;
};

// Placeholder Pexels imagery — swap `img` for real case-study shots later.
const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900&h=900&dpr=1`;

const rowA: Card[] = [
  {
    title: "Dropdead",
    description:
      "A clean Shopify rebuild on a tight deadline, preserving the brand's bold, alternative identity.",
    tags: ["Growth", "Development", "CRO"],
    img: px(1435752),
    href: "/work",
  },
  {
    title: "WatchHouse",
    description:
      "Award-winning navigation, enhanced subscriptions and an improved quiz for coffee lovers.",
    tags: ["Shopify Plus", "CX Design", "CRO"],
    img: px(996329),
    href: "/work",
  },
  {
    title: "Miss Me",
    description:
      "A modern, high-performing Shopify 2.0 site that enhances loyalty and drives long-term growth.",
    tags: ["Development", "Ecommerce"],
    img: px(2529148),
    href: "/work",
  },
  {
    title: "ForChics",
    description:
      "A premium storefront refresh built to convert, with a faster, cleaner shopping experience.",
    tags: ["Shopify Plus", "UI/UX"],
    img: px(2983464),
    href: "/work",
  },
  {
    title: "SeeTrue",
    description:
      "Conversion-focused redesign and testing programme that lifted revenue per session.",
    tags: ["Shopify Plus", "CRO"],
    img: px(1183266),
    href: "/work",
  },
];

const rowB: Card[] = [
  {
    title: "Orbes",
    description:
      "End-to-end design and development for a scalable, brand-led ecommerce experience.",
    tags: ["UI/UX", "Development"],
    img: px(322207),
    href: "/work",
  },
  {
    title: "SEZ Group",
    description:
      "A Shopify Plus build engineered for speed, with a CRO roadmap for sustained growth.",
    tags: ["Shopify Plus", "CRO"],
    img: px(934070),
    href: "/work",
  },
  {
    title: "The Conscious Bar",
    description:
      "A considered storefront with a refined product experience and streamlined checkout.",
    tags: ["Ecommerce", "CRO"],
    img: px(1926769),
    href: "/work",
  },
  {
    title: "Collection Akhavan",
    description:
      "A polished, editorial storefront that balances brand storytelling with commerce.",
    tags: ["UI/UX", "CX Design"],
    img: px(1462637),
    href: "/work",
  },
  {
    title: "Die Schrothkur",
    description:
      "A robust Shopify Plus platform with custom development tailored to the brand's needs.",
    tags: ["Shopify Plus", "Development"],
    img: px(1152077),
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

  return (
    <li className="shrink-0">
      <Link
        ref={cardRef}
        href={card.href}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group/card relative block h-[360px] w-[320px] overflow-hidden rounded-2xl border border-line sm:h-[480px] sm:w-[460px] lg:h-[600px] lg:w-[600px]"
      >
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
      </Link>
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
