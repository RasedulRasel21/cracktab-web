import Link from "next/link";
import Image from "next/image";

/**
 * The article itself — header, cover, body, tags, author box. Shared by the
 * public post page and the studio's draft preview, so a preview can never
 * drift from what readers will actually see.
 */

export type ArticlePost = {
  title: string;
  excerpt: string;
  bodyHtml: string;
  coverUrl: string | null;
  coverAlt: string | null;
  publishedAt: Date | null;
  readingMins: number;
  category: { name: string; slug: string } | null;
  tags: { name: string; slug: string }[];
  author: { name: string; bio: string | null };
};

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export default function PostArticle({ post }: { post: ArticlePost }) {
  return (
    <article className="pt-32 sm:pt-40">
      <header className="mx-auto w-full max-w-3xl px-5 sm:px-8">
        <nav aria-label="Breadcrumb" className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
          <Link href="/blog" className="transition-colors hover:text-accent">
            Blog
          </Link>
          {post.category && (
            <>
              <span aria-hidden="true"> / </span>
              <Link
                href={`/blog/category/${post.category.slug}`}
                className="transition-colors hover:text-accent"
              >
                {post.category.name}
              </Link>
            </>
          )}
        </nav>

        <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-tight text-white">
          {post.title}
        </h1>

        <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">{post.excerpt}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6 text-sm text-muted">
          <span className="font-semibold text-white">{post.author.name}</span>
          {post.publishedAt && (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt.toISOString()}>
                {dateFormat.format(post.publishedAt)}
              </time>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>{post.readingMins} min read</span>
        </div>
      </header>

      {post.coverUrl && (
        <div className="mx-auto mt-12 w-full max-w-5xl px-5 sm:px-8">
          <div className="relative aspect-16/9 overflow-hidden rounded-2xl border border-line bg-black">
            <Image
              src={post.coverUrl}
              alt={post.coverAlt ?? ""}
              fill
              priority
              sizes="(min-width: 1024px) 64rem, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Sanitised on write, in the admin action — never at render time. */}
      <div
        className="prose mx-auto mt-14 w-full max-w-3xl px-5 sm:px-8"
        dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
      />

      {post.tags.length > 0 && (
        <div className="mx-auto mt-14 w-full max-w-3xl px-5 sm:px-8">
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag.slug}>
                <Link
                  href={`/blog/tag/${tag.slug}`}
                  className="inline-block rounded-full border border-line px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  #{tag.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {post.author.bio && (
        <aside className="mx-auto mt-14 w-full max-w-3xl px-5 sm:px-8">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <span className="font-display text-sm font-semibold tracking-tight text-white">
              {post.author.name}
            </span>
            <p className="mt-2 text-sm leading-relaxed text-muted">{post.author.bio}</p>
          </div>
        </aside>
      )}
    </article>
  );
}
