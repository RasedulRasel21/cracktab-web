"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { LOGIN_PATH, studio } from "../lib/paths";
import { destroySession, requireUser } from "../lib/auth";
import { prisma } from "../lib/db";
import { recordRevision, type RevisionContent } from "../lib/revisions";
import { sanitizeBody } from "../lib/sanitize";
import { remove } from "../lib/storage";
import { formatTags, parseTags, type TagInput } from "../lib/tags";
import { htmlToText, readingMinutes, slugify, truncate } from "../lib/text";

export type PostFormState = { error: string | null };

/**
 * Route segments that must never be taken by a post slug, or the post would
 * shadow a real page (or be shadowed by one).
 */
const RESERVED_SLUGS = new Set(["page", "category", "tag", "rss.xml", "admin", "api"]);

/**
 * Everything the public blog renders is cached with `revalidate = 3600`. These
 * calls are what make publishing feel instant instead of hourly — without
 * them a new post would sit invisible for up to an hour.
 */
function revalidateBlog(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/blog/page/[page]", "page");
  revalidatePath("/blog/category/[slug]", "page");
  revalidatePath("/blog/category/[slug]/page/[page]", "page");
  revalidatePath("/blog/tag/[slug]", "page");
  revalidatePath("/blog/tag/[slug]/page/[page]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/blog/rss.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
}

async function uniqueSlug(desired: string, ignoreId?: string): Promise<string> {
  const base = slugify(desired) || "post";
  let candidate = RESERVED_SLUGS.has(base) ? `${base}-post` : base;

  // Two posts titled "2026 in review" shouldn't collide silently.
  for (let n = 2; ; n++) {
    const clash = await prisma.post.findFirst({
      where: { slug: candidate, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
      select: { id: true },
    });
    if (!clash) return candidate;
    candidate = `${base}-${n}`;
  }
}

/**
 * Finds or creates each tag and returns their ids. Upserting explicitly, then
 * setting the relation, keeps the meaning unambiguous — "these are the tags
 * now" — where mixing nested set and connectOrCreate would not.
 */
async function upsertTags(db: Pick<typeof prisma, "tag">, tags: TagInput[]) {
  const ids: { id: string }[] = [];
  for (const tag of tags) {
    ids.push(
      await db.tag.upsert({
        where: { slug: tag.slug },
        create: { name: tag.name, slug: tag.slug },
        update: {},
        select: { id: true },
      }),
    );
  }
  return ids;
}

function readForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const bodyHtml = sanitizeBody(String(formData.get("bodyHtml") ?? ""));
  const excerptRaw = String(formData.get("excerpt") ?? "").trim();

  // Sent from the browser as a full ISO timestamp, so the author's own
  // timezone is already applied — a bare datetime-local value would be read as
  // UTC on the server and shift every scheduled post by the author's offset.
  const publishAtRaw = String(formData.get("publishAt") ?? "").trim();
  const publishAtDate = publishAtRaw ? new Date(publishAtRaw) : null;
  const publishAt =
    publishAtDate && !Number.isNaN(publishAtDate.getTime()) ? publishAtDate : null;

  return {
    title,
    bodyHtml,
    // Falls back to the opening of the body, so a card is never blank.
    excerpt: excerptRaw || truncate(htmlToText(bodyHtml), 180),
    slugInput: String(formData.get("slug") ?? "").trim(),
    coverUrl: String(formData.get("coverUrl") ?? "").trim() || null,
    coverAlt: String(formData.get("coverAlt") ?? "").trim() || null,
    categoryId: String(formData.get("categoryId") ?? "").trim() || null,
    metaTitle: String(formData.get("metaTitle") ?? "").trim() || null,
    metaDescription: String(formData.get("metaDescription") ?? "").trim() || null,
    canonicalUrl: String(formData.get("canonicalUrl") ?? "").trim() || null,
    noindex: formData.get("noindex") === "on",
    tags: parseTags(String(formData.get("tags") ?? "")),
    publishAtRaw,
    publishAt,
    publish: formData.get("publish") === "true",
  };
}

type FormInput = ReturnType<typeof readForm>;

function validate(input: FormInput): string | null {
  if (!input.title) return "Give the post a title.";
  if (htmlToText(input.bodyHtml).length < 20) return "The post body is empty.";
  if (input.metaTitle && input.metaTitle.length > 70) {
    return "Meta title is over 70 characters — Google will truncate it.";
  }
  if (input.metaDescription && input.metaDescription.length > 165) {
    return "Meta description is over 165 characters — Google will truncate it.";
  }
  if (input.publishAtRaw && !input.publishAt) return "That publish date isn't a valid date.";
  return null;
}

function contentOf(input: FormInput, slug: string): RevisionContent {
  return {
    title: input.title,
    slug,
    excerpt: input.excerpt,
    bodyHtml: input.bodyHtml,
    coverUrl: input.coverUrl,
    coverAlt: input.coverAlt,
    categoryId: input.categoryId,
    tagNames: formatTags(input.tags),
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    canonicalUrl: input.canonicalUrl,
    noindex: input.noindex,
  };
}

/** A revision's content minus what only a revision stores — tags live in a relation on Post. */
function postFields({ tagNames, ...rest }: RevisionContent) {
  void tagNames;
  return rest;
}

// ---------------------------------------------------------------- create

export async function createPost(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const user = await requireUser();
  const input = readForm(formData);

  const invalid = validate(input);
  if (invalid) return { error: invalid };

  let slug: string;
  try {
    slug = await uniqueSlug(input.slugInput || input.title);
    const content = contentOf(input, slug);

    // The post and its first revision commit together, so history never
    // starts with a gap.
    await prisma.$transaction(async (tx) => {
      const tags = await upsertTags(tx, input.tags);
      const post = await tx.post.create({
        data: {
          ...postFields(content),
          status: input.publish ? "PUBLISHED" : "DRAFT",
          // A chosen date schedules or backdates; otherwise it goes out now.
          publishedAt: input.publish ? (input.publishAt ?? new Date()) : null,
          readingMins: readingMinutes(input.bodyHtml),
          authorId: user.id,
          tags: { connect: tags },
        },
        select: { id: true },
      });
      await recordRevision(tx, post.id, content, user);
    });
  } catch (error) {
    console.error("[admin] create failed", error);
    return { error: "Couldn't save the post. Check the connection and try again." };
  }

  // Always, not only when publishing: a draft still changes what the sitemap
  // and listings should show once it is saved from a published state.
  revalidateBlog(slug);
  redirect(studio("?saved=1"));
}

// ---------------------------------------------------------------- update

export async function updatePost(
  postId: string,
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const user = await requireUser();
  const input = readForm(formData);

  const invalid = validate(input);
  if (invalid) return { error: invalid };

  const existing = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true, slug: true, status: true, publishedAt: true },
  });

  if (!existing) return { error: "That post no longer exists." };

  // Authors edit their own; admins edit anyone's.
  if (user.role !== "ADMIN" && existing.authorId !== user.id) {
    return { error: "That post belongs to someone else." };
  }

  const now = new Date();
  let publishedAt: Date | undefined;
  if (input.publish) {
    if (input.publishAt) {
      publishedAt = input.publishAt;
    } else if (
      existing.status !== "PUBLISHED" ||
      !existing.publishedAt ||
      // Date cleared on a scheduled post: publish it now.
      existing.publishedAt > now
    ) {
      publishedAt = now;
    }
    // Otherwise leave it alone: re-saving a live post keeps its original date,
    // so it doesn't jump to the top of the feed or change its date in search.
  }

  let slug: string;
  try {
    slug = await uniqueSlug(input.slugInput || input.title, postId);
    const content = contentOf(input, slug);

    await prisma.$transaction(async (tx) => {
      const tags = await upsertTags(tx, input.tags);
      await tx.post.update({
        where: { id: postId },
        data: {
          ...postFields(content),
          status: input.publish ? "PUBLISHED" : "DRAFT",
          publishedAt,
          readingMins: readingMinutes(input.bodyHtml),
          tags: { set: tags },
        },
      });
      await recordRevision(tx, postId, content, user);
    });
  } catch (error) {
    console.error("[admin] update failed", error);
    return { error: "Couldn't save the post. Check the connection and try again." };
  }

  // The old URL needs clearing too, or a renamed post lingers at both paths.
  revalidateBlog(existing.slug);
  if (slug !== existing.slug) revalidateBlog(slug);

  redirect(studio("?saved=1"));
}

