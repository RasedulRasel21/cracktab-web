"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";

/**
 * Stops someone leaving a form with unsaved changes until they confirm.
 *
 * Two mechanisms, because there are two ways to leave:
 *
 *  • Reload, close the tab, type a new address — the browser's `beforeunload`.
 *    The browser shows its own dialog and will not let a page style it or
 *    choose its wording. That restriction is deliberate, so sites can't trap
 *    visitors behind a fake "are you sure?".
 *  • Clicking a link inside the studio — client-side navigation, which never
 *    fires `beforeunload`. Those clicks are intercepted at the document and
 *    answered with the studio's own dialog. Next's `onNavigate` can't do this
 *    alone: it is per-Link, and the studio's links live in server layouts.
 *
 * Not covered: the browser's Back button during client-side navigation, which
 * App Router offers no way to cancel.
 */
export default function UnsavedGuard({ isDirty }: { isDirty: () => boolean }) {
  const router = useRouter();
  const [target, setTarget] = useState<string | null>(null);
  const leaving = useRef(false);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (leaving.current || !isDirty()) return;
      event.preventDefault();
      // Some browsers still need this set before they'll show the prompt.
      event.returnValue = "";
    };

    const onClick = (event: MouseEvent) => {
      if (leaving.current || !isDirty()) return;

      // Modified clicks open a new tab or window and lose nothing here.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      // Another site means a full page load, which beforeunload already covers.
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setTarget(`${url.pathname}${url.search}${url.hash}`);
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    // Capture phase, so this runs before next/link's own click handling.
    document.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [isDirty]);

  return (
    <Modal
      open={target !== null}
      title="Leave without saving?"
      description="Your changes to this post haven't been saved. If you leave now, they'll be lost."
      onClose={() => setTarget(null)}
    >
      <div className="flex flex-wrap justify-end gap-3">
        {/* The safe choice comes first, so it's the one that takes focus. */}
        <button
          type="button"
          onClick={() => setTarget(null)}
          className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-5 font-display text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong"
        >
          Keep editing
        </button>
        <button
          type="button"
          onClick={() => {
            const destination = target;
            leaving.current = true;
            setTarget(null);
            if (destination) router.push(destination);
          }}
          className="studio-danger inline-flex h-10 items-center justify-center rounded-full border border-line px-5 font-display text-xs font-semibold uppercase tracking-wide transition-colors"
        >
          Leave anyway
        </button>
      </div>
    </Modal>
  );
}
