import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { requireUser } from "../lib/auth";
import { buildTree, descendantIds, flattenForSelect } from "../lib/categories";
import { prisma } from "../lib/db";
import { studio } from "../lib/paths";
import DeleteButton from "./DeleteButton";
import Pagination from "./Pagination";

/**
 * Always current — an editor who just saved must not be shown a cached list.
 * This is the one place on the site where staleness is worse than a query.
 */
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;
const MAX_PAGE = 10_000;

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const field =
  "h-10 w-full rounded-xl border border-line bg-black px-3 text-sm text-white outline-none transition-colors focus:border-accent";
const labelText = "text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted";

type Params = {
  q?: string;
  status?: string;
  category?: string;
  author?: string;
  page?: string;
  saved?: string;
  deleted?: string;
  denied?: string;
};

type Filters = { q: string; status: "" | "PUBLISHED" | "DRAFT"; category: string; author: string };

/** The list URL with the current filters, adjusted by `changes`. Empty values drop out. */
function listHref(filters: Filters, changes: Record<string, string> = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...filters, ...changes })) {
    if (value) query.set(key, value);
  }
  const qs = query.toString();
  return studio(qs ? `?${qs}` : "");
}

async function load(filters: Filters, page: number, includeAuthors: boolean) {
  // Categories first: a category filter must include every subcategory, which
  // needs the tree before the post query can be built.
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true, description: true, parentId: true },
    orderBy: { name: "asc" },
  });

  const where: Prisma.PostWhereInput = {};

  if (filters.q) {
    // `contains` is parameterised by Prisma — the search text never becomes
    // part of the SQL itself.
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { slug: { contains: filters.q, mode: "insensitive" } },
      { excerpt: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  if (filters.status) where.status = filters.status;
  if (filters.category === "none") where.categoryId = null;
  else if (filters.category) {
    where.categoryId = { in: descendantIds(categories, filters.category) };
  }
  if (filters.author) where.authorId = filters.author;

  const [posts, total, byStatus, authors] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        publishedAt: true,
        updatedAt: true,
        authorId: true,
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    }),
    prisma.post.count({ where }),
    prisma.post.groupBy({ by: ["status"], _count: { _all: true } }),
    includeAuthors
      ? prisma.user.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })
      : Promise.resolve([] as { id: string; name: string }[]),
  ]);

  return { posts, total, byStatus, authors, categories };
}

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const isAdmin = user.role === "ADMIN";

  // Everything from the query string is untrusted: clamp it, allowlist what has
  // a fixed set of values, and let Prisma parameterise the rest.
  const filters: Filters = {
    q: (params.q ?? "").trim().slice(0, 100),
    status: params.status === "PUBLISHED" || params.status === "DRAFT" ? params.status : "",
    category: (params.category ?? "").slice(0, 40),
    author: isAdmin ? (params.author ?? "").slice(0, 40) : "",
  };
  const page = Math.min(MAX_PAGE, Math.max(1, Math.floor(Number(params.page)) || 1));
  const filtering = Boolean(filters.q || filters.status || filters.category || filters.author);

  let data: Awaited<ReturnType<typeof load>> | null = null;
  try {
    data = await load(filters, page, isAdmin);
  } catch (error) {
    console.error("[admin] could not load posts", error);
  }

  const now = new Date();
  const totals = { PUBLISHED: 0, DRAFT: 0 };
  for (const row of data?.byStatus ?? []) totals[row.status] = row._count._all;
  const pageCount = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
            Posts
          </h1>
          <p className="mt-2 text-sm text-muted">
            {totals.PUBLISHED} published, {totals.DRAFT} draft
          </p>
        </div>

        <Link
          href={studio("/posts/new")}
          className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 font-display text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong"
        >
          New post
        </Link>
      </div>

      {params.saved && (
        <p className="mt-6 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          Saved.
        </p>
      )}
      {params.deleted && (
        <p className="mt-6 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          Post deleted.
        </p>
      )}
      {params.denied && (
        <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          That post belongs to someone else.
        </p>
      )}

      {data === null ? (
        <p className="mt-10 rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
          The database is unreachable. Check <code>DATABASE_URL</code> in{" "}
          <code>.env</code>, then reload.
        </p>
      ) : (
        <>
          {/* Status tabs — counts are site-wide, so they don't shift as you filter. */}
          <nav aria-label="Filter by status" className="mt-8 flex flex-wrap gap-2">
            {(
              [
                { value: "", label: "All", count: totals.PUBLISHED + totals.DRAFT },
                { value: "PUBLISHED", label: "Published", count: totals.PUBLISHED },
                { value: "DRAFT", label: "Drafts", count: totals.DRAFT },
              ] as const
            ).map((tab) => (
              <Link
                key={tab.label}
                href={listHref(filters, { status: tab.value })}
                aria-current={filters.status === tab.value ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  filters.status === tab.value
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-line text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {tab.label}
                <span className="opacity-70">{tab.count}</span>
              </Link>
            ))}
          </nav>

          {/* A plain GET form: every filter state is a URL, so it can be
              bookmarked, shared with a colleague, or returned to with Back. */}
          <form
            method="get"
            action={studio()}
            role="search"
            className={`mt-4 grid grid-cols-1 gap-3 rounded-xl border border-line bg-surface p-4 sm:grid-cols-2 ${
              isAdmin ? "lg:grid-cols-[2fr_1fr_1fr_auto]" : "lg:grid-cols-[2fr_1fr_auto]"
            }`}
          >
            {filters.status && <input type="hidden" name="status" value={filters.status} />}

            <label className="flex flex-col gap-1.5">
              <span className={labelText}>Search</span>
              <input
                type="search"
                name="q"
                defaultValue={filters.q}
                placeholder="Title, slug or excerpt"
                maxLength={100}
                className={field}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={labelText}>Category</span>
              <select name="category" defaultValue={filters.category} className={field}>
                <option value="">All categories</option>
                <option value="none">No category</option>
                {flattenForSelect(buildTree(data.categories)).map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {isAdmin && (
              <label className="flex flex-col gap-1.5">
                <span className={labelText}>Author</span>
                <select name="author" defaultValue={filters.author} className={field}>
                  <option value="">Everyone</option>
                  {data.authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-accent px-4 text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong"
              >
                Apply
              </button>
              {filtering && (
                <Link
                  href={studio()}
                  className="inline-flex h-10 items-center px-2 text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:text-accent"
                >
                  Clear
                </Link>
              )}
            </div>
          </form>

          <p className="mt-6 text-xs text-muted">
            {data.total} post{data.total === 1 ? "" : "s"}
            {filtering ? " match" : ""}
          </p>

          {data.total === 0 ? (
            <div className="mt-4 rounded-2xl border border-line bg-surface p-8">
              <p className="text-sm text-muted">
                {filtering ? (
                  <>
                    Nothing matches those filters.{" "}
                    <Link href={studio()} className="text-accent underline underline-offset-2">
                      Clear them
                    </Link>
                    .
                  </>
                ) : (
                  "Nothing here yet. Write the first post."
                )}
              </p>
            </div>
          ) : data.posts.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-line bg-surface p-8">
              <p className="text-sm text-muted">
                That page is past the end.{" "}
                <Link
                  href={listHref(filters, { page: pageCount > 1 ? String(pageCount) : "" })}
                  className="text-accent underline underline-offset-2"
                >
                  Go to the last page
                </Link>
                .
              </p>
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {data.posts.map((post) => {
                // By id, not name — two people can share a display name.
                const mine = post.authorId === user.id || isAdmin;
                const scheduled =
                  post.status === "PUBLISHED" && post.publishedAt !== null && post.publishedAt > now;
                const live = post.status === "PUBLISHED" && !scheduled;
                return (
                  <li
                    key={post.id}
                    className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-slate-300"
                  >
                    <span
                      className={`studio-badge shrink-0 uppercase ${
                        live ? "studio-badge-emerald" : scheduled ? "studio-badge-sky" : "studio-badge-slate"
                      }`}
                    >
                      {live ? "Live" : scheduled ? "Scheduled" : "Draft"}
                    </span>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={studio(`/posts/${post.id}/edit`)}
                        className="font-display text-sm font-semibold tracking-tight text-white transition-colors hover:text-accent"
                      >
                        {post.title}
                      </Link>
                      <p className="mt-1 truncate text-xs text-muted">
                        {post.author.name}
                        {post.category && ` · ${post.category.name}`}
                        {" · "}
                        {scheduled && post.publishedAt
                          ? `goes live ${dateFormat.format(post.publishedAt)}`
                          : live && post.publishedAt
                            ? `published ${dateFormat.format(post.publishedAt)}`
                            : `edited ${dateFormat.format(post.updatedAt)}`}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      {live ? (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-xs font-medium uppercase tracking-wide text-muted transition-colors hover:text-accent"
                        >
                          View ↗
                        </Link>
                      ) : (
                        <Link
                          href={studio(`/preview/${post.id}`)}
                          target="_blank"
                          className="text-xs font-medium uppercase tracking-wide text-muted transition-colors hover:text-accent"
                        >
                          Preview ↗
                        </Link>
                      )}
                      <Link
                        href={studio(`/posts/${post.id}/edit`)}
                        className="text-xs font-medium uppercase tracking-wide text-muted transition-colors hover:text-accent"
                      >
                        Edit
                      </Link>
                      {mine && <DeleteButton postId={post.id} title={post.title} />}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <Pagination
            page={page}
            pageCount={pageCount}
            label="Post list pages"
            hrefFor={(n) => listHref(filters, { page: n === 1 ? "" : String(n) })}
          />
        </>
      )}
    </>
  );
}
