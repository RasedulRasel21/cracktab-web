"use client";

import { useEffect, useRef } from "react";

/**
 * Muted looping video that starts as soon as it nears the viewport and
 * pauses when off screen. The file is fully preloaded (it is small) so the
 * first play has no buffering pause, and H.264 decodes in hardware for a
 * smooth loop.
 */
export default function AutoVideo({
  src,
  poster,
  label,
  className = "",
}: {
  src: string;
  poster?: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const play = () => {
      const p = v.play();
      if (p) p.catch(() => {});
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) play();
        else v.pause();
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(v);
    // Restart quickly if the browser stalls on a loop.
    const onStall = () => {
      if (!v.paused) return;
      play();
    };
    v.addEventListener("stalled", onStall);
    return () => {
      io.disconnect();
      v.removeEventListener("stalled", onStall);
    };
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      poster={poster}
      aria-label={label}
      disablePictureInPicture
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
