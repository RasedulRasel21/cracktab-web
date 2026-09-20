"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

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

const subscribe = () => () => {};

/**
 * The studio hides the site footer with CSS, which would still leave Google's
 * script loading on every admin page. Reading the DOM for the studio's own
 * marker class keeps the check out of the JavaScript sent to visitors — a
 * pathname check would ship the hidden studio path to everyone.
 *
 * Nothing renders on the server ("server" below): the markup would otherwise
 * be in the HTML of studio pages too, and the browser would fetch Google's
 * script before hydration could remove it.
 */
const where = () => (document.querySelector(".studio-page") ? "studio" : "site");

export default function PreferredSourceButton() {
  const place = useSyncExternalStore(subscribe, where, () => "server" as const);
  if (place !== "site") return null;

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
