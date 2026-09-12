import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogListing from "../../../components/BlogListing";
import {
  getAllCategories,
  getCategoryBySlug,
  getCategoryTree,
  getPosts,
} from "../../../lib/blog";
import { truncate } from "../../../lib/text";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) return { title: "Category not found" };

  const description =
    category.description ??
    truncate(`Posts from the Cracktab team on ${category.name.toLowerCase()}.`, 160);

  return {
    title: `${category.name} — Blog`,
    description,
    alternates: { canonical: `/blog/category/${category.slug}` },
    openGraph: { type: "website", title: `${category.name} — Cracktab Blog`, description },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [{ posts, pageCount }, categories] = await Promise.all([
    // The whole subtree: a post filed under "Shopify / Migrations" belongs in
    // the "Shopify" archive too, or the parent looks emptier than it is.
    getPosts({ page: 1, categoryIds: category.subtreeIds }),
    getCategoryTree(),
  ]);

  // An archive with nothing in it is a dead end for a reader and thin content
  // for a crawler — 404 rather than publish an empty page with a canonical.
  if (posts.length === 0) notFound();

  return (
    <>
      <section className="relative overflow-hidden pb-14 pt-32 sm:pb-20 sm:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60rem_28rem_at_20%_-10%,rgba(180,240,58,0.10),transparent_70%)]"
        />
        <div className="relative mx-auto w-full max-w-360 px-5 sm:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-muted"
          >
            <Link href="/blog" className="transition-colors hover:text-accent">
              Blog
            </Link>
            {category.ancestors.map((ancestor) => (
              <span key={ancestor.slug} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <Link
                  href={`/blog/category/${ancestor.slug}`}
                  className="transition-colors hover:text-accent"
                >
                  {ancestor.name}
                </Link>
              </span>
            ))}
            <span aria-hidden="true">/</span>
            <span className="text-accent">{category.name}</span>
          </nav>

          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.04] tracking-tight text-white">
            {category.name}
          </h1>

          {category.description && (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {category.description}
            </p>
          )}
        </div>
      </section>

      <BlogListing
        posts={posts}
        categories={categories}
        activeSlug={slug}
        activeAncestors={category.ancestors.map((item) => item.slug)}
        page={1}
        pageCount={pageCount}
        basePath={`/blog/category/${slug}`}
      />
    </>
  );
}
