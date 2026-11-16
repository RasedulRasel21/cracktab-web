"use client";

import { useEffect, useState } from "react";

/**
 * Floating "back to top" arrow, bottom right. Appears after the visitor has
 * scrolled about one screen down and scrolls smoothly back to the top
 * (through Lenis when it is running, otherwise natively).
 */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (/^\/(admin|studio)/.test(window.location.pathname)) return;
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: number, o?: object) => void } }).lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-5 right-5 z-[90] flex h-12 w-12 items-center justify-center rounded-full bg-[#141413] text-accent shadow-[0_12px_30px_-10px_rgba(20,20,19,0.6)] ring-2 ring-[#f3eee4] transition-all duration-300 hover:-translate-y-1 hover:bg-black sm:bottom-7 sm:right-7 sm:h-13 sm:w-13 max-sm:h-11 max-sm:w-11 ${
        show ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
