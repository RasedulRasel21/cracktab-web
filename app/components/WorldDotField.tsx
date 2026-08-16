"use client";

import { useEffect, useRef } from "react";
import { SUB, SUB_COLS, SUB_ROWS, DOT_R, landMask } from "../lib/worldMap";

/**
 * Cursor-reactive world map built from dots (canvas, no library).
 *
 *  • Ambient: the continents sit as a faint dot grid, twinkling slowly so the
 *    field is always subtly alive.
 *  • Cursor: recent pointer positions form a fading "snake" trail — dots along
 *    the path swell and turn lime, brightest at the head.
 *
 *  Same shape as the home hero's AsciiField: the land lookup is precomputed
 *  once, the ambient pass is a tight loop, and the trail is *scattered* only
 *  over the cells it touches, so cost scales with the trail, not the grid.
 */
// Trail radius in *cells*, not pixels — the dot grid rescales with the
// viewport, and a fixed pixel radius would fatten the snake as dots shrink.
// ~2.5 cells matches the home hero's AsciiField (46px over a 19px cell).
const TRAIL_CELLS = 2.5;
const TRAIL_MAX = 240; // max points retained in the trail (long tail)
const TRAIL_DECAY = 0.016; // life lost per frame — lower = longer tail
const TRAIL_SWELL = 0.6; // how much a lit dot grows at the trail head

// The mask covers 28 rows of latitude, but rows 0-1 and 26-27 are near-empty
// polar water — including them leaves blank strips top and bottom. Fitting the
// *land* band to the section height instead is what keeps the field full.
const FOCUS_TOP = 2 * SUB;
const FOCUS_ROWS = 24 * SUB; // mask rows 2-25, in sub-cells

function hash(x: number, y: number): number {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

type TrailPoint = { x: number; y: number; life: number };

export default function WorldDotField({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;
    const cv: HTMLCanvasElement = canvas;
    const c: CanvasRenderingContext2D = ctx;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mask = landMask();

    let width = 0;
    let height = 0;
    let cellX = 0;
    let cellY = 0;
    let cellMin = 0;
    let trailR = 0;
    let offY = 0;
    let raf = 0;
    let running = false;

    const trail: TrailPoint[] = [];
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    let lastPushX = -9999;
    let lastPushY = -9999;

    function resize() {
      const rect = cv.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.floor(width * dpr);
      cv.height = Math.floor(height * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Full map width always shows — cropping columns would cut continents
      // off a *world* map. Height stretches the land band to fill instead.
      cellX = width / SUB_COLS;
      cellY = height / FOCUS_ROWS;
      cellMin = Math.min(cellX, cellY);
      trailR = cellMin * TRAIL_CELLS;
      offY = -FOCUS_TOP * cellY;
    }

    function pushTrail(x: number, y: number) {
      trail.push({ x, y, life: 1 });
      if (trail.length > TRAIL_MAX) trail.shift();
    }

    function render(time: number) {
      c.clearRect(0, 0, width, height);
      const t = time * 0.001;
      const r0 = DOT_R * cellMin;

      // ---- Ambient pass (continents, subtle twinkle) ----
      for (let row = 0; row < SUB_ROWS; row++) {
        const py = offY + (row + 0.5) * cellY;
        const rowOff = row * SUB_COLS;
        for (let col = 0; col < SUB_COLS; col++) {
          if (mask[rowOff + col] === 0) continue;
          const px = (col + 0.5) * cellX;
          const a =
            0.14 * (0.75 + 0.25 * Math.sin(t * 1.1 + hash(col, row) * 6.2831));
          c.fillStyle = `rgba(214,220,228,${a})`;
          c.beginPath();
          c.arc(px, py, r0, 0, Math.PI * 2);
          c.fill();
        }
      }

      // ---- Snake trail ----
      // Ease pointer toward its target, drop interpolated points on movement.
      pointer.x += (pointer.tx - pointer.x) * 0.22;
      pointer.y += (pointer.ty - pointer.y) * 0.22;
      if (pointer.active) {
        const dx = pointer.x - lastPushX;
        const dy = pointer.y - lastPushY;
        const d = Math.hypot(dx, dy);
        if (d > cellMin * 0.4) {
          const steps = Math.min(10, Math.max(1, (d / (cellMin * 0.4)) | 0));
          for (let s = 1; s <= steps; s++) {
            pushTrail(lastPushX + (dx * s) / steps, lastPushY + (dy * s) / steps);
          }
          lastPushX = pointer.x;
          lastPushY = pointer.y;
        }
      }

      for (let k = trail.length - 1; k >= 0; k--) {
        const p = trail[k];
        p.life -= TRAIL_DECAY;
        if (p.life <= 0) {
          trail.splice(k, 1);
          continue;
        }
        // Scatter over the land cells this point covers.
        const c0 = Math.max(0, (((p.x - trailR) / cellX) | 0));
        const c1 = Math.min(SUB_COLS - 1, (((p.x + trailR) / cellX) | 0));
        const r1 = Math.max(0, (((p.y - trailR - offY) / cellY) | 0));
        const r2 = Math.min(SUB_ROWS - 1, (((p.y + trailR - offY) / cellY) | 0));
        for (let row = r1; row <= r2; row++) {
          const py = offY + (row + 0.5) * cellY;
          const rowOff = row * SUB_COLS;
          for (let col = c0; col <= c1; col++) {
            if (mask[rowOff + col] === 0) continue;
            const px = (col + 0.5) * cellX;
            const dist = Math.hypot(px - p.x, py - p.y);
            if (dist > trailR) continue;
            const f = (1 - dist / trailR) * p.life;
            if (f < 0.06) continue;
            const a = Math.min(1, 0.15 + f * 0.85);
            // hot white core at the freshest, brightest touch; lime otherwise
            c.fillStyle =
              f > 0.85 ? `rgba(240,255,220,${a})` : `rgba(180,240,58,${a})`;
            c.beginPath();
            c.arc(px, py, r0 * (1 + f * TRAIL_SWELL), 0, Math.PI * 2);
            c.fill();
          }
        }
      }

      if (running && !reduce) raf = requestAnimationFrame(render);
    }

    function start() {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(render);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function onPointerMove(e: PointerEvent) {
      const rect = cv.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && x <= width && y >= 0 && y <= height;
      pointer.active = inside;
      if (inside) {
        pointer.tx = x;
        pointer.ty = y;
        if (lastPushX < -9000) {
          // first contact — seed so the trail starts at the cursor
          pointer.x = x;
          pointer.y = y;
          lastPushX = x;
          lastPushY = y;
        }
      }
    }
    function onPointerLeave() {
      pointer.active = false;
    }

    resize();

    if (reduce) {
      render(0); // single static frame, ambient only
      const onResizeStatic = () => {
        resize();
        render(0);
      };
      window.addEventListener("resize", onResizeStatic);
      return () => window.removeEventListener("resize", onResizeStatic);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(cv);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
