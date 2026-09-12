"use client";

import { useState } from "react";
import Modal from "./Modal";

/**
 * A submit button that asks first, using an in-app dialog rather than
 * window.confirm — which embedded browsers and sandboxed iframes refuse.
 *
 * The form is submitted programmatically on confirm, so this works with Server
 * Actions exactly as a plain submit button would.
 */
export default function ConfirmButton({
  action,
  hidden,
  label,
  title,
  description,
  confirmLabel = "Delete",
  destructive = true,
  className,
}: {
  /** The Server Action the form posts to. */
  action: (formData: FormData) => void | Promise<void>;
  /** Hidden fields the action needs, e.g. `{ postId: "..." }`. */
  hidden: Record<string, string>;
  label: string;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "studio-danger text-xs font-semibold uppercase tracking-wider transition-colors"
        }
      >
        {label}
      </button>

      <Modal
        open={open}
        title={title}
        description={description}
        onClose={() => setOpen(false)}
      >
        <form
          action={action}
          onSubmit={() => setPending(true)}
          className="flex flex-wrap justify-end gap-3"
        >
          {Object.entries(hidden).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 items-center justify-center rounded-full border border-line px-5 font-display text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:border-accent hover:text-accent"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className={`inline-flex h-10 items-center justify-center rounded-full px-5 font-display text-xs font-semibold uppercase tracking-wide transition-colors disabled:opacity-60 ${
              destructive
                ? "bg-red-500 text-white hover:bg-red-400"
                : "bg-accent text-accent-ink hover:bg-accent-strong"
            }`}
          >
            {pending ? "Working…" : confirmLabel}
          </button>
        </form>
      </Modal>
    </>
  );
}
