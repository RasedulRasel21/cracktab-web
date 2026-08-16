"use client";

import { useRef } from "react";
import Link from "next/link";
import { caseStudies, type CaseStudy } from "../lib/site";

function Card({ cs }: { cs: CaseStudy }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);
  const pos = useRef({ x: 0, y: 0 });

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
        href={`/work/${cs.slug}`}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group/card relative block h-[360px] w-[320px] overflow-hidden rounded-2xl border border-line sm:h-[480px] sm:w-[460px] lg:h-[600px] lg:w-[600px]"
      >
        <div
          // Top-anchored: these are site screenshots, so the header/hero is the
          // recognisable part to keep when the square card crops.
          className="absolute inset-0 bg-cover bg-top transition-transform duration-700 ease-out group-hover/card:scale-105"
          style={{ backgroundImage: `url(${cs.img})` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

        <span
          ref={arrowRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-ink opacity-0 [transition:transform_140ms_ease-out,opacity_300ms_ease] [will-change:transform] group-hover/card:opacity-100"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>

        <div className="absolute inset-x-0 bottom-0 translate-y-3 p-6 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 sm:p-8">
          <h3 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
            {cs.name}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
            {cs.teaser}
          </p>
        </div>
      </Link>
    </li>
  );
}

export default function CaseStudySlider({
  reverse = false,
  duration = "50s",
  exclude,
}: {
  reverse?: boolean;
  duration?: string;
  /** Slug to leave out — e.g. the case study currently being read. */
  exclude?: string;
}) {
  const items = exclude
    ? caseStudies.filter((c) => c.slug !== exclude)
    : caseStudies;
  // Duplicate the list so the -50% translate loops seamlessly.
  const loop = [...items, ...items];
  return (
    <div className="group edge-fade overflow-hidden">
      <ul
        className="flex w-max gap-5 pr-5 animate-marquee group-hover:[animation-play-state:paused]"
        style={{
          animationDuration: duration,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {loop.map((cs, i) => (
          <Card key={`${cs.slug}-${i}`} cs={cs} />
        ))}
      </ul>
    </div>
  );
}
