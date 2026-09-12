import sanitizeHtml from "sanitize-html";

/**
 * Cleans editor HTML before it is stored.
 *
 * Sanitising on write, not on render: the post body is injected with
 * `dangerouslySetInnerHTML`, so whatever reaches the database is what reaches
 * the browser. Doing it here means one place to audit, and no per-request cost.
 *
 * The allowlist matches what the Tiptap toolbar can actually produce. Anything
 * else — script, style, iframe, event handlers, `javascript:` URLs — is
 * dropped rather than escaped, because a stripped tag is a visible bug while
 * an escaped one looks like content.
 *
 * Authors are trusted colleagues, so this is not the primary defence. It is
 * the backstop for a pasted payload from a compromised source, and for the day
 * an account is shared more widely than intended.
 *
 * h1 is allowed through. An earlier version silently rewrote it to h2 — the
 * page already has one h1 in the post title, and a second is an SEO fault —
 * but silently changing what an author wrote is worse than letting them make
 * the call. The editor labels it "title level" instead.
 */
export function sanitizeBody(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: [
      "p", "br", "hr",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "strong", "em", "u", "s", "code",
      "ul", "ol", "li",
      "blockquote", "pre",
      "a", "img",
      "table", "thead", "tbody", "tfoot", "tr", "th", "td", "colgroup", "col",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      // Cell spans and the column widths the resizable table writes.
      th: ["colspan", "rowspan", "colwidth", "style"],
      td: ["colspan", "rowspan", "colwidth", "style"],
      col: ["style", "width"],
      p: ["style"],
      h1: ["style"], h2: ["style"], h3: ["style"],
      h4: ["style"], h5: ["style"], h6: ["style"],
    },
    /**
     * `style` is allowed on those tags only for the two properties the editor
     * can actually produce, matched against a fixed pattern. An open style
     * attribute is a real hazard — `position:fixed` over the page, or a
     * `url()` that phones home on render.
     */
    allowedStyles: {
      "*": {
        "text-align": [/^(left|center|right|justify)$/],
        "min-width": [/^\d{1,4}px$/],
        width: [/^\d{1,4}px$/],
      },
    },
    // http/https only — blocks `javascript:` and `data:` URIs, the latter
    // being a common way to smuggle an SVG payload past a tag allowlist.
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https"] },
    transformTags: {
      // Anything leaving the site opens in a new tab, and never with an
      // exploitable `window.opener` handle back to us.
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer nofollow" },
      }),
    },
    nonTextTags: ["style", "script", "textarea", "option", "noscript"],
  });
}
