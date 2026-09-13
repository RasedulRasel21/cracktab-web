import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogListing from "../../../components/BlogListing";
import PageHeader from "../../../components/PageHeader";
import { getCategoryTree, getPosts, getTagBySlug } from "../../../lib/blog";

export const revalidate = 3600;
export const dynamicParams = true;

/** Rendered on first visit and cached, rather than prerendering every tag. */
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) return { title: "Tag not found" };

  return {
    title: `Posts tagged “${tag.name}” — Blog`,
    description: `Articles from the Cracktab team tagged ${tag.name}.`,
    alternates: { canonical: `/blog/tag/${tag.slug}` },
    // Tag pages mostly repeat category archives in a different order. Followed
    // so the posts are still found, but kept out of the index as thin pages.
    robots: { index: false, follow: true },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const [{ posts, pageCount }, categories] = await Promise.all([
    getPosts({ page: 1, tagId: tag.id }),
    getCategoryTree(),
  ]);

  if (posts.length === 0) notFound();

  return (
    <>
      <PageHeader eyebrow="Tag" title={`#${tag.name}`} />

      <BlogListing
        posts={posts}
        categories={categories}
        activeSlug={null}
        page={1}
        pageCount={pageCount}
        basePath={`/blog/tag/${tag.slug}`}
      />
    </>
  );
}
