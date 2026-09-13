"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useFormSubmit } from "../components/useFormSubmit";
import { MAX_TAGS, parseTags } from "../lib/tags";
import Editor from "./Editor";
import MediaPicker from "./MediaPicker";
import Panel from "./Panel";
import { SearchPreview, SeoChecklist } from "./SeoPanel";
import UnsavedGuard from "./UnsavedGuard";
import type { PostFormState } from "./actions";
import type { SeoFields } from "./seoChecks";

type Category = { id: string; name: string };

export type PostDefaults = {
  title: string;
  slug: string;
  excerpt: string;
  bodyHtml: string;
  coverUrl: string | null;
  coverAlt: string | null;
  categoryId: string | null;
  tags: string;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  noindex: boolean;
  isPublished: boolean;
  /** ISO timestamp, or null when the post has never had a date. */
  publishedAt: string | null;
};

const empty: PostDefaults = {
  title: "",
  slug: "",
  excerpt: "",
  bodyHtml: "",
  coverUrl: null,
  coverAlt: null,
  categoryId: null,
  tags: "",
  metaTitle: null,
  metaDescription: null,
  canonicalUrl: null,
  noindex: false,
  isPublished: false,
  publishedAt: null,
};

const field =
  "h-11 w-full rounded-xl border border-line bg-black px-4 text-sm text-white outline-none transition-colors focus:border-accent";
const labelText = "text-xs font-medium uppercase tracking-[0.15em] text-muted";

/** The fields compared to decide whether the form differs from what loaded. */
const TRACKED = [
  "title",
  "bodyHtml",
  "excerpt",
  "slug",
  "coverUrl",
  "coverAlt",
  "categoryId",
  "tags",
  "publishAt",
  "metaTitle",
  "metaDescription",
  "canonicalUrl",
  "noindex",
] as const;

/** Tiptap mounts after first paint; the body field settles a moment later. */
const SETTLE_MS = 600;

function snapshot(form: HTMLFormElement): string {
  const data = new FormData(form);
  return JSON.stringify(TRACKED.map((name) => String(data.get(name) ?? "")));
}

function readSeoFields(form: HTMLFormElement): SeoFields {
  const data = new FormData(form);
  const get = (name: keyof SeoFields) => String(data.get(name) ?? "");
  return {
    title: get("title"),
    metaTitle: get("metaTitle"),
    metaDescription: get("metaDescription"),
    excerpt: get("excerpt"),
    slug: get("slug"),
    bodyHtml: get("bodyHtml"),
    coverUrl: get("coverUrl"),
    coverAlt: get("coverAlt"),
    categoryId: get("categoryId"),
    tags: get("tags"),
  };
}

const sameFields = (a: SeoFields, b: SeoFields) =>
  (Object.keys(a) as (keyof SeoFields)[]).every((key) => a[key] === b[key]);