// ---------------------------------------------------------------- history

/**
 * Puts an earlier version's content back. Status and publish date are left
 * alone — restoring words is not the same decision as publishing them. The
 * version being replaced is already in history, so a restore can be undone
 * by restoring again.
 */
export async function restoreRevision(formData: FormData): Promise<void> {
  const user = await requireUser();
  const revisionId = String(formData.get("revisionId") ?? "");

  const revision = await prisma.postRevision.findUnique({
    where: { id: revisionId },
    include: { post: { select: { id: true, authorId: true, slug: true } } },
  });

  if (!revision) redirect(studio());
  if (user.role !== "ADMIN" && revision.post.authorId !== user.id) {
    redirect(studio("?denied=1"));
  }

  // The category may have been deleted since this version was saved.
  const categoryStillExists = revision.categoryId
    ? Boolean(
        await prisma.category.findUnique({
          where: { id: revision.categoryId },
          select: { id: true },
        }),
      )
    : false;

  const slug = await uniqueSlug(revision.slug, revision.postId);
  const content: RevisionContent = {
    title: revision.title,
    slug,
    excerpt: revision.excerpt,
    bodyHtml: revision.bodyHtml,
    coverUrl: revision.coverUrl,
    coverAlt: revision.coverAlt,
    categoryId: categoryStillExists ? revision.categoryId : null,
    tagNames: revision.tagNames,
    metaTitle: revision.metaTitle,
    metaDescription: revision.metaDescription,
    canonicalUrl: revision.canonicalUrl,
    noindex: revision.noindex,
  };

  await prisma.$transaction(async (tx) => {
    const tags = await upsertTags(tx, parseTags(revision.tagNames));
    await tx.post.update({
      where: { id: revision.postId },
      data: {
        ...postFields(content),
        readingMins: readingMinutes(revision.bodyHtml),
        tags: { set: tags },
      },
    });
    await recordRevision(tx, revision.postId, content, user);
  });

  revalidateBlog(revision.post.slug);
  if (slug !== revision.post.slug) revalidateBlog(slug);

  redirect(studio(`/posts/${revision.postId}/edit?restored=1`));
}

// ---------------------------------------------------------------- delete

export async function deletePost(formData: FormData): Promise<void> {
  const user = await requireUser();
  const postId = String(formData.get("postId") ?? "");

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true, slug: true, coverUrl: true },
  });

  if (!post) redirect(studio());
  if (user.role !== "ADMIN" && post.authorId !== user.id) redirect(studio("?denied=1"));

  await prisma.post.delete({ where: { id: postId } });

  // Only after the row is gone — a failed delete shouldn't strand the post
  // pointing at an image that no longer exists.
  if (post.coverUrl) await remove(post.coverUrl);

  revalidateBlog(post.slug);
  redirect(studio("?deleted=1"));
}

// ---------------------------------------------------------------- session

export async function signOut(): Promise<void> {
  await destroySession();
  redirect(LOGIN_PATH);
}
