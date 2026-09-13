import type { prisma } from "./db";

/**
 * Post history. A revision is written for every save — including the version
 * that is now live — so history reads as "who saved what, when", never as a
 * chain of diffs that has to be replayed to rebuild a page.
 */

export const MAX_REVISIONS = 50;

export type RevisionContent = {
  title: string;
  slug: string;
  excerpt: string;
  bodyHtml: string;
  coverUrl: string | null;
  coverAlt: string | null;
  categoryId: string | null;
  tagNames: string;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  noindex: boolean;
};

/** The client or a transaction — a save and its revision should commit together. */
type Db = Pick<typeof prisma, "postRevision">;

export async function recordRevision(
  db: Db,
  postId: string,
  content: RevisionContent,
  editor: { id: string; name: string },
): Promise<void> {
  await db.postRevision.create({
    data: { postId, ...content, editorId: editor.id, editorName: editor.name },
  });

  // Keep the newest MAX_REVISIONS; older ones go.
  const stale = await db.postRevision.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
    skip: MAX_REVISIONS,
    select: { id: true },
  });

  if (stale.length > 0) {
    await db.postRevision.deleteMany({
      where: { id: { in: stale.map((revision) => revision.id) } },
    });
  }
}
