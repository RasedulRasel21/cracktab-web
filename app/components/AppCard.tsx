import Image from "next/image";
import Link from "next/link";
import { appHref, type ShopifyApp } from "../lib/apps";

/**
 * One app in the hub grid (and the "Other Cracktab apps" row). The whole card
 * is the link. An app without a live page yet renders as a plain card, so the
 * grid never points at a 404 — see `pageLive` in lib/apps.ts.
 */
export default function AppCard({
  app,
  icon,
  vignette,
  wide = false,
  fallbackHref,
  headingLevel = "h3",
}: {
  app: ShopifyApp;
  /** Span two grid columns from tablet up (the hub's featured card). */
  wide?: boolean;
  /**
   * Where to send an app that has no page yet, e.g. back to the hub from the
   * "Other Cracktab apps" row. Without it the card isn't a link.
   */
  fallbackHref?: string;
  /** Resolved public paths, or undefined to render nothing in that slot. */
  icon?: string;
  vignette?: string;
  headingLevel?: "h2" | "h3";
}) {
  const ownLink = appHref(app);
  const link = ownLink ?? (fallbackHref ? { href: fallbackHref, external: false } : null);
  const Heading = headingLevel;

  const body = (
    <>
      <div className="flex items-start justify-between gap-4">
        {icon ? (
          <Image
            src={icon}
            alt=""
            width={56}
            height={56}
            unoptimized={icon.endsWith(".svg")}
            className="h-14 w-14 rounded-2xl"
          />
        ) : (
          <span />
        )}
        <span className="rounded-full border border-accent/40 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-accent">
          {app.badge}
        </span>
      </div>

      {vignette && (
        <Image
          src={vignette}
          alt=""
          width={800}
          height={500}
          unoptimized={vignette.endsWith(".svg")}
          className="mt-6 h-auto w-full rounded-xl border border-line"
        />
      )}

      <Heading className="mt-6 font-display text-2xl font-medium tracking-tight text-white">
        {app.name}
      </Heading>
      <p className="mt-3 text-sm leading-relaxed text-muted">{app.line}</p>

      {app.chips.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {app.chips.map((chip) => (
            <li
              key={chip}
              className="rounded-full border border-line px-3 py-1 text-xs font-medium text-white/80"
            >
              {chip}
            </li>
          ))}
        </ul>
      )}

      <span
        className={`mt-auto pt-8 font-display text-sm font-semibold uppercase tracking-wide ${
          link ? "text-accent" : "text-muted"
        }`}
      >
        {ownLink
          ? ownLink.external
            ? "Visit aigrowthkits.app ↗"
            : "Learn more →"
          : link
            ? "See all apps →"
            : "Page coming soon"}
      </span>
    </>
  );

  const className = `flex h-full flex-col rounded-3xl border border-line bg-surface p-6 sm:p-8 ${
    wide ? "sm:col-span-2" : ""
  }`;
  const linkClass = `${className} transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent`;

  if (!link) return <div className={className}>{body}</div>;

  // Same tab is fine for aigrowthkits.app, per the hub doc; noopener still.
  return link.external ? (
    <a href={link.href} rel="noopener" className={linkClass}>
      {body}
    </a>
  ) : (
    <Link href={link.href} className={linkClass}>
      {body}
    </Link>
  );
}
