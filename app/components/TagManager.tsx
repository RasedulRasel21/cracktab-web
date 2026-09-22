"use client";

import { GoogleTagManager } from "@next/third-parties/google";
import { usePublicPage } from "./usePublicPage";

/**
 * Google Tag Manager, through Next's official component: the container
 * script loads after hydration, so it stays out of the critical path.
 *
 * Marketing configures every tag (GA4, Ads, Clarity…) inside GTM itself, so
 * nothing else about tracking lives in this codebase — and GA4 must not be
 * added here as well, or every page view is counted twice.
 *
 * Kept off the studio, sign-in and preview pages: see usePublicPage.
 */
export default function TagManager({ gtmId }: { gtmId: string }) {
  if (!usePublicPage()) return null;
  return <GoogleTagManager gtmId={gtmId} />;
}
