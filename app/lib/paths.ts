/**
 * Public URLs for the studio and its sign-in page.
 *
 * The files live at app/admin and app/login, but those paths are never
 * reachable by name — proxy.ts returns the site's ordinary 404 for them, and
 * rewrites these public paths onto them instead.
 *
 * Read from the environment so the paths can change without a code change:
 * different per deploy, and rotatable if one ever leaks.
 *
 * SERVER-SIDE ONLY. Importing this into a client component would inline the
 * studio path into the JavaScript served to every visitor, which would publish
 * the one thing it exists to keep quiet.
 */

/** Routes a studio path must never shadow. */
const RESERVED = new Set([
  "admin", "login", "api", "_next",
  "blog", "about", "contact", "faq", "imprint", "privacy",
  "services", "themes", "work",
]);

function segment(value: string | undefined, fallback: string): string {
  const cleaned = (value ?? "")
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9-]/g, "");

  if (cleaned && RESERVED.has(cleaned.toLowerCase())) {
    console.warn(`[paths] "${cleaned}" would shadow a real route — using "${fallback}".`);
    return `/${fallback}`;
  }

  return `/${cleaned || fallback}`;
}

export const STUDIO_BASE = segment(process.env.STUDIO_PATH, "cms-manager");

const login = segment(process.env.LOGIN_PATH, "cms-access");
/** Falls back if someone sets both variables to the same value. */
export const LOGIN_PATH = login === STUDIO_BASE ? "/cms-access" : login;

/** A path inside the studio, e.g. studio("/posts/new"). */
export const studio = (path = "") => `${STUDIO_BASE}${path}`;
