"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { destroySession, requireUser } from "../lib/auth";
import { prisma } from "../lib/db";
import { sanitizeBody } from "../lib/sanitize";
import { remove } from "../lib/storage";
import { htmlToText, readingMinutes, slugify, truncate } from "../lib/text";

export type PostFormState = { error: string | null };

/**
 * Route segments that must never be taken by a post slug, or the post would
 * shadow a real page (or be shadowed by one).
 */
const RESERVED_SLUGS = new Set(["page", "category", "rss.xml", "admin", "api"]);

/**
 * Everything the public blog renders is cached with `revalidate = 3600`. These
 * calls are what make publishing feel instant instead of hourly — without
 * them a new post would sit invisible for up to an hour.
 */
function revalidateBlog(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/blog/page/[page]", "page");
  revalidatePath("/blog/category/[slug]", "page");
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

function readForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const bodyHtml = sanitizeBody(String(formData.get("bodyHtml") ?? ""));
  const excerptRaw = String(formData.get("excerpt") ?? "").trim();

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
    publish: formData.get("publish") === "true",
  };
}

function validate(input: ReturnType<typeof readForm>): string | null {
  if (!input.title) return "Give the post a title.";
  if (htmlToText(input.bodyHtml).length < 20) return "The post body is empty.";
  if (input.metaTitle && input.metaTitle.length > 70) {
    return "Meta title is over 70 characters — Google will truncate it.";
  }
  if (input.metaDescription && input.metaDescription.length > 165) {
    return "Meta description is over 165 characters — Google will truncate it.";
  }
  return null;
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

    await prisma.post.create({
      data: {
        slug,
        title: input.title,
        excerpt: input.excerpt,
        bodyHtml: input.bodyHtml,
        coverUrl: input.coverUrl,
        coverAlt: input.coverAlt,
        categoryId: input.categoryId,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
        canonicalUrl: input.canonicalUrl,
        noindex: input.noindex,
        status: input.publish ? "PUBLISHED" : "DRAFT",
        publishedAt: input.publish ? new Date() : null,
        readingMins: readingMinutes(input.bodyHtml),
        authorId: user.id,
      },
    });
  } catch (error) {
    console.error("[admin] create failed", error);
    return { error: "Couldn't save the post. Check the connection and try again." };
  }

  if (input.publish) revalidateBlog(slug);
  redirect("/admin?saved=1");
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
    select: { authorId: true, slug: true, status: true, coverUrl: true },
  });

  if (!existing) return { error: "That post no longer exists." };

  // Authors edit their own; admins edit anyone's.
  if (user.role !== "ADMIN" && existing.authorId !== user.id) {
    return { error: "That post belongs to someone else." };
  }

  let slug: string;
  try {
    slug = await uniqueSlug(input.slugInput || input.title, postId);

    await prisma.post.update({
      where: { id: postId },
      data: {
        slug,
        title: input.title,
        excerpt: input.excerpt,
        bodyHtml: input.bodyHtml,
        coverUrl: input.coverUrl,
        coverAlt: input.coverAlt,
        categoryId: input.categoryId,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
        canonicalUrl: input.canonicalUrl,
        noindex: input.noindex,
        status: input.publish ? "PUBLISHED" : "DRAFT",
        // Set once, on first publish — re-editing a live post must not push it
        // back to the top of the feed or change its published date in search.
        publishedAt:
          input.publish && existing.status !== "PUBLISHED" ? new Date() : undefined,
        readingMins: readingMinutes(input.bodyHtml),
      },
    });
  } catch (error) {
    console.error("[admin] update failed", error);
    return { error: "Couldn't save the post. Check the connection and try again." };
  }

  // The old URL needs clearing too, or a renamed post lingers at both paths.
  revalidateBlog(existing.slug);
  if (slug !== existing.slug) revalidateBlog(slug);

  redirect("/admin?saved=1");
}

// ---------------------------------------------------------------- delete

export async function deletePost(formData: FormData): Promise<void> {
  const user = await requireUser();
  const postId = String(formData.get("postId") ?? "");

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true, slug: true, coverUrl: true },
  });

  if (!post) redirect("/admin");
  if (user.role !== "ADMIN" && post.authorId !== user.id) redirect("/admin?denied=1");

  await prisma.post.delete({ where: { id: postId } });

  // Only after the row is gone — a failed delete shouldn't strand the post
  // pointing at an image that no longer exists.
  if (post.coverUrl) await remove(post.coverUrl);

  revalidateBlog(post.slug);
  redirect("/admin?deleted=1");
}

// ---------------------------------------------------------------- session

export async function signOut(): Promise<void> {
  await destroySession();
  redirect("/login");
}
