"use client";

import { useEffect } from "react";
import { track } from "../lib/track";

/**
 * Sends contact_click (method: phone | email) for every tel: and mailto: link
 * on the site, from one delegated listener, so new links are covered without
 * touching each one.
 */
export default function ContactClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      const href = link?.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) track("contact_click", { method: "phone" });
      else if (href.startsWith("mailto:")) track("contact_click", { method: "email" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
