import Link from "next/link";
import PostCard from "./PostCard";
import type { PostCard as Post } from "../lib/blog";
import type { CategoryNode } from "../lib/categories";

/**
 * The listing body shared by /blog and the category archives, including their
 * paginated pages.
 *
 * Pagination is path-based (`/blog/page/2`), not `?page=2`, for two reasons:
 * reading searchParams opts a route out of static rendering, which would put a
 * database query on every visit to a shared 1 GB droplet; and distinct paths
 * are cleaner for crawlers than query strings.
 */
export default function BlogListing({
  posts,
  categories,
  activeSlug,
  activeAncestors = [],
  page,
  pageCount,
  basePath,
}: {
  posts: Post[];
  categories: CategoryNode[];
  /** Slug of the category being viewed, or null on /blog. */
  activeSlug: string | null;
  /** Slugs of the active category's parents, so its branch stays open. */
  activeAncestors?: string[];
  page: number;
  pageCount: number;
  /** "/blog" or "/blog/category/<slug>" — page 2 is `${basePath}/page/2`. */
  basePath: string;
}) {
  const href = (n: number) => (n === 1 ? basePath : `${basePath}/page/${n}`);

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? "border-accent bg-accent text-accent-ink"
        : "border-line text-white/80 hover:border-accent hover:text-accent"
    }`;

  // Children are only shown for the branch being viewed. Rendering every
  // subcategory at once turns the nav into a wall of chips.
  const openBranch = (node: CategoryNode) =>
    node.slug === activeSlug || activeAncestors.includes(node.slug);

  return (
    <section className="pb-20 sm:pb-28">
      <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
        {categories.length > 0 && (
          <nav aria-label="Post categories" className="mb-10 flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/blog"
                aria-current={activeSlug === null ? "page" : undefined}
                className={chip(activeSlug === null)}
              >
                All
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/blog/category/${category.slug}`}
                  aria-current={category.slug === activeSlug ? "page" : undefined}
                  className={chip(category.slug === activeSlug)}
                >
                  {category.name}
                  <span className="ml-2 text-xs opacity-60">{category.postCount}</span>
                </Link>
              ))}
            </div>

            {categories.filter(openBranch).map((parent) =>
              parent.children.length > 0 ? (
                <div key={parent.slug} className="flex flex-wrap gap-2 pl-1">
                  {parent.children.map((child) => (
                    <Link
                      key={child.slug}
                      href={`/blog/category/${child.slug}`}
                      aria-current={child.slug === activeSlug ? "page" : undefined}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        child.slug === activeSlug
                          ? "border-accent bg-accent/15 text-accent"
                          : "border-line text-muted hover:border-accent hover:text-accent"
                      }`}
                    >
                      {child.name}
                      <span className="ml-1.5 opacity-60">{child.postCount}</span>
                    </Link>
                  ))}
                </div>
              ) : null,
            )}
          </nav>
        )}

        {posts.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-8 text-sm text-muted">
            No posts published yet — the first ones are on their way.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} priority={i < 3} />
            ))}
          </div>
        )}

        {pageCount > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-14 flex flex-wrap items-center justify-center gap-2"
          >
            {page > 1 && (
              <Link
                href={href(page - 1)}
                rel="prev"
                className="inline-flex h-10 items-center justify-center rounded-full border border-line px-4 font-display text-sm font-semibold text-white/80 transition-colors hover:border-accent hover:text-accent"
              >
                Previous
              </Link>
            )}

            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={href(n)}
                aria-current={n === page ? "page" : undefined}
                className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 font-display text-sm font-semibold transition-colors ${
                  n === page
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-line text-white/80 hover:border-accent hover:text-accent"
                }`}
              >
                {n}
              </Link>
            ))}

            {page < pageCount && (
              <Link
                href={href(page + 1)}
                rel="next"
                className="inline-flex h-10 items-center justify-center rounded-full border border-line px-4 font-display text-sm font-semibold text-white/80 transition-colors hover:border-accent hover:text-accent"
              >
                Next
              </Link>
            )}
          </nav>
        )}
      </div>
    </section>
  );
}
