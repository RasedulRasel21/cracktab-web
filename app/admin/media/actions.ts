"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "../../lib/auth";
import { prisma } from "../../lib/db";
import { mediaUsage } from "../../lib/media";
import { studio } from "../../lib/paths";
import { remove } from "../../lib/storage";

export type AltFormState = { error: string | null; saved: number };

const MAX_ALT = 250;

/** Authors manage what they uploaded; admins manage everything. */
async function loadOwned(mediaId: string) {
  const user = await requireUser();
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    select: { id: true, url: true, uploadedById: true },
  });
  if (!media) return { user, media: null, allowed: false };
  return { user, media, allowed: user.role === "ADMIN" || media.uploadedById === user.id };
}

export async function updateMediaAlt(
  mediaId: string,
  prev: AltFormState,
  formData: FormData,
): Promise<AltFormState> {
  const { media, allowed } = await loadOwned(mediaId);
  if (!media) return { ...prev, error: "That file no longer exists." };
  if (!allowed) return { ...prev, error: "Only the uploader or an admin can change this." };

  const alt = String(formData.get("alt") ?? "").trim().slice(0, MAX_ALT);

  try {
    await prisma.media.update({ where: { id: mediaId }, data: { alt: alt || null } });
  } catch (error) {
    console.error("[media] alt update failed", error);
    return { ...prev, error: "Couldn't save. Try again." };
  }

  // The file on disk, not the public studio path the proxy rewrites from.
  revalidatePath("/admin/media");
  return { error: null, saved: prev.saved + 1 };
}

/**
 * Refuses while any post still uses the file: deleting it would leave a
 * broken image on a live page, which is worse than an unused file in storage.
 */
export async function deleteMedia(formData: FormData): Promise<void> {
  const mediaId = String(formData.get("mediaId") ?? "");
  const back = String(formData.get("back") ?? "");
  // Only ever a query string for the media page — never an arbitrary URL.
  const suffix = /^\?[\w=&%.+-]*$/.test(back) ? back.replace(/^\?/, "&") : "";

  const { media, allowed } = await loadOwned(mediaId);
  if (!media) redirect(studio(`/media?gone=1${suffix}`));
  if (!allowed) redirect(studio(`/media?denied=1${suffix}`));

  if ((await mediaUsage(media.url)) > 0) redirect(studio(`/media?inuse=1${suffix}`));

  await prisma.media.delete({ where: { id: media.id } });
  await remove(media.url);

  redirect(studio(`/media?deleted=1${suffix}`));
}
