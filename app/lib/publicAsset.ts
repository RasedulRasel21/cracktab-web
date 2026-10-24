import { existsSync } from "node:fs";
import path from "node:path";

const EXTENSIONS = [".webp", ".avif", ".png", ".jpg", ".svg"];

/**
 * Resolves an image slot (a public path without extension) to the file that
 * is actually in public/, or undefined when none is. Lets a page wire up its
 * image slots before the artwork exists and render nothing until it lands —
 * no placeholders, no broken images.
 *
 * Only call this from statically rendered pages: it reads the filesystem at
 * build time, and public/ isn't bundled into serverless functions.
 */
export function findPublicAsset(slot: string): string | undefined {
  for (const ext of EXTENSIONS) {
    const file = `${slot}${ext}`;
    if (existsSync(path.join(process.cwd(), "public", file))) return file;
  }
  return undefined;
}
