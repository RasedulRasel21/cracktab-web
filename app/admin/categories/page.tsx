import Link from "next/link";
import { requireUser } from "../../lib/auth";
import { prisma } from "../../lib/db";
import { buildTree, flattenForSelect, type CategoryNode } from "../../lib/categories";
import CategoryForm from "./CategoryForm";
import DeleteCategoryButton from "./DeleteCategoryButton";
import { createCategory } from "./actions";

export const dynamic = "force-dynamic";

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

    return { categories, tree: buildTree(categories, counts), counts };
  } catch (error) {
    console.error("[admin] could not load categories", error);
    return null;
  }
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
            href={`/admin/categories/${node.id}/edit`}
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

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href={`/admin/categories/${node.id}/edit`}
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
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  await requireUser();
  const [data, flags] = await Promise.all([load(), searchParams]);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/admin"
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

      {flags.saved && (
        <p className="mt-6 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          Saved.
        </p>
      )}
      {flags.deleted && (
        <p className="mt-6 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          Category deleted.
        </p>
      )}
      {flags.error && (
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
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            {data.tree.length === 0 ? (
              <p className="rounded-2xl border border-line bg-surface p-6 text-sm text-muted">
                No categories yet. Add the first one on the right.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {data.tree.map((node) => (
                  <Row key={node.id} node={node} />
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="mb-5 font-display text-sm font-semibold text-white">
              New category
            </h2>
            <CategoryForm
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
