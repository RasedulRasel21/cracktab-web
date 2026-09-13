"use client";

import { useFormSubmit } from "../../components/useFormSubmit";
import type { CategoryFormState } from "./actions";

const field =
  "h-11 w-full rounded-xl border border-line bg-black px-4 text-sm text-white outline-none transition-colors focus:border-accent";
const labelText = "text-xs font-medium uppercase tracking-[0.15em] text-muted";

export type CategoryDefaults = {
  name: string;
  slug: string;
  description: string;
  parentId: string;
};

export default function CategoryForm({
  action,
  parents,
  defaults,
  submitLabel,
}: {
  action: (prev: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  /** Every category that may legally be the parent — already excludes this
   *  category and its descendants when editing. */
  parents: { id: string; label: string }[];
  defaults?: CategoryDefaults;
  submitLabel: string;
}) {
  // Not <form action>: React would clear the fields after an error.
  const [state, onSubmit, pending] = useFormSubmit<CategoryFormState>(action, { error: null });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className={labelText}>Name</span>
        <input
          name="name"
          required
          defaultValue={defaults?.name}
          placeholder="Migrations"
          className={field}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelText}>Parent</span>
        <select name="parentId" defaultValue={defaults?.parentId ?? ""} className={field}>
          <option value="">Top level</option>
          {parents.map((parent) => (
            <option key={parent.id} value={parent.id}>
              {parent.label}
            </option>
          ))}
        </select>
        <span className="text-xs text-muted">
          A parent&apos;s archive also lists everything filed in its
          subcategories.
        </span>
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelText}>URL slug</span>
        <input
          name="slug"
          defaultValue={defaults?.slug}
          placeholder="Left blank, built from the name"
          className={field}
        />
        <span className="text-xs text-muted">
          Every category has a flat URL: /blog/category/&lt;slug&gt;
        </span>
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelText}>Description</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaults?.description}
          placeholder="Shown on the archive page and used as its meta description."
          className="w-full rounded-xl border border-line bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
        />
      </label>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 font-display text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
