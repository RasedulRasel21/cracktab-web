"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide smooth (eased) scrolling. Skipped for visitors who prefer reduced
 * motion and on the admin/studio. Inner scroll areas (phone mock-ups,
 * sliders, menus, dialogs) keep native scrolling via `data-lenis-prevent`
 * or by being horizontal / overflow containers Lenis ignores.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (/^\/(admin|studio|login)/.test(window.location.pathname)) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      // Let nested scrollers (phones, carousels, open menus) scroll natively.
      prevent: (node: HTMLElement) =>
        !!node.closest(
          "[data-lenis-prevent], .overflow-y-auto, .overflow-auto, [role='dialog'], .studio-page",
        ),
      anchors: { offset: -80 },
    });

    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
