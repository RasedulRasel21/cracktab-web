"use client";

import { useEffect, useRef } from "react";

/**
 * Small in-app dialog.
 *
 * Replaces window.prompt/confirm/alert, which are not portable: embedded
 * browsers (VS Code's Simple Browser, most webviews) render alert() as a
 * native OS dialog and refuse prompt() outright, and sandboxed iframes block
 * all three. They also can't be styled or tested.
 */
export default function Modal({
  open,
  title,
  description,
  children,
  footer,
  onClose,
  size = "md",
}: {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Pinned below a scrolling body, for dialogs whose content can grow. */
  footer?: React.ReactNode;
  onClose: () => void;
  /** "lg"/"xl" for dialogs that hold a grid, like the media picker. */
  size?: "md" | "lg" | "xl";
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  // Held in a ref so a new inline `onClose` each render doesn't re-run the
  // open effect — which would pull focus back to the first field every time
  // the dialog's contents change.
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);

    // Focus the first control so the dialog is usable from the keyboard
    // immediately, the way a native prompt would be.
    const first = bodyRef.current?.querySelector<HTMLElement>(
      "input:not([type=hidden]):not([type=file]), textarea, button",
    );
    first?.focus();

    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const width = { md: "max-w-md", lg: "max-w-3xl", xl: "max-w-5xl" }[size];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl ${width}`}
      >
        <div
          className={`flex items-start justify-between gap-4 px-6 ${
            footer ? "border-b border-line py-4" : "pt-6"
          }`}
        >
          <div>
            <h2 className="font-display text-base font-semibold tracking-tight text-white">
              {title}
            </h2>
            {description && (
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M2 2l10 10M12 2 2 12" />
            </svg>
          </button>
        </div>

        <div ref={bodyRef} className={`min-h-0 flex-1 overflow-y-auto px-6 ${footer ? "py-5" : "pb-6 pt-5"}`}>
          {children}
        </div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line px-6 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
