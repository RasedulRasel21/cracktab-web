import Link from "next/link";
import { requireUser } from "../lib/auth";
import { prisma } from "../lib/db";
import DeleteButton from "./DeleteButton";

/**
 * Always current — an editor who just saved must not be shown a cached list.
 * This is the one place on the site where staleness is worse than a query.
 */
export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

async function getPosts() {
  try {
    return await prisma.post.findMany({
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
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
    });
  } catch (error) {
    console.error("[admin] could not load posts", error);
    return null;
  }
}

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; denied?: string }>;
}) {
  const user = await requireUser();
  const [posts, flags] = await Promise.all([getPosts(), searchParams]);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
            Posts
          </h1>
          <p className="mt-2 text-sm text-muted">
            {posts === null
              ? "Couldn't reach the database."
              : `${posts.filter((p) => p.status === "PUBLISHED").length} published, ${posts.filter((p) => p.status === "DRAFT").length} draft`}
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 font-display text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong"
        >
          New post
        </Link>
      </div>

      {flags.saved && (
        <p className="mt-6 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          Saved.
        </p>
      )}
      {flags.deleted && (
        <p className="mt-6 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          Post deleted.
        </p>
      )}
      {flags.denied && (
        <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          That post belongs to someone else.
        </p>
      )}

      {posts === null ? (
        <p className="mt-10 rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
          The database is unreachable. Check <code>DATABASE_URL</code> in{" "}
          <code>.env</code>, then reload.
        </p>
      ) : posts.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-line bg-surface p-8">
          <p className="text-sm text-muted">
            Nothing here yet. Write the first post.
          </p>
        </div>
      ) : (
        <ul className="mt-10 flex flex-col gap-3">
          {posts.map((post) => {
            // By id, not name — two people can share a display name.
            const mine = post.authorId === user.id || user.role === "ADMIN";
            return (
              <li
                key={post.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-surface p-5 transition-colors hover:border-slate-300"
              >
                <span
                  className={`studio-badge shrink-0 uppercase ${
                    post.status === "PUBLISHED"
                      ? "studio-badge-emerald"
                      : "studio-badge-slate"
                  }`}
                >
                  {post.status === "PUBLISHED" ? "Live" : "Draft"}
                </span>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="font-display text-sm font-semibold tracking-tight text-white transition-colors hover:text-accent"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-1 truncate text-xs text-muted">
                    {post.author.name}
                    {post.category && ` · ${post.category.name}`}
                    {" · "}
                    {post.status === "PUBLISHED" && post.publishedAt
                      ? `published ${dateFormat.format(post.publishedAt)}`
                      : `edited ${dateFormat.format(post.updatedAt)}`}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {post.status === "PUBLISHED" && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="text-xs font-medium uppercase tracking-wide text-muted transition-colors hover:text-accent"
                    >
                      View ↗
                    </Link>
                  )}
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
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
    </>
  );
}
