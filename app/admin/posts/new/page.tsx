import Link from "next/link";
import { requireUser } from "../../../lib/auth";
import { prisma } from "../../../lib/db";
import { buildTree, flattenForSelect } from "../../../lib/categories";
import PostForm from "../../PostForm";
import { createPost } from "../../actions";

export const dynamic = "force-dynamic";

/** Indented so a subcategory reads as one in the dropdown. */
async function getCategoryOptions() {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true, description: true, parentId: true },
      orderBy: { name: "asc" },
    });
    return flattenForSelect(buildTree(categories)).map((option) => ({
      id: option.id,
      name: option.label,
    }));
  } catch {
    // The form is still usable without a category list.
    return [];
  }
}

export default async function NewPostPage() {
  await requireUser();
  const categories = await getCategoryOptions();

  return (
    <>
      <div className="mb-10">
        <Link
          href="/admin"
          className="text-xs font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent"
        >
          ← Posts
        </Link>
        <h1 className="mt-4 font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
          New post
        </h1>
      </div>

      <PostForm action={createPost} categories={categories} />
    </>
  );
}
