import Link from "next/link";
import Image from "next/image";
import type { PostCard as Post } from "../lib/blog";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

/** First <img> in the post body, used when no cover is set. Only hosts the
 *  image loader allows (see next.config.ts remotePatterns). */
function firstImage(html: string): string | null {
  const m = /<img[^>]+src=["']([^"']+)["']/i.exec(html);
  if (!m) return null;
  const src = m[1];
  return /^https:\/\/([a-z0-9-]+\.public\.blob\.vercel-storage\.com|images\.pexels\.com)\//i.test(src) ? src : null;
}

/** One post in a listing grid. Shared by the blog index and category archives. */
export default function PostCard({
  post,
  priority = false,
}: {
  post: Post;
  /** Set on the first row so the LCP image isn't lazy-loaded. */
  priority?: boolean;
}) {
  const cover = post.coverUrl ?? firstImage(post.bodyHtml);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-accent/50">
      <Link href={`/blog/${post.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-16/10 overflow-hidden bg-[var(--cream-2)]">
          {cover ? (
            <Image
              src={cover}
              alt={post.coverAlt || post.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              priority={priority}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div aria-hidden="true" className="flex h-full items-center justify-center gap-2 bg-[var(--cream-2)]">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-accent" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted">
            {post.category && <span className="text-accent">{post.category.name}</span>}
            {post.category && <span aria-hidden="true">·</span>}
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>
                {dateFormat.format(post.publishedAt)}
              </time>
            )}
            <span aria-hidden="true">·</span>
            <span>{post.readingMins} min read</span>
          </div>

          <h3 className="mt-3 font-display text-lg font-semibold leading-snug tracking-tight text-white transition-colors group-hover:text-accent">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-base leading-relaxed text-muted">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}
