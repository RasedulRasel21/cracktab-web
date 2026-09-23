import type { MetadataRoute } from "next";
import { getAllPublished, getCategoryTree } from "./lib/blog";
import type { CategoryNode } from "./lib/categories";
import { SITE_URL, serviceDetails } from "./lib/site";
import { caseStudies } from "./lib/site";

/**
 * Publishing refreshes this immediately (see revalidateBlog in the studio's
 * actions). This window is only the backstop for changes made outside the
 * studio — kept short so a category emptying out can't linger for an hour.
 */
export const revalidate = 600;

/** Every category in the tree, flat. */
function flatten(nodes: CategoryNode[]): CategoryNode[] {
  return nodes.flatMap((node) => [node, ...flatten(node.children)]);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categoryTree] = await Promise.all([
    getAllPublished(),
    // Already pruned to categories with published posts in them. An empty
    // archive 404s by design, so listing every category advertised pages
    // that were guaranteed to fail — nine of them, per the SEO audit.
    getCategoryTree(),
  ]);
  const categories = flatten(categoryTree);

  const staticRoutes = [
    { path: "/", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/work", priority: 0.9 },
    { path: "/themes", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/blog", priority: 0.7 },
    { path: "/contact", priority: 0.7 },
    { path: "/faq", priority: 0.5 },
    { path: "/privacy", priority: 0.2 },
    { path: "/imprint", priority: 0.2 },
  ];

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...serviceDetails.map((service) => ({
      url: `${SITE_URL}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...caseStudies.map((study) => ({
      url: `${SITE_URL}/work/${study.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...categories.map((category) => ({
      url: `${SITE_URL}/blog/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    // Real `lastModified` here, not `new Date()` — it is the one place on the
    // site where the value is genuinely known, and crawlers use it.
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
