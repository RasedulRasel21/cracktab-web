import Link from "next/link";
import { studio } from "../../../lib/paths";
import { requireUser } from "../../../lib/auth";
import { prisma } from "../../../lib/db";
import { buildTree, flattenForSelect } from "../../../lib/categories";
import PostForm from "../../PostForm";
import { createPost } from "../../actions";

export const dynamic = "force-dynamic";

/** Indented so a subcategory reads as one in the dropdown. */
async function getOptions() {
  try {
    const [categories, tags] = await Promise.all([
      prisma.category.findMany({
        select: { id: true, name: true, slug: true, description: true, parentId: true },
        orderBy: { name: "asc" },
      }),
      prisma.tag.findMany({ select: { name: true }, orderBy: { name: "asc" }, take: 500 }),
    ]);
    return {
      categories: flattenForSelect(buildTree(categories)).map((option) => ({
        id: option.id,
        name: option.label,
      })),
      tags: tags.map((tag) => tag.name),
    };
  } catch {
    // The form is still usable without the lists.
    return { categories: [], tags: [] };
  }
}

export default async function NewPostPage() {
  await requireUser();
  const { categories, tags } = await getOptions();

  return (
    <>
      <div className="mb-10">
        <Link
          href={studio()}
          className="text-xs font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent"
        >
          ← Posts
        </Link>
        <h1 className="mt-4 font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
          New post
        </h1>
      </div>

      <PostForm action={createPost} categories={categories} tagSuggestions={tags} />
    </>
  );
}
