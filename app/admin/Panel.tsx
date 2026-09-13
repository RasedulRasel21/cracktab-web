"use client";

import { useSyncExternalStore } from "react";

const EVENT = "cracktab:panels";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

function readOpen(key: string, fallback: boolean): boolean {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value === "1";
  } catch {
    // Private browsing, or storage disabled: fall back to the default.
    return fallback;
  }
}

/**
 * Collapsible sidebar panel, in the shape WordPress uses. Open by default, and
 * remembered per panel on this device.
 *
 * Built on <details> for one reason above the rest: a closed panel keeps its
 * fields in the DOM, so a collapsed SEO panel still submits its values.
 * Rendering the body conditionally instead would silently drop those fields
 * from every save made while it was folded — the most damaging way this
 * component could be written.
 *
 * Consequence to keep in mind: a `required` field inside a closed panel can't
 * be focused by the browser's validation, and the submit fails with no visible
 * error. None of the sidebar fields are required; keep it that way.
 *
 * useSyncExternalStore rather than reading storage in an effect: the server
 * renders the default, the client hydrates with that same value, then picks up
 * the saved preference — no hydration mismatch, no flash of the wrong state.
 */
export default function Panel({
  id,
  title,
  children,
  defaultOpen = true,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const key = `cracktab:panel:${id}`;
  const open = useSyncExternalStore(
    subscribe,
    () => readOpen(key, defaultOpen),
    () => defaultOpen,
  );

  const persist = (next: boolean) => {
    try {
      window.localStorage.setItem(key, next ? "1" : "0");
    } catch {
      // Not persisted this session; the panel still toggles.
    }
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <details
      open={open}
      onToggle={(event) => {
        const next = event.currentTarget.open;
        // Guard against the echo when React itself sets `open`.
        if (next !== open) persist(next);
      }}
      className="group rounded-2xl border border-line bg-surface"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-5 py-4 font-display text-sm font-semibold text-white select-none [&::-webkit-details-marker]:hidden">
        {title}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
          fill="currentColor"
          className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
        >
          <path d="M6 8.5 1.5 4h9L6 8.5Z" />
        </svg>
      </summary>
      <div className="flex flex-col gap-4 border-t border-line px-5 pb-5 pt-4">{children}</div>
    </details>
  );
}
