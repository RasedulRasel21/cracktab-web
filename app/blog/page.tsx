import type { Metadata } from "next";
import PageHeader from "../components/PageHeader";
import BlogListing from "../components/BlogListing";
import { getCategoryTree, getPosts } from "../lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Build stories, industry notes, and behind-the-scenes content from the Cracktab team.",
  alternates: { canonical: "/blog" },
};

/**
 * Cached and refreshed hourly. Publishing from /admin calls revalidatePath, so
 * a new post appears immediately rather than waiting out the hour — without
 * putting a query on the shared droplet for every visitor.
 */
export const revalidate = 3600;

export default async function BlogPage() {
  const [{ posts, pageCount }, categories] = await Promise.all([
    getPosts({ page: 1 }),
    getCategoryTree(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title={
          <>
            Build stories &amp; <span className="text-accent">field notes.</span>
          </>
        }
        subtitle="Behind-the-scenes on how we build, migrate, and grow Shopify stores — plus the occasional industry note."
      />

      <BlogListing
        posts={posts}
        categories={categories}
        activeSlug={null}
        page={1}
        pageCount={pageCount}
        basePath="/blog"
      />
    </>
  );
}
