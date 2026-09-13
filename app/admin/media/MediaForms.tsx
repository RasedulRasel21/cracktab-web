"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useFormSubmit } from "../../components/useFormSubmit";
import ConfirmButton from "../ConfirmButton";
import { uploadImage } from "../upload";
import { deleteMedia, updateMediaAlt, type AltFormState } from "./actions";

export function MediaUpload() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    setBusy(true);
    setError(null);
    try {
      for (const file of files) await uploadImage(file, "body");
      startTransition(() => router.refresh());
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={busy}
        className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 font-display text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-60"
      >
        {busy ? "Uploading…" : "Upload images"}
      </button>
      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onChange} />
      {error && (
        <p role="alert" className="text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export function AltForm({
  mediaId,
  alt,
  canEdit,
}: {
  mediaId: string;
  alt: string;
  canEdit: boolean;
}) {
  const [state, onSubmit, pending] = useFormSubmit<AltFormState>(
    updateMediaAlt.bind(null, mediaId),
    { error: null, saved: 0 },
  );
  const saved = state.saved > 0 && !state.error;

  if (!canEdit) {
    return <p className="truncate text-xs text-muted">{alt || "No description"}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-1.5">
      <div className="flex gap-1.5">
        <input
          name="alt"
          defaultValue={alt}
          maxLength={250}
          placeholder="Describe the image"
          aria-label="Alt text"
          className="h-9 min-w-0 flex-1 rounded-lg border border-line bg-black px-2.5 text-xs text-white outline-none transition-colors focus:border-accent"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-9 shrink-0 items-center rounded-lg border border-line px-2.5 text-[0.65rem] font-semibold uppercase tracking-wide text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
        >
          {pending ? "…" : "Save"}
        </button>
      </div>
      {state.error ? (
        <p role="alert" className="text-[0.7rem] text-red-300">
          {state.error}
        </p>
      ) : saved && !pending ? (
        <p className="text-[0.7rem] text-accent">Saved.</p>
      ) : null}
    </form>
  );
}

export function DeleteMediaButton({ mediaId, back }: { mediaId: string; back: string }) {
  return (
    <ConfirmButton
      action={deleteMedia}
      hidden={{ mediaId, back }}
      label="Delete"
      title="Delete this image?"
      description="It's removed from storage permanently. This can't be undone."
      confirmLabel="Delete image"
    />
  );
}
