import { slugify } from "./text";

/**
 * Tags arrive as one comma-separated field. Parsing lives in one place so the
 * editor's live checks, the save action and a restored revision all agree on
 * what counts as a tag.
 */

export const MAX_TAGS = 10;
export const MAX_TAG_LENGTH = 40;

export type TagInput = { name: string; slug: string };

export function parseTags(raw: string): TagInput[] {
  const seen = new Set<string>();
  const tags: TagInput[] = [];

  for (const piece of raw.split(",")) {
    const name = piece.trim().replace(/\s+/g, " ").slice(0, MAX_TAG_LENGTH);
    const slug = slugify(name);
    // "SEO" and "seo" are one tag; the first spelling given wins.
    if (!name || !slug || seen.has(slug)) continue;
    seen.add(slug);
    tags.push({ name, slug });
    if (tags.length === MAX_TAGS) break;
  }

  return tags;
}

export const formatTags = (tags: { name: string }[]) =>
  tags.map((tag) => tag.name).join(", ");
