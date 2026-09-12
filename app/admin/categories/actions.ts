"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "../../lib/auth";
import { prisma } from "../../lib/db";
import { wouldCycle } from "../../lib/categories";
import { slugify } from "../../lib/text";

export type CategoryFormState = { error: string | null };

/** Slugs that would collide with a real route under /blog/category/. */
const RESERVED = new Set(["page", "new", "edit"]);

function revalidateBlog() {
  revalidatePath("/blog");
  revalidatePath("/blog/category/[slug]", "page");
  revalidatePath("/blog/category/[slug]/page/[page]", "page");
  revalidatePath("/sitemap.xml");
}

async function uniqueSlug(desired: string, ignoreId?: string): Promise<string> {
  const base = slugify(desired) || "category";
  let candidate = RESERVED.has(base) ? `${base}-category` : base;

  for (let n = 2; ; n++) {
    const clash = await prisma.category.findFirst({
      where: { slug: candidate, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
      select: { id: true },
    });
    if (!clash) return candidate;
    candidate = `${base}-${n}`;
  }
}

function read(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    slugInput: String(formData.get("slug") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    parentId: String(formData.get("parentId") ?? "").trim() || null,
  };
}

export async function createCategory(
  _prev: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireUser();
  const input = read(formData);

  if (!input.name) return { error: "Give the category a name." };

  try {
    // The schema's @@unique([parentId, name]) enforces this too; catching it
    // here turns a Prisma error code into a sentence the author can act on.
    const sibling = await prisma.category.findFirst({
      where: { parentId: input.parentId, name: input.name },
      select: { id: true },
    });
    if (sibling) {
      return {
        error: input.parentId
          ? `There's already a "${input.name}" under that parent.`
          : `There's already a top-level category called "${input.name}".`,
      };
    }

    await prisma.category.create({
      data: {
        name: input.name,
        slug: await uniqueSlug(input.slugInput || input.name),
        description: input.description,
        parentId: input.parentId,
      },
    });
  } catch (error) {
    console.error("[categories] create failed", error);
    return { error: "Couldn't save the category. Check the connection." };
  }

  revalidateBlog();
  redirect("/admin/categories?saved=1");
}

export async function updateCategory(
  categoryId: string,
  _prev: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireUser();
  const input = read(formData);

  if (!input.name) return { error: "Give the category a name." };

  try {
    const all = await prisma.category.findMany({
      select: { id: true, name: true, slug: true, description: true, parentId: true },
    });

    // Re-parenting a category under its own descendant would detach that whole
    // branch from the roots — it would vanish from the nav with no error.
    if (wouldCycle(all, categoryId, input.parentId)) {
      return { error: "A category can't sit inside itself or one of its own subcategories." };
    }

    const sibling = all.find(
      (item) =>
        item.id !== categoryId &&
        item.parentId === input.parentId &&
        item.name === input.name,
    );
    if (sibling) return { error: `There's already a "${input.name}" at that level.` };

    const existing = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { slug: true },
    });
    if (!existing) return { error: "That category no longer exists." };

    await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: input.name,
        slug: await uniqueSlug(input.slugInput || input.name, categoryId),
        description: input.description,
        parentId: input.parentId,
      },
    });
  } catch (error) {
    console.error("[categories] update failed", error);
    return { error: "Couldn't save the category. Check the connection." };
  }

  revalidateBlog();
  redirect("/admin/categories?saved=1");
}

/**
 * Deleting is non-destructive to content: the schema's `onDelete: SetNull`
 * un-files the posts and promotes the children to top level rather than
 * cascading. The confirm dialog says so.
 */
export async function deleteCategory(formData: FormData): Promise<void> {
  await requireUser();
  const categoryId = String(formData.get("categoryId") ?? "");

  try {
    await prisma.category.delete({ where: { id: categoryId } });
  } catch (error) {
    console.error("[categories] delete failed", error);
    redirect("/admin/categories?error=1");
  }

  revalidateBlog();
  redirect("/admin/categories?deleted=1");
}
