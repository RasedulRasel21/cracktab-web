import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Deliberately does NOT list the studio or login paths. robots.txt is
      // public and it is the first file an attacker reads — a Disallow line is
      // a signpost to exactly the URL you meant to keep quiet. Crawlers are
      // kept out by `robots: noindex` metadata on those pages instead, and the
      // proxy returns 404 to anyone without a session.
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
