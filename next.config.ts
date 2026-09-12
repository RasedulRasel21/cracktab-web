import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
