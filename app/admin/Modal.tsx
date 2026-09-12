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
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    // Focus the first control so the dialog is usable from the keyboard
    // immediately, the way a native prompt would be.
    const first = panelRef.current?.querySelector<HTMLElement>(
      "input, textarea, button",
    );
    first?.focus();

    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl"
      >
        <h2 className="font-display text-base font-semibold tracking-tight text-white">
          {title}
        </h2>
        {description && (
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">
            {description}
          </p>
        )}
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
