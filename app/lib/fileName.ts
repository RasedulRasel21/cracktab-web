/**
 * Readable names for stored files. Blob appends a random suffix to every
 * upload ("hero-AbC123…xyz.webp"); these strip it so people see the name
 * they uploaded. Plain functions — safe on the server and in the browser.
 */

const BLOB_SUFFIX = /-[A-Za-z0-9]{20,}(?=\.[a-z0-9]+$)/;

/** "hero.webp" */
export function fileName(url: string): string {
  try {
    const last = decodeURIComponent(new URL(url).pathname.split("/").pop() ?? "");
    return last.replace(BLOB_SUFFIX, "") || last;
  } catch {
    return url;
  }
}

/** "hero" — for tiles that show the type separately. */
export function displayName(url: string): string {
  const name = fileName(url);
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
}

/** "image/jpeg" → "JPG" */
export function typeLabel(mimeType: string): string {
  const subtype = mimeType.split("/")[1] ?? "";
  return subtype === "jpeg" ? "JPG" : subtype.toUpperCase();
}
