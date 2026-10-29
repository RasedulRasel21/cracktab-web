/**
 * Pushes a lead event into Google Tag Manager's dataLayer. Marketing builds
 * the GTM triggers, GA4 conversions and Google Ads conversion actions on top
 * of these names, so renaming one breaks their setup: tell them first.
 *
 * Events: contact_form_submit, calendly_click, calendly_booking_complete,
 * contact_click (method: phone | email).
 *
 * Safe to call when GTM isn't loaded (local dev, studio): the array just
 * collects pushes nobody reads.
 */
export function track(event: string, params: Record<string, string | undefined> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}
