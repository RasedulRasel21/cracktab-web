import { htmlToText, slugify } from "../lib/text";

/**
 * On-page SEO checks, run live in the editor as the author writes. Pure — no
 * DOM, no network — so the same rules run on the server for revision counts.
 */

export type SeoFields = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  slug: string;
  bodyHtml: string;
  coverUrl: string;
  coverAlt: string;
  categoryId: string;
  tags: string;
};

export type Check = {
  id: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
};

/** Google cuts titles at roughly 600px — about 60 characters of average text. */
export const TITLE_LIMIT = 60;
export const DESCRIPTION_LIMIT = 160;
const THIN_WORDS = 300;

export const wordCount = (html: string) =>
  htmlToText(html).split(" ").filter(Boolean).length;

export function runSeoChecks(fields: SeoFields): Check[] {
  const checks: Check[] = [];
  const add = (id: string, label: string, status: Check["status"], detail: string) =>
    checks.push({ id, label, status, detail });

  const title = (fields.metaTitle || fields.title).trim();
  if (!title) add("title", "Title", "fail", "Add a title.");
  else if (title.length > TITLE_LIMIT)
    add("title", "Title", "warn", `${title.length} characters — Google shows about ${TITLE_LIMIT}. Set a shorter meta title.`);
  else if (title.length < 20)
    add("title", "Title", "warn", "Very short — say what the post is about.");
  else add("title", "Title", "pass", `${title.length} characters.`);

  const description = (fields.metaDescription || fields.excerpt).trim();
  if (!description)
    add("description", "Description", "fail", "No excerpt or meta description — Google will pick a sentence for you.");
  else if (description.length > DESCRIPTION_LIMIT)
    add("description", "Description", "warn", `${description.length} characters — trimmed after about ${DESCRIPTION_LIMIT}.`);
  else if (description.length < 70)
    add("description", "Description", "warn", "Short — use the space to earn the click.");
  else add("description", "Description", "pass", `${description.length} characters.`);

  const body = fields.bodyHtml;
  const words = wordCount(body);
  if (words === 0) add("length", "Length", "fail", "The post has no body text yet.");
  else if (words < THIN_WORDS)
    add("length", "Length", "warn", `${words} words — under ${THIN_WORDS} tends to read as thin to search engines.`);
  else add("length", "Length", "pass", `${words} words.`);

  const h1s = (body.match(/<h1[\s>]/gi) ?? []).length;
  if (h1s > 0)
    add("headings", "Headings", "warn", `The body has ${h1s} Heading 1 — the title is already the page's H1. Use Heading 2.`);
  else if (words >= THIN_WORDS && !/<h[23][\s>]/i.test(body))
    add("headings", "Headings", "warn", "No subheadings — break a long post up with Heading 2.");
  else add("headings", "Headings", "pass", "Structure looks right.");

  const images = body.match(/<img\b[^>]*>/gi) ?? [];
  const undescribed = images.filter((tag) => !/\balt="[^"]+"/i.test(tag)).length;
  if (undescribed > 0)
    add("alt", "Image descriptions", "fail", `${undescribed} of ${images.length} body image${images.length === 1 ? "" : "s"} missing alt text.`);
  else
    add("alt", "Image descriptions", "pass", images.length ? `All ${images.length} described.` : "No images in the body.");

  if (!fields.coverUrl)
    add("cover", "Cover image", "warn", "No cover — shared links will show without an image.");
  else if (!fields.coverAlt.trim()) add("cover", "Cover image", "fail", "The cover has no alt text.");
  else add("cover", "Cover image", "pass", "Set and described.");

  const internal = /href="(\/(?!\/)|https?:\/\/(www\.)?cracktab\.com)/i.test(body);
  add(
    "links",
    "Internal links",
    internal ? "pass" : "warn",
    internal ? "Links to another page on the site." : "No link to another Cracktab page — add one to a related post or service.",
  );

  const slug = fields.slug.trim() || slugify(fields.title);
  if (!slug) add("slug", "URL", "fail", "No URL yet — add a title.");
  else if (slug.length > 60)
    add("slug", "URL", "warn", "Long URL — shorter slugs are easier to read and share.");
  else add("slug", "URL", "pass", `/blog/${slug}`);

  add(
    "category",
    "Category",
    fields.categoryId ? "pass" : "warn",
    fields.categoryId ? "Filed in a category." : "Not in a category — it won't appear in any category archive.",
  );

  add(
    "tags",
    "Tags",
    fields.tags.trim() ? "pass" : "warn",
    fields.tags.trim() ? "Tagged." : "No tags yet.",
  );

  return checks;
}
