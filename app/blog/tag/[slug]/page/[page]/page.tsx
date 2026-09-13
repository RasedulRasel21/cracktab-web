import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogListing from "../../../../../components/BlogListing";
import PageHeader from "../../../../../components/PageHeader";
import { getCategoryTree, getPosts, getTagBySlug } from "../../../../../lib/blog";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; page: string }>;
}): Promise<Metadata> {
  const { slug, page } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) return { title: "Tag not found" };

  return {
    title: `Posts tagged “${tag.name}” — Blog, page ${page}`,
    alternates: { canonical: `/blog/tag/${slug}/page/${page}` },
    robots: { index: false, follow: true },
  };
}

/** Page 1 lives at /blog/tag/<slug>, so this route starts at 2. */
export default async function TagPaginatedPage({
  params,
}: {
  params: Promise<{ slug: string; page: string }>;
}) {
  const { slug, page: pageParam } = await params;
  const page = Number(pageParam);

  if (!Number.isInteger(page) || page < 2) notFound();

  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const [{ posts, pageCount }, categories] = await Promise.all([
    getPosts({ page, tagId: tag.id }),
    getCategoryTree(),
  ]);

  if (posts.length === 0) notFound();

  return (
    <>
      <PageHeader eyebrow={`Tag — page ${page}`} title={`#${tag.name}`} />

      <BlogListing
        posts={posts}
        categories={categories}
        activeSlug={null}
        page={page}
        pageCount={pageCount}
        basePath={`/blog/tag/${tag.slug}`}
      />
    </>
  );
}
