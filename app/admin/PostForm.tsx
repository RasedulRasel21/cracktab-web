"use client";

import { useActionState, useState } from "react";
import Editor, { uploadImage } from "./Editor";
import type { PostFormState } from "./actions";

type Category = { id: string; name: string };

export type PostDefaults = {
  title: string;
  slug: string;
  excerpt: string;
  bodyHtml: string;
  coverUrl: string | null;
  coverAlt: string | null;
  categoryId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  noindex: boolean;
  isPublished: boolean;
};

const empty: PostDefaults = {
  title: "",
  slug: "",
  excerpt: "",
  bodyHtml: "",
  coverUrl: null,
  coverAlt: null,
  categoryId: null,
  metaTitle: null,
  metaDescription: null,
  canonicalUrl: null,
  noindex: false,
  isPublished: false,
};

const field =
  "h-11 w-full rounded-xl border border-line bg-black px-4 text-sm text-white outline-none transition-colors focus:border-accent";
const labelText = "text-xs font-medium uppercase tracking-[0.15em] text-muted";

/** Google truncates around these lengths, so the counter turns amber early. */
function Counter({ value, limit }: { value: string; limit: number }) {
  const over = value.length > limit;
  return (
    <span className={`text-xs ${over ? "text-amber-400" : "text-muted"}`}>
      {value.length}/{limit}
    </span>
  );
}

export default function PostForm({
  action,
  categories,
  defaults = empty,
}: {
  action: (prev: PostFormState, formData: FormData) => Promise<PostFormState>;
  categories: Category[];
  defaults?: PostDefaults;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  const [cover, setCover] = useState(defaults.coverUrl);
  const [coverBusy, setCoverBusy] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [metaTitle, setMetaTitle] = useState(defaults.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(defaults.metaDescription ?? "");

  async function onCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setCoverBusy(true);
    setCoverError(null);
    try {
      setCover(await uploadImage(file, "covers"));
    } catch (error) {
      // Inline, not window.alert: a native dialog is unstyled, blocks the
      // page, and isn't shown at all inside an embedded browser.
      setCoverError(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setCoverBusy(false);
    }
  }

  return (
    <form action={formAction} className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
      {/* ---- main column ---- */}
      <div className="flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className={labelText}>Title</span>
          <input
            name="title"
            required
            defaultValue={defaults.title}
            placeholder="How we cut a Shopify store's load time by 60%"
            className={`${field} font-display text-base`}
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className={labelText}>Body</span>
          <Editor name="bodyHtml" defaultValue={defaults.bodyHtml} />
        </div>

        {state.error && (
          <p
            role="alert"
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
          >
            {state.error}
          </p>
        )}
      </div>

      {/* ---- sidebar ---- */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
          <span className="font-display text-sm font-semibold text-white">Publish</span>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              name="publish"
              value="true"
              disabled={pending}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-accent px-5 font-display text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-60"
            >
              {pending ? "Saving…" : defaults.isPublished ? "Update" : "Publish"}
            </button>
            <button
              type="submit"
              name="publish"
              value="false"
              disabled={pending}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-line px-5 font-display text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:border-accent hover:text-accent disabled:opacity-60"
            >
              Save draft
            </button>
          </div>

          <p className="text-xs leading-relaxed text-muted">
            Published posts appear on the blog straight away — the pages are
            refreshed as soon as you save.
          </p>
        </div>

        {/* cover */}
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
          <span className="font-display text-sm font-semibold text-white">Cover image</span>

          {cover && (
            // Not next/image: the Blob URL is only known at runtime and this is
            // a private admin screen, so optimisation buys nothing here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt=""
              className="aspect-16/10 w-full rounded-xl border border-line object-cover"
            />
          )}

          <input type="hidden" name="coverUrl" value={cover ?? ""} />

          <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-line px-4 font-display text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:border-accent hover:text-accent">
            {coverBusy ? "Uploading…" : cover ? "Replace" : "Upload"}
            <input type="file" accept="image/*" hidden onChange={onCoverChange} />
          </label>

          {cover && (
            <button
              type="button"
              onClick={() => setCover(null)}
              className="text-xs text-muted underline underline-offset-2 hover:text-white"
            >
              Remove cover
            </button>
          )}

          {coverError && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200"
            >
              {coverError}
            </p>
          )}

          <label className="flex flex-col gap-2">
            <span className={labelText}>Alt text</span>
            <input
              name="coverAlt"
              defaultValue={defaults.coverAlt ?? ""}
              placeholder="What the image shows"
              className={field}
            />
          </label>
        </div>

        {/* details */}
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5">
          <span className="font-display text-sm font-semibold text-white">Details</span>

          <label className="flex flex-col gap-2">
            <span className={labelText}>Category</span>
            <select
              name="categoryId"
              defaultValue={defaults.categoryId ?? ""}
              className={field}
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className={labelText}>URL slug</span>
            <input
              name="slug"
              defaultValue={defaults.slug}
              placeholder="Left blank, built from the title"
              className={field}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className={labelText}>Excerpt</span>
            <textarea
              name="excerpt"
              rows={3}
              defaultValue={defaults.excerpt}
              placeholder="Shown on cards and used as the meta description if you leave that blank."
              className="w-full rounded-xl border border-line bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
            />
          </label>
        </div>

        {/* seo */}
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5">
          <span className="font-display text-sm font-semibold text-white">SEO</span>
          <p className="text-xs leading-relaxed text-muted">
            All optional. Left blank, each falls back to the post&apos;s own
            title, excerpt and cover.
          </p>

          <label className="flex flex-col gap-2">
            <span className="flex items-center justify-between">
              <span className={labelText}>Meta title</span>
              <Counter value={metaTitle} limit={70} />
            </span>
            <input
              name="metaTitle"
              value={metaTitle}
              onChange={(event) => setMetaTitle(event.target.value)}
              className={field}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="flex items-center justify-between">
              <span className={labelText}>Meta description</span>
              <Counter value={metaDescription} limit={160} />
            </span>
            <textarea
              name="metaDescription"
              rows={3}
              value={metaDescription}
              onChange={(event) => setMetaDescription(event.target.value)}
              className="w-full rounded-xl border border-line bg-black px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className={labelText}>Canonical URL</span>
            <input
              name="canonicalUrl"
              type="url"
              defaultValue={defaults.canonicalUrl ?? ""}
              placeholder="Only if published elsewhere first"
              className={field}
            />
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="noindex"
              defaultChecked={defaults.noindex}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            <span className="text-sm text-white">Hide from search engines</span>
          </label>
        </div>
      </div>
    </form>
  );
}
