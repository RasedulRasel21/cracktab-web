"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Click-to-play video: a YouTube embed or a self-hosted file. Nothing loads
 * until the visitor presses play, so the video costs the page no weight up
 * front.
 *
 * The thumbnail is a local file (optional), not i.ytimg.com. A self-hosted
 * file is covered by the CSP's media-src 'self'; a YouTube id needs
 * https://www.youtube-nocookie.com added to frame-src in next.config.ts.
 */
export default function VideoEmbed({
  videoId,
  file,
  title,
  poster,
}: {
  videoId?: string;
  file?: { src: string; captions?: string };
  title: string;
  poster?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-surface">
      {playing && file ? (
        <video controls autoPlay playsInline poster={poster} className="absolute inset-0 h-full w-full">
          <source src={file.src} type="video/mp4" />
          {file.captions && (
            <track kind="captions" src={file.captions} srcLang="en" label="English" default />
          )}
        </video>
      ) : playing && videoId ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 flex items-center justify-center"
        >
          {poster && (
            <Image src={poster} alt="" fill sizes="(min-width: 1024px) 64rem, 100vw" className="object-cover" />
          )}
          <span className="relative inline-flex h-18 w-18 items-center justify-center rounded-full bg-accent text-accent-ink transition-transform duration-300 group-hover:scale-105">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
