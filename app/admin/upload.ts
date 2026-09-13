"use client";

/**
 * Browser-side image upload, shared by the editor, the cover field, the media
 * library and its picker. Kept out of Editor.tsx so the picker can use it
 * without the two modules importing each other.
 */

const MAX_DIMENSION = 1800;
const COMPRESS_QUALITY = 0.82;

/**
 * Phone cameras produce 4–8 MB images that no blog needs. Downscaling in the
 * browser keeps uploads fast on the slow connections these get written on, and
 * keeps the Blob store small.
 */
async function compress(file: File): Promise<File> {
  // GIFs are usually animated; re-encoding through a canvas kills the motion.
  if (file.type === "image/gif") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));

  if (scale === 1 && file.size < 600_000) return file;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");
  if (!context) return file;
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", COMPRESS_QUALITY),
  );

  if (!blob || blob.size >= file.size) return file;

  const stem = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${stem}.webp`, { type: "image/webp" });
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  const body = new FormData();
  body.append("file", await compress(file));
  body.append("folder", folder);

  const response = await fetch("/api/upload", { method: "POST", body });
  const data = await response.json();

  if (!response.ok) throw new Error(data.error ?? "Upload failed.");
  return data.url as string;
}
