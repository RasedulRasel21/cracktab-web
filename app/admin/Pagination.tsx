import Link from "next/link";

/**
 * Page numbers around the current page plus both ends — "1 … 4 5 6 … 20" —
 * so any page is two clicks away without rendering every number.
 */
function pageWindow(current: number, total: number): (number | "gap")[] {
  const wanted = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const out: (number | "gap")[] = [];
  wanted.forEach((n, i) => {
    if (i > 0 && n - wanted[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

/** Shared by the studio's post and category lists. */
export default function Pagination({
  page,
  pageCount,
  hrefFor,
  label = "Pagination",
}: {
  page: number;
  pageCount: number;
  /** Builds the URL for a page, carrying the current filters along. */
  hrefFor: (page: number) => string;
  label?: string;
}) {
  if (pageCount <= 1) return null;

  const base =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-xs font-semibold transition-colors";
  const idle = "border-line text-muted hover:border-accent hover:text-accent";

  return (
    <nav aria-label={label} className="mt-8 flex flex-wrap items-center justify-between gap-4">
      <span className="text-xs text-muted">
        Page {page} of {pageCount}
      </span>

      <div className="flex flex-wrap items-center gap-1.5">
        {page > 1 && (
          <Link href={hrefFor(page - 1)} rel="prev" className={`${base} ${idle}`}>
            ← Prev
          </Link>
        )}

        {pageWindow(page, pageCount).map((n, i) =>
          n === "gap" ? (
            <span key={`gap-${i}`} aria-hidden="true" className="px-1 text-xs text-muted">
              …
            </span>
          ) : (
            <Link
              key={n}
              href={hrefFor(n)}
              aria-current={n === page ? "page" : undefined}
              className={`${base} ${
                n === page ? "border-accent bg-accent text-accent-ink" : idle
              }`}
            >
              {n}
            </Link>
          ),
        )}

        {page < pageCount && (
          <Link href={hrefFor(page + 1)} rel="next" className={`${base} ${idle}`}>
            Next →
          </Link>
        )}
      </div>
    </nav>
  );
}
