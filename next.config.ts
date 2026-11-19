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
  // news.google.com serves Google's "Preferred Sources" button script, which
  // draws itself in the footer and talks back to the same origin.
  //
  // The googletagmanager / google-analytics / doubleclick / googleadservices
  // origins are Google Tag Manager and the tags marketing runs inside it (GA4
  // now, Google Ads conversions later), per marketing's GTM setup guide.
  // 'unsafe-inline' must stay in script-src: GTM's custom HTML tags need it.
  // connect.facebook.net and *.clarity.ms are the Meta Pixel and Microsoft
  // Clarity tags marketing publishes from inside GTM. Every tag they add
  // needs its origins here, or the browser blocks it with no visible error.
  // snap.licdn.com and bat.bing.com are the LinkedIn Insight and Bing UET
  // tags marketing plans to add, allowed ahead of time.
  // *.apollo.io is Apollo's website visitor tracker, a Custom HTML tag in GTM
  // (container GTM-WM6GSH8X). It loads from assets.apollo.io, reports visits
  // back to Apollo and may use a pixel, so it is in script-, connect- and
  // img-src. Don't add the script to the site code: GTM already loads it.
  `script-src 'self' 'unsafe-inline' https://news.google.com https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://connect.facebook.net https://*.clarity.ms https://snap.licdn.com https://bat.bing.com https://*.apollo.io${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://www.gstatic.com https://www.googletagmanager.com",
  // GA4 falls back to image pixels when fetch fails, and Google Signals loads
  // an audience pixel from the visitor's country domain (www.google.com.bd
  // for the team's own visits; other countries' domains stay blocked, which
  // only affects Signals, not page views).
  "img-src 'self' blob: data: https://*.public.blob.vercel-storage.com https://images.pexels.com https://news.google.com https://www.gstatic.com https://*.googleusercontent.com https://www.googletagmanager.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.google.com https://www.google.com.bd https://stats.g.doubleclick.net https://*.g.doubleclick.net https://googleads.g.doubleclick.net https://www.googleadservices.com https://www.facebook.com https://*.clarity.ms https://c.bing.com https://bat.bing.com https://px.ads.linkedin.com https://*.apollo.io",
  "font-src 'self'",
  // A CSP wildcard needs at least one subdomain label: *.analytics.google.com
  // does NOT match analytics.google.com, which is where GA4 sends its hits.
  // Both are listed, plus www.google.com and stats.g.doubleclick.net (Google
  // Signals and Ads linking). Without them GA4 recorded nothing.
  `connect-src 'self' https://news.google.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.google.com https://stats.g.doubleclick.net https://googleads.g.doubleclick.net https://*.g.doubleclick.net https://www.googleadservices.com https://www.facebook.com https://*.clarity.ms https://c.bing.com https://bat.bing.com https://px.ads.linkedin.com https://*.apollo.io${isDev ? " ws:" : ""}`,
  "media-src 'self'",
  // Embeds: the Calendly booking calendar, the office map, the frame the
  // Preferred Sources button opens, GTM Preview / Tag Assistant, and the
  // click-to-play YouTube demo videos on the Shopify app pages.
  "frame-src https://calendly.com https://www.google.com https://maps.google.com https://news.google.com https://www.googletagmanager.com https://tagassistant.google.com https://www.youtube-nocookie.com",
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

  async redirects() {
    return [
      // The App Store listings point their privacy link at /privacy-policy;
      // the policy itself lives at /privacy.
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      // The App Store listing form rejects any URL containing "shopify", so
      // listing links (FAQ, support…) use /apps/<slug>. One segment only, so
      // the image files under public/apps/<slug>/ are untouched.
      // Renamed post: this URL was indexed in September and 404'd after.
      {
        source: "/blog/when-a-custom-shopify-app-beats-an-off-the-shelf-one",
        destination: "/blog/shopify-apps-vs-custom-development",
        permanent: true,
      },
      { source: "/apps", destination: "/shopify-apps", permanent: true },
      // 15 service pages were merged into three (see serviceDetails).
      ...Object.entries({
        "shopify-store-migration": "shopify-development",
        "shopify-store-redesign": "shopify-development",
        "ui-ux-design": "shopify-development",
        "ecommerce-seo": "shopify-development",
        "custom-business-websites": "shopify-app-development",
        "web-application-development": "shopify-app-development",
        "shopify-speed-optimization": "ecommerce-growth-cro",
        "shopify-conversion-audit": "ecommerce-growth-cro",
        "ecommerce-management": "ecommerce-growth-cro",
        "branding-visual-identity": "ecommerce-growth-cro",
        "ai-business-automation": "ecommerce-growth-cro",
      }).map(([from, to]) => ({ source: `/services/${from}`, destination: `/services/${to}`, permanent: true })),
      // Removed pages: send old links somewhere useful instead of a 404.
      { source: "/services/digital-marketing", destination: "/services", permanent: true },
      { source: "/work/orbes", destination: "/work", permanent: true },
      { source: "/apps/:slug", destination: "/shopify-apps/:slug", permanent: true },
    ];
  },

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
