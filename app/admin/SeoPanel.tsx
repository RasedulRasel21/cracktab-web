"use client";

import { DESCRIPTION_LIMIT, TITLE_LIMIT, runSeoChecks, type SeoFields } from "./seoChecks";
import { slugify } from "../lib/text";

const ICON = { pass: "✓", warn: "!", fail: "✕" } as const;
const TONE = {
  pass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warn: "border-amber-200 bg-amber-50 text-amber-700",
  fail: "border-rose-200 bg-rose-50 text-rose-700",
} as const;

/** Clip with an ellipsis, the way a results page does. */
function clip(text: string, limit: number) {
  return text.length > limit ? `${text.slice(0, limit - 1).trimEnd()}…` : text;
}

/**
 * Roughly how the post will look as a Google result. Approximate by design:
 * Google trims by pixel width, not characters, and sometimes rewrites titles.
 */
export function SearchPreview({ fields }: { fields: SeoFields }) {
  const slug = fields.slug.trim() || slugify(fields.title) || "your-post";
  // The site's title template appends " · Cracktab", so that's what Google sees.
  const base = (fields.metaTitle || fields.title).trim() || "Post title";
  const title = clip(`${base} · Cracktab`, TITLE_LIMIT + 4);
  const description = (fields.metaDescription || fields.excerpt).trim();

  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted">
        Google preview
      </p>
      <div className="mt-3" style={{ fontFamily: "Arial, sans-serif" }}>
        <p className="truncate text-xs text-[#4d5156]">cracktab.com › blog › {slug}</p>
        <p className="mt-1 text-lg leading-snug text-[#1a0dab]">{title}</p>
        <p className="mt-1 text-[0.8rem] leading-relaxed text-[#4d5156]">
          {description
            ? clip(description, DESCRIPTION_LIMIT)
            : "Google will pick text from the page itself — write an excerpt or meta description to choose it."}
        </p>
      </div>
      <p className="mt-3 text-[0.65rem] text-muted">
        Approximate — Google trims by pixel width and may rewrite titles.
      </p>
    </div>
  );
}

export function SeoChecklist({ fields }: { fields: SeoFields }) {
  const checks = runSeoChecks(fields);
  const passing = checks.filter((check) => check.status === "pass").length;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold text-white">
        {passing} of {checks.length} checks passing
      </p>
      <ul className="flex flex-col gap-2.5">
        {checks.map((check) => (
          <li key={check.id} className="flex gap-2.5">
            <span
              aria-hidden="true"
              className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[0.6rem] font-bold ${TONE[check.status]}`}
            >
              {ICON[check.status]}
            </span>
            <span className="text-xs leading-relaxed">
              <span className="font-semibold text-white">{check.label}.</span>{" "}
              <span className="text-muted">{check.detail}</span>
              <span className="sr-only"> ({check.status})</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
