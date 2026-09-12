import { prisma } from "./db";
import type { Prisma } from "@/generated/prisma/client";
import { buildTree, descendantIds, type CategoryNode, type FlatCategory } from "./categories";

/**
 * Read queries for the public blog. Everything here filters to PUBLISHED and
 * orders by `publishedAt` — drafts are only ever reachable through /admin.
 */

export const POSTS_PER_PAGE = 9;

/** The shape every listing renders from. */
const listSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverUrl: true,
  coverAlt: true,
  publishedAt: true,
  readingMins: true,
  category: { select: { name: true, slug: true } },
  author: { select: { name: true } },
} satisfies Prisma.PostSelect;

export type PostCard = Prisma.PostGetPayload<{ select: typeof listSelect }>;

/**
 * Degrade to the empty state instead of throwing — but only where a missing
 * database is an expected condition:
 *
 *  • during `next build`, because Vercel prerenders these routes and the
 *    droplet may not be reachable (or provisioned) at that moment;
 *  • in development, so the site is browsable before anyone has credentials.
 *
 * In production it rethrows. A blog that quietly renders "no posts yet"
 * through a real outage is worse than a page that errors, because nobody
 * finds out. Either way the failure is logged in full.
 */
const DEGRADE =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.NODE_ENV === "development";

async function safe<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  if (!DEGRADE) return query();
  try {
    return await query();
  } catch (error) {
    console.warn(
      [
        "",
        "[blog] Database query failed — rendering the empty state.",
        "       Expected until cracktab_web exists: fill DATABASE_URL/DIRECT_URL",
        "       in .env, then run `npm run db:migrate && npm run db:seed`.",
        "",
      ].join("\n"),
      error instanceof Error ? error.message : error,
    );
    return fallback;
  }
}

/**
 * Must be a function, not a constant.
 *
 * As a module-level object, `new Date()` was evaluated once when the module
 * first loaded and then reused for the life of the process — so a post
 * published after the server started had a `publishedAt` in the future
 * relative to that frozen timestamp, and every query silently excluded it.
 * The symptom is a 404 on a post you just published, and it would have been
 * far worse in production, where a serverless instance can live for hours.
 */
const published = () =>
  ({ status: "PUBLISHED", publishedAt: { lte: new Date() } }) as const;

/**
 * @param categoryIds When given, matches posts in any of them — a parent
 *   archive passes its whole subtree so nothing filed in a child is hidden.
 */
export async function getPosts({
  page = 1,
  categoryIds,
}: { page?: number; categoryIds?: string[] } = {}) {
  const where: Prisma.PostWhereInput = {
    ...published(),
    ...(categoryIds ? { categoryId: { in: categoryIds } } : {}),
  };

  return safe(
    async () => {
      const [posts, total] = await Promise.all([
        prisma.post.findMany({
          where,
          select: listSelect,
          orderBy: { publishedAt: "desc" },
          skip: (page - 1) * POSTS_PER_PAGE,
          take: POSTS_PER_PAGE,
        }),
        prisma.post.count({ where }),
      ]);
      return { posts, total, pageCount: Math.max(1, Math.ceil(total / POSTS_PER_PAGE)) };
    },
    { posts: [] as PostCard[], total: 0, pageCount: 1 },
  );
}

export async function getPostBySlug(slug: string) {
  return safe(
    () =>
      prisma.post.findFirst({
        where: { slug, ...published() },
        include: {
          category: { select: { name: true, slug: true } },
          tags: { select: { name: true, slug: true } },
          author: { select: { name: true, bio: true, avatarUrl: true } },
        },
      }),
    null,
  );
}

export type PostDetail = NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>;

/** Same category first, newest first, excluding the post being read. */
export async function getRelatedPosts(postId: string, categoryId: string | null, take = 3) {
  return safe(
    () =>
      prisma.post.findMany({
        where: { ...published(), id: { not: postId }, ...(categoryId ? { categoryId } : {}) },
        select: listSelect,
        orderBy: { publishedAt: "desc" },
        take,
      }),
    [] as PostCard[],
  );
}

// ---------------------------------------------------------------- categories

/** Every category, flat — the input the tree helpers work from. */
export async function getAllCategories(): Promise<FlatCategory[]> {
  return safe(
    () =>
      prisma.category.findMany({
        select: { id: true, name: true, slug: true, description: true, parentId: true },
        orderBy: { name: "asc" },
      }),
    [] as FlatCategory[],
  );
}

/**
 * The tree the public nav renders: counts rolled up from children, and any
 * branch with nothing published in it pruned. An empty archive is a dead end
 * for a reader and thin content for a crawler.
 */
export async function getCategoryTree(): Promise<CategoryNode[]> {
  const [categories, grouped] = await Promise.all([
    getAllCategories(),
    safe(
      () =>
        prisma.post.groupBy({
          by: ["categoryId"],
          where: published(),
          _count: { _all: true },
        }),
      [] as { categoryId: string | null; _count: { _all: number } }[],
    ),
  ]);

  const counts = new Map<string, number>();
  for (const row of grouped) {
    if (row.categoryId) counts.set(row.categoryId, row._count._all);
  }

  const prune = (nodes: CategoryNode[]): CategoryNode[] =>
    nodes
      .filter((node) => node.postCount > 0)
      .map((node) => ({ ...node, children: prune(node.children) }));

  return prune(buildTree(categories, counts));
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getAllCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) return null;

  return {
    ...category,
    /** This category and everything filed beneath it. */
    subtreeIds: descendantIds(categories, category.id),
    ancestors: ancestorsOf(categories, category),
  };
}

/** Root-first, for breadcrumbs. */
function ancestorsOf(categories: FlatCategory[], category: FlatCategory): FlatCategory[] {
  const byId = new Map(categories.map((item) => [item.id, item]));
  const chain: FlatCategory[] = [];
  const seen = new Set<string>([category.id]);

  let current = category.parentId ? byId.get(category.parentId) : undefined;
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    chain.unshift(current);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }
  return chain;
}

/** Feeds the sitemap and the RSS feed. */
export async function getAllPublished() {
  return safe(
    () =>
      prisma.post.findMany({
        where: { ...published(), noindex: false },
        select: {
          slug: true,
          title: true,
          excerpt: true,
          publishedAt: true,
          updatedAt: true,
          author: { select: { name: true } },
        },
        orderBy: { publishedAt: "desc" },
      }),
    [] as {
      slug: string;
      title: string;
      excerpt: string;
      publishedAt: Date | null;
      updatedAt: Date;
      author: { name: string };
    }[],
  );
}
