"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CALENDLY_URL } from "../lib/site";

/**
 * "Book a Call" trigger that opens Calendly in an on-site modal instead of
 * sending the visitor off to calendly.com.
 *
 * Still renders a real <a href> so middle-click / cmd-click / no-JS all keep
 * working — the modal only takes over a plain left click.
 */
export default function BookCallButton({
  className,
  children = "Book a Call",
  onClick,
}: {
  className?: string;
  children?: React.ReactNode;
  /** Extra work for the call site — e.g. closing the menu drawer. */
  onClick?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");
  const [loaded, setLoaded] = useState(false);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const openModal = () => {
    // Calendly's embed view — drops their page chrome and themes the widget.
    // `embed_domain` is what tells Calendly it's running embedded.
    const params = new URLSearchParams({
      embed_domain: window.location.hostname,
      embed_type: "Inline",
      hide_gdpr_banner: "1",
      background_color: "0b0b0d",
      text_color: "ffffff",
      primary_color: "b4f03a",
    });
    setSrc(`${CALENDLY_URL}?${params.toString()}`);
    setLoaded(false);
    setOpen(true);
    onClick?.();
  };

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Lock body scroll + close on Escape while the modal is up.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <a
        ref={triggerRef}
        href={CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-haspopup="dialog"
        onClick={(e) => {
          // Let the browser handle new-tab/new-window intents normally.
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          e.preventDefault();
          openModal();
        }}
        className={className}
      >
        {children}
      </a>

      {/* Portaled to <body>: the header is fixed and the menu drawer is
          translated, and a transformed ancestor would capture position:fixed.
          `open` only ever flips from a click, so this never runs on the server. */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
            <div
              onClick={close}
              aria-hidden="true"
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <div
              role="dialog"
              aria-modal="true"
              aria-label="Book a call"
              className="relative flex h-[min(88dvh,54rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-line bg-surface"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <span className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Book a call
                </span>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-white transition-colors hover:border-accent hover:text-accent"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M2 2l12 12M14 2L2 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="relative flex-1 bg-surface">
                {!loaded && (
                  <span className="absolute inset-0 flex items-center justify-center text-sm text-muted">
                    Loading calendar…
                  </span>
                )}
                <iframe
                  src={src}
                  title="Book a call with Cracktab"
                  onLoad={() => setLoaded(true)}
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
