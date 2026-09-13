import type { NextConfig } from "next";
import { LOGIN_PATH, STUDIO_BASE } from "./app/lib/paths";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy — without nonces, deliberately.
 *
 * A strict nonce-based CSP requires every page to render dynamically, because
 * a fresh nonce is minted per request. The public blog is statically generated
 * on purpose so visitors don't put a query on the shared database droplet, so a
 * nonce CSP would undo that. This policy keeps `'unsafe-inline'` for scripts —
 * the weaker part — while locking down everything that doesn't cost static
 * rendering: no plugins, no framing of this site, no forms posting elsewhere,
 * and an explicit list of every origin allowed to supply images or frames.
 *
 * The origin lists come from an inventory of the codebase. If a new embed is
 * added and silently fails to load, this is the first place to look.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://*.public.blob.vercel-storage.com https://images.pexels.com",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "media-src 'self'",
  // The site's only embeds: the Calendly booking calendar and the office map.
  "frame-src https://calendly.com https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Not in development: it would upgrade http://localhost subresources to an
  // https origin that isn't listening.
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  ...(isDev
    ? []
    : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
];

/**
 * Extra rules for the studio and sign-in pages, applied after the site-wide
 * set so they win where keys overlap.
 *
 * `no-referrer` matters more than it looks: without it, clicking any outbound
 * link from inside the studio would send its full URL — the hidden path — to
 * whatever site the link points at.
 */
const studioHeaders = [
  { key: "Cache-Control", value: "no-store, max-age=0" },
  { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
  { key: "Referrer-Policy", value: "no-referrer" },
];

const nextConfig: NextConfig = {
  // Stops advertising the framework in every response header.
  poweredByHeader: false,

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: STUDIO_BASE, headers: studioHeaders },
      { source: `${STUDIO_BASE}/:path*`, headers: studioHeaders },
      { source: LOGIN_PATH, headers: studioHeaders },
    ];
  },

  images: {
    /**
     * `next/image` refuses any remote host that isn't listed here, so every
     * origin a post cover can come from needs an entry.
     */
    remotePatterns: [
      {
        // Vercel Blob — where uploaded covers and inline images live. The
        // hostname is <storeId>.public.blob.vercel-storage.com, and the store
        // id isn't known until the store is created, hence the wildcard.
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      {
        // Stock photography on the seeded placeholder posts. `search` is
        // deliberately left unset: Pexels serves its sizing through a query
        // string, and setting it to "" would reject exactly those URLs.
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;
