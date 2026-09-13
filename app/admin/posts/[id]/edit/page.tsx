import Link from "next/link";
import { studio } from "../../../../lib/paths";
import { notFound } from "next/navigation";
import { requireUser } from "../../../../lib/auth";
import { prisma } from "../../../../lib/db";
import { buildTree, flattenForSelect } from "../../../../lib/categories";
import { formatTags } from "../../../../lib/tags";
import PostForm from "../../../PostForm";
import { updatePost } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ restored?: string }>;
}) {
  const [{ id }, { restored }, user] = await Promise.all([params, searchParams, requireUser()]);

  const [post, allCategories, allTags, revisionCount] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: { tags: { select: { name: true }, orderBy: { name: "asc" } } },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true, description: true, parentId: true },
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({ select: { name: true }, orderBy: { name: "asc" }, take: 500 }),
    prisma.postRevision.count({ where: { postId: id } }),
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

  const scheduled =
    post.status === "PUBLISHED" && post.publishedAt && post.publishedAt > new Date();

  return (
    <>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href={studio()}
            className="text-xs font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent"
          >
            ← Posts
          </Link>
          <h1 className="mt-4 font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
            Edit post
          </h1>
        </div>

        {post.status === "PUBLISHED" && !scheduled && (
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="text-xs font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent"
          >
            View live ↗
          </Link>
        )}
      </div>

      {restored && (
        <p className="mb-6 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          Earlier version restored. The version it replaced is still in History.
        </p>
      )}

      {/* Keyed on the save count, so a restore remounts the form with the
          restored content instead of keeping the fields that were on screen. */}
      <PostForm
        key={`${post.id}:${revisionCount}`}
        action={action}
        categories={categories}
        tagSuggestions={allTags.map((tag) => tag.name)}
        links={{
          preview: studio(`/preview/${post.id}`),
          revisions: studio(`/posts/${post.id}/revisions`),
          revisionCount,
        }}
        defaults={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          bodyHtml: post.bodyHtml,
          coverUrl: post.coverUrl,
          coverAlt: post.coverAlt,
          categoryId: post.categoryId,
          tags: formatTags(post.tags),
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          canonicalUrl: post.canonicalUrl,
          noindex: post.noindex,
          isPublished: post.status === "PUBLISHED",
          publishedAt: post.publishedAt?.toISOString() ?? null,
        }}
      />
    </>
  );
}
