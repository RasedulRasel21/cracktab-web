import Link from "next/link";
import { requireUser } from "../../lib/auth";
import {
  buildTree,
  flattenForSelect,
  type CategoryNode,
  type FlatCategory,
} from "../../lib/categories";
import { prisma } from "../../lib/db";
import { studio } from "../../lib/paths";
import Pagination from "../Pagination";
import CategoryForm from "./CategoryForm";
import DeleteCategoryButton from "./DeleteCategoryButton";
import { createCategory } from "./actions";

export const dynamic = "force-dynamic";

/** Tree view pages by top-level category, so a parent is never split from its children. */
const ROOTS_PER_PAGE = 15;
const RESULTS_PER_PAGE = 30;

const field =
  "h-10 w-full rounded-xl border border-line bg-black px-3 text-sm text-white outline-none transition-colors focus:border-accent";
const labelText = "text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted";

async function load() {
  try {
    const [categories, grouped] = await Promise.all([
      prisma.category.findMany({
        select: { id: true, name: true, slug: true, description: true, parentId: true },
        orderBy: { name: "asc" },
      }),
      prisma.post.groupBy({ by: ["categoryId"], _count: { _all: true } }),
    ]);

    const counts = new Map<string, number>();
    for (const row of grouped) {
      if (row.categoryId) counts.set(row.categoryId, row._count._all);
    }

    return { categories, tree: buildTree(categories, counts) };
  } catch (error) {
    console.error("[admin] could not load categories", error);
    return null;
  }
}

/** Every node by id, so search results can show rolled-up counts. */
function indexTree(nodes: CategoryNode[], into = new Map<string, CategoryNode>()) {
  for (const node of nodes) {
    into.set(node.id, node);
    indexTree(node.children, into);
  }
  return into;
}

/** "Shopify › Migration" — where a result sits, since search flattens the tree. */
function pathOf(byId: Map<string, FlatCategory>, category: FlatCategory): string {
  const names = [category.name];
  const seen = new Set([category.id]);
  let parent = category.parentId ? byId.get(category.parentId) : undefined;
  while (parent && !seen.has(parent.id)) {
    seen.add(parent.id);
    names.unshift(parent.name);
    parent = parent.parentId ? byId.get(parent.parentId) : undefined;
  }
  return names.join(" › ");
}

function Actions({ node }: { node: CategoryNode }) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <Link
        href={studio(`/categories/${node.id}/edit`)}
        className="text-xs font-medium uppercase tracking-wide text-muted transition-colors hover:text-accent"
      >
        Edit
      </Link>
      <DeleteCategoryButton
        categoryId={node.id}
        name={node.name}
        postCount={node.postCount}
        childCount={node.children.length}
      />
    </div>
  );
}

