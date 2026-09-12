import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "../../../../../components/PageHeader";
import BlogListing from "../../../../../components/BlogListing";
import {
  getAllCategories,
  getCategoryBySlug,
  getCategoryTree,
  getPosts,
} from "../../../../../lib/blog";
import { descendantIds } from "../../../../../lib/categories";

export const revalidate = 3600;
export const dynamicParams = true;

/** Page 1 lives at /blog/category/<slug>, so this route starts at 2. */
export async function generateStaticParams() {
  const categories = await getAllCategories();

  const params = await Promise.all(
    categories.map(async (category) => {
      const { pageCount } = await getPosts({
        page: 1,
        categoryIds: descendantIds(categories, category.id),
      });
      return Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => ({
        slug: category.slug,
        page: String(i + 2),
      }));
    }),
  );

  return params.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; page: string }>;
}): Promise<Metadata> {
  const { slug, page } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) return { title: "Category not found" };

  return {
    title: `${category.name} — Blog, page ${page}`,
    description:
      category.description ??
      `Posts from the Cracktab team on ${category.name.toLowerCase()}.`,
    alternates: { canonical: `/blog/category/${slug}/page/${page}` },
  };
}

export default async function CategoryPaginatedPage({
  params,
}: {
  params: Promise<{ slug: string; page: string }>;
}) {
  const { slug, page: pageParam } = await params;
  const page = Number(pageParam);

  if (!Number.isInteger(page) || page < 2) notFound();

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [{ posts, pageCount }, categories] = await Promise.all([
    getPosts({ page, categoryIds: category.subtreeIds }),
    getCategoryTree(),
  ]);

  if (posts.length === 0) notFound();

  return (
    <>
      <PageHeader
        eyebrow={`Blog — page ${page}`}
        title={category.name}
        subtitle={category.description ?? undefined}
      />

      <BlogListing
        posts={posts}
        categories={categories}
        activeSlug={slug}
        activeAncestors={category.ancestors.map((item) => item.slug)}
        page={page}
        pageCount={pageCount}
        basePath={`/blog/category/${slug}`}
      />
    </>
  );
}
