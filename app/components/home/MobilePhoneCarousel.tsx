"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneFrame } from "./ui";
import { phoneScreens } from "./content";

/**
 * Phone-only version of the store strip. It advances by itself, the visitor
 * can swipe it at any time (autoplay resumes a few seconds later), and the
 * phone in the centre scrolls its store page from top to bottom.
 */
export default function MobilePhoneCarousel() {
  const track = useRef<HTMLUListElement>(null);
  const [center, setCenter] = useState(0);
  const pausedUntil = useRef(0);

  // Work out which card is centred.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let dist = Infinity;
        Array.from(el.children).forEach((c, i) => {
          const li = c as HTMLElement;
          const d = Math.abs(li.offsetLeft + li.offsetWidth / 2 - mid);
          if (d < dist) {
            dist = d;
            best = i;
          }
        });
        setCenter(best);
      });
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Auto-advance one phone every few seconds, pausing after a swipe.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const pause = () => (pausedUntil.current = Date.now() + 6000);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("pointerdown", pause);
    const id = window.setInterval(() => {
      if (Date.now() < pausedUntil.current || document.hidden) return;
      const cards = Array.from(el.children) as HTMLElement[];
      const next = (center + 1) % cards.length;
      const c = cards[next];
      el.scrollTo({ left: c.offsetLeft + c.offsetWidth / 2 - el.clientWidth / 2, behavior: "smooth" });
    }, 4200);
    return () => {
      window.clearInterval(id);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("pointerdown", pause);
    };
  }, [center]);

  return (
    <div className="md:hidden">
      <ul
        ref={track}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[21%] py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {phoneScreens.map((s, i) => (
          <li key={s.src} className="w-[58vw] max-w-[15rem] shrink-0 snap-center">
            <PhoneFrame className={`aspect-[9/19] transition-transform duration-500 ${i === center ? "scale-100" : "scale-[0.92] opacity-80"}`} notch={false}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt={`${s.store} ${s.page.toLowerCase()} on mobile`}
                loading={i < 3 ? "eager" : "lazy"}
                decoding="async"
                className={`absolute inset-x-0 top-0 w-full ease-in-out ${
                  i === center ? "-translate-y-[62%] transition-transform delay-500 duration-[3.4s]" : "translate-y-0 transition-transform duration-500"
                }`}
              />
              <span className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#141413]/85 px-2.5 py-1 text-[10px] font-semibold text-white">
                {s.page}
              </span>
            </PhoneFrame>
            <p className="mt-3 text-center text-sm font-medium text-muted">{s.store}</p>
          </li>
        ))}
      </ul>
      <div className="mt-1 flex justify-center gap-1.5" aria-hidden="true">
        {phoneScreens.map((s, i) => (
          <span key={s.src} className={`h-1.5 rounded-full transition-all ${i === center ? "w-5 bg-foreground" : "w-1.5 bg-line"}`} />
        ))}
      </div>
    </div>
  );
}