/** "2026-09-13T14:30" in the browser's own timezone, for datetime-local. */
function toLocalInput(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function localToIso(local: string): string {
  const date = new Date(local);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

const scheduleFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const noopSubscribe = () => () => {};

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
  tagSuggestions = [],
  links,
  defaults = empty,
}: {
  action: (prev: PostFormState, formData: FormData) => Promise<PostFormState>;
  categories: Category[];
  /** Every existing tag name, offered as the author types. */
  tagSuggestions?: string[];
  /** Present once the post exists. */
  links?: { preview: string; revisions: string; revisionCount: number };
  defaults?: PostDefaults;
}) {
  const [state, onSubmit, pending] = useFormSubmit<PostFormState>(action, { error: null });

  // The browser's timezone only exists on the client, so anything derived from
  // it waits for hydration instead of rendering the server's zone first.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const [cover, setCover] = useState(defaults.coverUrl);
  const [coverAlt, setCoverAlt] = useState(defaults.coverAlt ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [metaTitle, setMetaTitle] = useState(defaults.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(defaults.metaDescription ?? "");
  const [tags, setTags] = useState(defaults.tags);

  /** null until the author touches the date — until then the saved date stands. */
  const [publishLocal, setPublishLocal] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const [seo, setSeo] = useState<SeoFields>(() => ({
    title: defaults.title,
    metaTitle: defaults.metaTitle ?? "",
    metaDescription: defaults.metaDescription ?? "",
    excerpt: defaults.excerpt,
    slug: defaults.slug,
    bodyHtml: defaults.bodyHtml,
    coverUrl: defaults.coverUrl ?? "",
    coverAlt: defaults.coverAlt ?? "",
    categoryId: defaults.categoryId ?? "",
    tags: defaults.tags,
  }));

  const formRef = useRef<HTMLFormElement>(null);
  const baseline = useRef<string | null>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    // Taken once the editor has loaded its content, so the editor's own
    // initialisation isn't mistaken for an edit.
    const settle = window.setTimeout(() => {
      baseline.current = snapshot(form);
    }, SETTLE_MS);

    return () => window.clearTimeout(settle);
  }, []);

  const refreshSeo = useCallback(() => {
    const form = formRef.current;
    if (!form) return;
    const next = readSeoFields(form);
    setSeo((current) => (sameFields(current, next) ? current : next));
  }, []);

  // The body reaches the form through a hidden input React updates, which
  // fires no input event — so the live panels also re-read on a slow tick.
  useEffect(() => {
    const tick = window.setInterval(() => {
      refreshSeo();
      setNow(Date.now());
    }, 1000);
    return () => window.clearInterval(tick);
  }, [refreshSeo]);

  /**
   * Compared at the moment of leaving rather than tracked as a flag: a change
   * made a second ago still counts, and an edit undone back to exactly what
   * was loaded doesn't trigger a pointless warning.
   */
  const isDirty = useCallback(() => {
    const form = formRef.current;
    return Boolean(form && baseline.current !== null && snapshot(form) !== baseline.current);
  }, []);

  // ---- schedule
  const publishAtIso =
    publishLocal === null ? (defaults.publishedAt ?? "") : publishLocal ? localToIso(publishLocal) : "";
  const shownLocal =
    publishLocal ?? (mounted && defaults.publishedAt ? toLocalInput(defaults.publishedAt) : "");
  const scheduledFor =
    mounted && publishAtIso && Date.parse(publishAtIso) > now ? new Date(publishAtIso) : null;

  // ---- tags
  const parsedTags = parseTags(tags);
  const lastComma = tags.lastIndexOf(",");
  const typing = tags.slice(lastComma + 1).trim().toLowerCase();
  const taken = new Set(parsedTags.map((tag) => tag.name.toLowerCase()));
  const suggestions = typing
    ? tagSuggestions
        .filter((name) => name.toLowerCase().includes(typing) && !taken.has(name.toLowerCase()))
        .slice(0, 6)
    : [];

  function acceptSuggestion(name: string) {
    const before = lastComma === -1 ? "" : `${tags.slice(0, lastComma + 1)} `;
    setTags(`${before}${name}, `.replace(/^\s+/, ""));
  }

  const publishLabel = pending
    ? "Saving…"
    : scheduledFor
      ? "Schedule"
      : defaults.isPublished
        ? "Update"
        : "Publish";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onInput={() => window.setTimeout(refreshSeo, 50)}
      onChange={() => window.setTimeout(refreshSeo, 50)}
      className="grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]"
    >
      <UnsavedGuard isDirty={isDirty} />

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
      <div className="flex flex-col gap-4 lg:self-start">
        <Panel id="publish" title="Publish">
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              name="publish"
              value="true"
              disabled={pending}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-accent px-5 font-display text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-60"
            >
              {publishLabel}
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

          <label className="flex flex-col gap-2">
            <span className="flex items-center justify-between">
              <span className={labelText}>Publish date</span>
              {shownLocal && (
                <button
                  type="button"
                  onClick={() => setPublishLocal("")}
                  className="text-xs text-muted underline underline-offset-2 hover:text-white"
                >
                  Clear
                </button>
              )}
            </span>
            {/* No name: the browser sends a zone-less value the server would
                read as UTC. The hidden field carries the real instant. */}
            <input
              type="datetime-local"
              value={shownLocal}
              onChange={(event) => setPublishLocal(event.target.value)}
              className={field}
            />
            <input type="hidden" name="publishAt" value={publishAtIso} />
          </label>

          <p className="text-xs leading-relaxed text-muted">
            {scheduledFor ? (
              <>
                Goes live {scheduleFormat.format(scheduledFor)}. Blog pages refresh
                hourly, so it can take up to an hour after that to appear.
              </>
            ) : (
              <>
                Leave empty to publish now. A future date schedules the post; a
                past one backdates it.
              </>
            )}
          </p>

          {links && (
            <div className="flex flex-wrap items-center gap-4 border-t border-line pt-4">
              <Link
                href={links.preview}
                target="_blank"
                className="text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:text-accent"
                title="Shows the last saved version"
              >
                Preview ↗
              </Link>
              <Link
                href={links.revisions}
                className="text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:text-accent"
              >
                History ({links.revisionCount})
              </Link>
            </div>
          )}
        </Panel>

        <Panel id="cover" title="Cover image">
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

          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="inline-flex h-10 items-center justify-center rounded-full border border-line px-4 font-display text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:border-accent hover:text-accent"
          >
            {cover ? "Replace image" : "Choose image"}
          </button>

          {cover && (
            <button
              type="button"
              onClick={() => setCover(null)}
              className="self-start text-xs text-muted underline underline-offset-2 hover:text-white"
            >
              Remove cover
            </button>
          )}

          <label className="flex flex-col gap-2">
            <span className={labelText}>Alt text</span>
            <input
              name="coverAlt"
              value={coverAlt}
              onChange={(event) => setCoverAlt(event.target.value)}
              placeholder="What the image shows"
              className={field}
            />
          </label>

          <MediaPicker
            open={pickerOpen}
            title="Cover image"
            folder="covers"
            onClose={() => setPickerOpen(false)}
            onSelect={([item]) => {
              if (!item) return;
              setCover(item.url);
              // Carry the library's description over, but never overwrite one
              // the author has already written.
              if (!coverAlt.trim() && item.alt) setCoverAlt(item.alt);
            }}
          />
        </Panel>

        <Panel id="details" title="Details">
          <label className="flex flex-col gap-2">
            <span className={labelText}>Category</span>
            <select name="categoryId" defaultValue={defaults.categoryId ?? ""} className={field}>
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-2">
            <label htmlFor="post-tags" className="flex items-center justify-between">
              <span className={labelText}>Tags</span>
              <span className={`text-xs ${parsedTags.length >= MAX_TAGS ? "text-amber-400" : "text-muted"}`}>
                {parsedTags.length}/{MAX_TAGS}
              </span>
            </label>
            <input
              id="post-tags"
              name="tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              onKeyDown={(event) => {
                // Enter picks the top suggestion instead of submitting the post.
                if (event.key !== "Enter") return;
                event.preventDefault();
                if (suggestions[0]) acceptSuggestion(suggestions[0]);
              }}
              placeholder="shopify, performance, seo"
              autoComplete="off"
              className={field}
            />
            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5" aria-label="Existing tags">
                {suggestions.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => acceptSuggestion(name)}
                    className="rounded-full border border-line px-2.5 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    + {name}
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-muted">
              Separate with commas. Existing tags are suggested as you type.
            </p>
          </div>

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
        </Panel>

        <Panel id="seo" title="SEO">
          <SearchPreview fields={seo} />

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
              className="h-4 w-4 accent-accent"
            />
            <span className="text-sm text-white">Hide from search engines</span>
          </label>
        </Panel>

        <Panel id="seo-checklist" title="SEO checklist">
          <SeoChecklist fields={seo} />
        </Panel>
      </div>
    </form>
  );
}
