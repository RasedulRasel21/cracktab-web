import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "../../../../lib/auth";
import { prisma } from "../../../../lib/db";
import { buildTree, flattenForSelect } from "../../../../lib/categories";
import PostForm from "../../../PostForm";
import { updatePost } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, user] = await Promise.all([params, requireUser()]);

  const [post, allCategories] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true, description: true, parentId: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!post) notFound();

  // The action re-checks this; doing it here too means an author never gets a
  // filled-in form they aren't allowed to save.
  if (user.role !== "ADMIN" && post.authorId !== user.id) notFound();

  const categories = flattenForSelect(buildTree(allCategories)).map((option) => ({
    id: option.id,
    name: option.label,
  }));

  // `bind` supplies the post id — the action's first parameter — leaving the
  // (prevState, formData) signature useActionState expects.
  const action = updatePost.bind(null, post.id);

  return (
    <>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="text-xs font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent"
          >
            ← Posts
          </Link>
          <h1 className="mt-4 font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
            Edit post
          </h1>
        </div>

        {post.status === "PUBLISHED" && (
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="text-xs font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent"
          >
            View live ↗
          </Link>
        )}
      </div>

      <PostForm
        action={action}
        categories={categories}
        defaults={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          bodyHtml: post.bodyHtml,
          coverUrl: post.coverUrl,
          coverAlt: post.coverAlt,
          categoryId: post.categoryId,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          canonicalUrl: post.canonicalUrl,
          noindex: post.noindex,
          isPublished: post.status === "PUBLISHED",
        }}
      />
    </>
  );
}
