"use client";

import { useSyncExternalStore } from "react";

/**
 * True only in the browser, and only on a page the public can reach.
 *
 * Third-party scripts — Google Tag Manager, the Preferred Sources button —
 * must never run on the studio, the sign-in page or a draft preview. Anyone
 * with GTM access can publish arbitrary JavaScript to every page it loads on,
 * and analytics there would report the hidden studio path to Google.
 *
 * The check reads the DOM for markers those pages render, rather than the
 * pathname: a pathname check would ship the hidden studio path in the
 * JavaScript sent to every visitor.
 *
 *  • `.studio-page` — the studio shell and the sign-in page (it also hides
 *    the site header and footer, via globals.css).
 *  • `[data-private-page]` — private pages that keep the site's own chrome,
 *    such as the draft preview.
 *
 * False during server rendering, so none of this is in the HTML of any page;
 * otherwise a private page would start fetching the script before hydration
 * could remove it.
 */

const subscribe = () => () => {};

const isPublic = () =>
  document.querySelector(".studio-page, [data-private-page]") === null;

export function usePublicPage(): boolean {
  return useSyncExternalStore(subscribe, isPublic, () => false);
}
