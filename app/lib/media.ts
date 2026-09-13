import { prisma } from "./db";

/** Posts that use a file — as their cover, or anywhere in their body. */
export async function mediaUsage(url: string): Promise<number> {
  return prisma.post.count({
    where: { OR: [{ coverUrl: url }, { bodyHtml: { contains: url } }] },
  });
}

/**
 * Usage for a page of files at once, counted in memory from a single query.
 * A count query per file would be a round trip each to a database in New York.
 * Fine at blog scale; past a few thousand posts this wants a join table.
 */
export async function mediaUsageMap(urls: string[]): Promise<Map<string, number>> {
  const counts = new Map(urls.map((url) => [url, 0]));
  if (urls.length === 0) return counts;

  const posts = await prisma.post.findMany({ select: { coverUrl: true, bodyHtml: true } });

  for (const post of posts) {
    for (const url of urls) {
      if (post.coverUrl === url || post.bodyHtml.includes(url)) {
        counts.set(url, (counts.get(url) ?? 0) + 1);
      }
    }
  }

  return counts;
}
