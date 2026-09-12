import { del, put } from "@vercel/blob";
import { slugify } from "./text";

/**
 * File storage for blog images.
 *
 * Vercel Blob, because the site already runs on Vercel and a blog's cover
 * photos sit inside the free allowance. Images do NOT go in Postgres: that
 * database lives on a 1 GB droplet shared with five production apps, its
 * nightly dump is kept for fourteen days, and every image view would become a
 * query competing for a 60-connection ceiling.
 *
 * Everything provider-specific is in this file. Moving to R2 or Spaces later
 * means rewriting `upload` and `remove` — the callers deal in URLs.
 */

/** Formats a browser can display and `next/image` can optimise. */
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

/**
 * Vercel caps a server upload — a file routed through our own function, which
 * is what /api/upload does — at 4.5 MB of request body. Rejecting at 4 MB
 * leaves room for multipart encoding overhead and produces a sentence the
 * author can act on, rather than a platform-level failure mid-request.
 *
 * The editor downscales images before sending, so this is normally unreachable.
 * The realistic way to hit it is an animated GIF, which is passed through
 * uncompressed because re-encoding one through a canvas kills the animation.
 */
const MAX_BYTES = 4 * 1024 * 1024;

export type StoredFile = {
  url: string;
  mimeType: string;
  sizeBytes: number;
};

export class UploadError extends Error {}

/**
 * @param folder Groups files in the store — "covers" or "body".
 */
export async function upload(file: File, folder: string): Promise<StoredFile> {
  if (!ALLOWED.has(file.type)) {
    throw new UploadError(
      `${file.type || "That file type"} isn't supported. Use JPEG, PNG, WebP, AVIF or GIF.`,
    );
  }

  if (file.size > MAX_BYTES) {
    throw new UploadError(
      `That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${MAX_BYTES / 1024 / 1024} MB.`,
    );
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new UploadError(
      "BLOB_READ_WRITE_TOKEN is not set — create a Blob store in the Vercel dashboard and add the token to .env.",
    );
  }

  // Keep the original name legible in the URL, but strip anything that could
  // confuse a path. `addRandomSuffix` handles collisions.
  const dot = file.name.lastIndexOf(".");
  const stem = dot > 0 ? file.name.slice(0, dot) : file.name;
  const ext = dot > 0 ? file.name.slice(dot + 1).toLowerCase() : "bin";
  const safeName = `${slugify(stem) || "image"}.${slugify(ext) || "bin"}`;

  const blob = await put(`blog/${folder}/${safeName}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });

  return { url: blob.url, mimeType: file.type, sizeBytes: file.size };
}

/** Only files in our own store — anything else was never ours to delete. */
const BLOB_HOST = /\.public\.blob\.vercel-storage\.com$/;

export function isOurs(url: string): boolean {
  try {
    return BLOB_HOST.test(new URL(url).hostname);
  } catch {
    // Not a URL at all — a relative path, or an empty string.
    return false;
  }
}

/**
 * Best-effort. A failed delete leaves an orphan in the store, which is a
 * tidiness problem — never a reason to fail the post edit that triggered it.
 *
 * Covers can point anywhere: the seeded posts use stock photography, and an
 * author could paste an external URL. Asking Blob to delete a file it doesn't
 * own throws "Some urls are malformed" — so check first rather than catching
 * an error that was entirely predictable.
 */
export async function remove(url: string): Promise<void> {
  if (!isOurs(url)) return;

  try {
    await del(url);
  } catch (error) {
    console.warn("[storage] could not delete", url, error);
  }
}