/** One row per category, indented by depth. */
function Row({ node }: { node: CategoryNode }) {
  return (
    <>
      <li
        className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-accent/40"
        style={{ marginLeft: `${node.depth * 1.5}rem` }}
      >
        <div className="min-w-0 flex-1">
          <Link
            href={studio(`/categories/${node.id}/edit`)}
            className="font-display text-sm font-semibold tracking-tight text-white transition-colors hover:text-accent"
          >
            {node.name}
          </Link>
          <p className="mt-1 truncate text-xs text-muted">
            /blog/category/{node.slug}
            {" · "}
            {node.postCount} post{node.postCount === 1 ? "" : "s"}
            {node.children.length > 0 &&
              ` · ${node.children.length} subcategor${node.children.length === 1 ? "y" : "ies"}`}
          </p>
        </div>
        <Actions node={node} />
      </li>
      {node.children.map((child) => (
        <Row key={child.id} node={child} />
      ))}
    </>
  );
}

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    saved?: string;
    deleted?: string;
    error?: string;
  }>;
}) {
  await requireUser();
  const [data, params] = await Promise.all([load(), searchParams]);

  const q = (params.q ?? "").trim().slice(0, 100);
  const page = Math.min(10_000, Math.max(1, Math.floor(Number(params.page)) || 1));
  const hrefFor = (n: number) => {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (n > 1) query.set("page", String(n));
    const qs = query.toString();
    return studio(`/categories${qs ? `?${qs}` : ""}`);
  };

  // Categories are few enough to filter in memory, which keeps search over
  // name, slug and description to one tree load and no extra queries.
  let results: { node: CategoryNode; path: string }[] = [];
  let pageCount = 1;
  let roots: CategoryNode[] = [];

  if (data) {
    if (q) {
      const needle = q.toLowerCase();
      const byId = new Map(data.categories.map((c) => [c.id, c]));
      const nodes = indexTree(data.tree);
      const matches = data.categories
        .filter((c) =>
          [c.name, c.slug, c.description ?? ""].some((text) =>
            text.toLowerCase().includes(needle),
          ),
        )
        .map((c) => ({ node: nodes.get(c.id)!, path: pathOf(byId, c) }))
        .filter((result) => result.node)
        .sort((a, b) => a.path.localeCompare(b.path));

      pageCount = Math.max(1, Math.ceil(matches.length / RESULTS_PER_PAGE));
      results = matches.slice((page - 1) * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE);
    } else {
      pageCount = Math.max(1, Math.ceil(data.tree.length / ROOTS_PER_PAGE));
      roots = data.tree.slice((page - 1) * ROOTS_PER_PAGE, page * ROOTS_PER_PAGE);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href={studio()}
            className="text-xs font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent"
          >
            ← Posts
          </Link>
          <h1 className="mt-4 font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
            Categories
          </h1>
          <p className="mt-2 text-sm text-muted">
            Nest them as deep as you like. Post counts include subcategories.
          </p>
        </div>
      </div>

      {params.saved && (
        <p className="mt-6 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          Saved.
        </p>
      )}
      {params.deleted && (
        <p className="mt-6 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          Category deleted.
        </p>
      )}
      {params.error && (
        <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Couldn&apos;t delete that category.
        </p>
      )}

      {data === null ? (
        <p className="mt-10 rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
          The database is unreachable. Check <code>DATABASE_URL</code> in{" "}
          <code>.env</code>, then reload.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <form
              method="get"
              action={studio("/categories")}
              role="search"
              className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-line bg-surface p-4"
            >
              <label className="flex min-w-56 flex-1 flex-col gap-1.5">
                <span className={labelText}>Search categories</span>
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Name, slug or description"
                  maxLength={100}
                  className={field}
                />
              </label>
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-accent px-4 text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong"
              >
                Search
              </button>
              {q && (
                <Link
                  href={studio("/categories")}
                  className="inline-flex h-10 items-center px-2 text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:text-accent"
                >
                  Clear
                </Link>
              )}
            </form>

            {q ? (
              results.length === 0 ? (
                <p className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
                  No category matches &ldquo;{q}&rdquo;.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {results.map(({ node, path }) => (
                    <li
                      key={node.id}
                      className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-accent/40"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={studio(`/categories/${node.id}/edit`)}
                          className="font-display text-sm font-semibold tracking-tight text-white transition-colors hover:text-accent"
                        >
                          {node.name}
                        </Link>
                        <p className="mt-1 truncate text-xs text-muted">
                          {path} · /blog/category/{node.slug} · {node.postCount} post
                          {node.postCount === 1 ? "" : "s"}
                        </p>
                      </div>
                      <Actions node={node} />
                    </li>
                  ))}
                </ul>
              )
            ) : data.tree.length === 0 ? (
              <p className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
                No categories yet. Add the first one on the right.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {roots.map((node) => (
                  <Row key={node.id} node={node} />
                ))}
              </ul>
            )}

            <Pagination
              page={page}
              pageCount={pageCount}
              label="Category list pages"
              hrefFor={hrefFor}
            />
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6 lg:self-start">
            <h2 className="mb-5 font-display text-sm font-semibold text-white">
              New category
            </h2>
            <CategoryForm
              key={params.saved ?? "new"}
              action={createCategory}
              parents={flattenForSelect(data.tree)}
              submitLabel="Add category"
            />
          </div>
        </div>
      )}
    </>
  );
}
