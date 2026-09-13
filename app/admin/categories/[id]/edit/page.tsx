import Link from "next/link";
import { studio } from "../../../../lib/paths";
import { notFound } from "next/navigation";
import { requireUser } from "../../../../lib/auth";
import { prisma } from "../../../../lib/db";
import {
  buildTree,
  descendantIds,
  flattenForSelect,
} from "../../../../lib/categories";
import CategoryForm from "../../CategoryForm";
import { updateCategory } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }] = await Promise.all([params, requireUser()]);

  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true, description: true, parentId: true },
    orderBy: { name: "asc" },
  });

  const category = categories.find((item) => item.id === id);
  if (!category) notFound();

  // Its own subtree can't be its parent. The action rejects this too, but
  // leaving the options in the dropdown invites the error rather than
  // preventing it.
  const forbidden = new Set(descendantIds(categories, id));
  const options = flattenForSelect(buildTree(categories)).filter(
    (option) => !forbidden.has(option.id),
  );

  const action = updateCategory.bind(null, category.id);

  return (
    <>
      <div className="mb-10">
        <Link
          href={studio("/categories")}
          className="text-xs font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent"
        >
          ← Categories
        </Link>
        <h1 className="mt-4 font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
          Edit category
        </h1>
      </div>

      <div className="max-w-xl rounded-2xl border border-line bg-surface p-6">
        <CategoryForm
          action={action}
          parents={options}
          submitLabel="Save changes"
          defaults={{
            name: category.name,
            slug: category.slug,
            description: category.description ?? "",
            parentId: category.parentId ?? "",
          }}
        />
      </div>
    </>
  );
}
