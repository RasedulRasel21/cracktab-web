import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import CtaBand from "../../components/CtaBand";
import PostCard from "../../components/PostCard";
import { getAllPublished, getPostBySlug, getRelatedPosts } from "../../lib/blog";
import { absoluteUrl, SITE_URL } from "../../lib/site";
import { truncate } from "../../lib/text";

export const revalidate = 3600;

/**
 * Published slugs are prerendered at build. `dynamicParams` keeps anything
 * newer than the last build renderable on demand, so a post published from
 * /admin is reachable before the next deploy.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getAllPublished();
  return posts.map((post) => ({ slug: post.slug }));
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Post not found" };

  // Each SEO field falls back to its content equivalent, so a post written
  // without touching the SEO section is still fully described.
  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? truncate(post.excerpt, 160);
  const image = post.ogImageUrl ?? post.coverUrl ?? undefined;

  return {
    title,
    description,
    alternates: {
      // `canonicalUrl` is set only when the piece ran somewhere else first.
      canonical: post.canonicalUrl ?? `/blog/${post.slug}`,
    },
    robots: post.noindex ? { index: false, follow: true } : undefined,
    authors: [{ name: post.author.name }],
    openGraph: {
      type: "article",
      url: absoluteUrl(`/blog/${post.slug}`),
      title,
      description,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.name],
      images: image ? [{ url: image, alt: post.coverAlt ?? post.title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const related = await getRelatedPosts(post.id, post.categoryId);
  const url = absoluteUrl(`/blog/${post.slug}`);

  // BlogPosting plus breadcrumbs — the pair Google actually uses for article
  // rich results and the breadcrumb trail under the title in search.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": url,
        headline: post.title,
        description: post.metaDescription ?? post.excerpt,
        image: post.ogImageUrl ?? post.coverUrl ?? undefined,
        datePublished: post.publishedAt?.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        author: { "@type": "Person", name: post.author.name },
        publisher: {
          "@type": "Organization",
          name: "Cracktab",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: absoluteUrl("/logo-white-scaled.png"),
          },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        wordCount: post.bodyHtml.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length,
        ...(post.category ? { articleSection: post.category.name } : {}),
        ...(post.tags.length ? { keywords: post.tags.map((t) => t.name).join(", ") } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Server-rendered from our own database — no user input reaches this.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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

          <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
            {post.excerpt}
          </p>

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
                <li
                  key={tag.slug}
                  className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted"
                >
                  {tag.name}
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

      {related.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-[1.75rem]">
              Keep reading
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title="Let's build something that performs"
        subtitle="Launching, redesigning, migrating to Shopify, or looking for a long-term partner — Cracktab can help you plan and execute the next stage of your growth."
      />
    </>
  );
}
