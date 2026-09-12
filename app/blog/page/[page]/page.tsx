import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "../../../components/PageHeader";
import BlogListing from "../../../components/BlogListing";
import { getCategoryTree, getPosts, POSTS_PER_PAGE } from "../../../lib/blog";

export const revalidate = 3600;
export const dynamicParams = true;

/** Page 1 lives at /blog, so this route starts at 2. */
export async function generateStaticParams() {
  const { pageCount } = await getPosts({ page: 1 });
  return Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;

  return {
    title: `Blog — Page ${page}`,
    description:
      "Build stories, industry notes, and behind-the-scenes content from the Cracktab team.",
    // Each page is its own canonical. Pointing them all at /blog would ask
    // Google to drop every post that isn't on the first page.
    alternates: { canonical: `/blog/page/${page}` },
  };
}

export default async function BlogPaginatedPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: pageParam } = await params;
  const page = Number(pageParam);

  // Page 1 is /blog — serving it here too would be a duplicate URL.
  if (!Number.isInteger(page) || page < 2) notFound();

  const [{ posts, pageCount, total }, categories] = await Promise.all([
    getPosts({ page }),
    getCategoryTree(),
  ]);

  // Past the last page, or a page that only exists because the count changed.
  if (posts.length === 0 && total > 0) notFound();

  return (
    <>
      <PageHeader
        eyebrow={`Blog — page ${page}`}
        title={
          <>
            Build stories &amp; <span className="text-accent">field notes.</span>
          </>
        }
        subtitle={`Posts ${(page - 1) * POSTS_PER_PAGE + 1}–${Math.min(
          page * POSTS_PER_PAGE,
          total,
        )} of ${total}.`}
      />

      <BlogListing
        posts={posts}
        categories={categories}
        activeSlug={null}
        page={page}
        pageCount={pageCount}
        basePath="/blog"
      />
    </>
  );
}
