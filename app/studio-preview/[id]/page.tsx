import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostArticle from "../../components/PostArticle";
import { requireUser } from "../../lib/auth";
import { prisma } from "../../lib/db";
import { studio } from "../../lib/paths";

/**
 * Draft preview, reached only as <studio>/preview/<id> — the proxy rewrites
 * that here after checking the session signature, and 404s this path by its
 * real name. It sits outside /admin on purpose: the article renders in the
 * site's own layout and theme, exactly as readers will see it.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
};

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, user] = await Promise.all([params, requireUser()]);

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      category: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
      author: { select: { name: true, bio: true } },
    },
  });

  // Same rule as the editor: an author previews only their own posts.
  if (!post || (user.role !== "ADMIN" && post.authorId !== user.id)) notFound();

  const state =
    post.status === "DRAFT"
      ? "Draft"
      : post.publishedAt && post.publishedAt > new Date()
        ? "Scheduled"
        : "Live";

  return (
    <>
      <PostArticle post={post} />

      {/* Marks this page private, so GTM and other third-party scripts stay
          off it — see usePublicPage. Not `.studio-page`, which would also
          hide the site header and footer this preview is meant to show. */}
      <div data-private-page className="h-32" aria-hidden="true" />

      <div
        role="status"
        className="fixed inset-x-0 bottom-0 z-60 border-t border-amber-500/40 bg-amber-300 text-black"
      >
        <div className="mx-auto flex w-full max-w-360 flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <p className="text-sm">
            <span className="font-semibold">Preview · {state}.</span>{" "}
            Showing the last saved version — readers {state === "Live" ? "see the live page" : "can't see this yet"}.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wide">
            {state === "Live" && (
              <Link href={`/blog/${post.slug}`} className="underline underline-offset-2">
                View live
              </Link>
            )}
            <Link href={studio(`/posts/${post.id}/edit`)} className="underline underline-offset-2">
              Back to editor
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
