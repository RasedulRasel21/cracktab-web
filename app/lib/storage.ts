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
 * Identifies an image by its magic bytes. Deliberately covers only the formats
 * in ALLOWED — SVG is absent on purpose, since it is XML that can carry script.
 */
export function sniffImageType(bytes: Uint8Array): string | null {
  const at = (offset: number, ...values: number[]) =>
    values.every((value, i) => bytes[offset + i] === value);
  const ascii = (offset: number, text: string) =>
    [...text].every((char, i) => bytes[offset + i] === char.charCodeAt(0));

  if (at(0, 0xff, 0xd8, 0xff)) return "image/jpeg";
  if (at(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (ascii(0, "GIF87a") || ascii(0, "GIF89a")) return "image/gif";
  if (ascii(0, "RIFF") && ascii(8, "WEBP")) return "image/webp";
  if (ascii(4, "ftypavif") || ascii(4, "ftypavis")) return "image/avif";
  return null;
}

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

  // The browser's `file.type` is whatever the client says it is — a renamed
  // HTML or SVG file arrives labelled image/png just as easily. Check the
  // file's actual leading bytes, and trust the sniffed type from here on.
  const sniffed = sniffImageType(new Uint8Array(await file.slice(0, 16).arrayBuffer()));
  if (!sniffed) {
    throw new UploadError("That file isn't a valid image, whatever its extension says.");
  }
  if (sniffed !== file.type && !(sniffed === "image/jpeg" && file.type === "image/jpg")) {
    throw new UploadError("The file's contents don't match its type. Re-export it and try again.");
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
