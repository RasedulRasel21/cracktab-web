"use client";

import Script from "next/script";
import { usePublicPage } from "./usePublicPage";

/**
 * Google's "Preferred Sources" button. A reader who clicks it marks Cracktab
 * as a preferred source in their own Google Search results, which can earn a
 * badge in Top Stories and AI Overviews.
 *
 * Google's script draws and styles the button itself — the empty div below is
 * only a placeholder it fills in. Nothing renders if Google decides the site
 * isn't eligible, which is why there's no fallback markup to flash first.
 *
 * `afterInteractive` keeps a third-party request out of the critical path: the
 * page paints first, then this loads.
 */
export default function PreferredSourceButton() {
  if (!usePublicPage()) return null;

  return (
    <>
      <Script
        src="https://news.google.com/swg/js/v1/publisher.js"
        strategy="afterInteractive"
      />
      <div google-add-preferred-source-btn="" data-theme="dark" data-lang="en" />
    </>
  );
}
