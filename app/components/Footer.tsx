import Link from "next/link";
import { footerColumns, contact, socials } from "../lib/site";

function SocialIcon({ name }: { name: string }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", "aria-hidden": true };
  switch (name) {
    case "facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common} fill="currentColor">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45Z" />
        </svg>
      );
    case "pinterest":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 2a10 10 0 0 0-3.65 19.31c-.09-.82-.17-2.08.03-2.98.19-.8 1.2-5.1 1.2-5.1s-.31-.61-.31-1.52c0-1.42.83-2.48 1.86-2.48.88 0 1.3.66 1.3 1.45 0 .88-.56 2.2-.85 3.42-.24 1.02.51 1.85 1.52 1.85 1.83 0 3.23-1.93 3.23-4.71 0-2.46-1.77-4.18-4.29-4.18-2.93 0-4.64 2.19-4.64 4.45 0 .88.34 1.83.76 2.34a.3.3 0 0 1 .07.29c-.08.32-.25 1.02-.28 1.16-.04.18-.15.22-.34.13-1.26-.59-2.05-2.43-2.05-3.91 0-3.18 2.31-6.1 6.66-6.1 3.5 0 6.22 2.49 6.22 5.82 0 3.47-2.19 6.27-5.23 6.27-1.02 0-1.98-.53-2.31-1.16l-.63 2.4c-.23.87-.84 1.97-1.25 2.64A10 10 0 1 0 12 2Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common} fill="currentColor">
          <path d="M23.5 6.5a3 3 0 0 0-2.11-2.12C19.5 3.86 12 3.86 12 3.86s-7.5 0-9.39.52A3 3 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3 3 0 0 0 2.11 2.12C4.5 20.14 12 20.14 12 20.14s7.5 0 9.39-.52a3 3 0 0 0 2.11-2.12C24 15.6 24 12 24 12s0-3.6-.5-5.5ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer() {
  return (
    <footer className="relative flex min-h-[55vh] flex-col overflow-hidden border-t border-line bg-black text-white">
      {/* Giant brand watermark — centered, content overlaps it */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 translate-y-[16%] whitespace-nowrap text-center font-display text-[19vw] font-bold leading-none tracking-tighter text-white/6"
      >
        cracktab®
      </span>

      <div className="relative z-10 mx-auto flex w-full max-w-360 flex-1 flex-col justify-between px-5 pb-10 pt-16 sm:px-8 sm:pt-20">
        {/* Top: nav (left) + address (right) */}
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            {footerColumns.map((col) => (
              <div key={col.heading}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                  {col.heading}
                </h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-white/70 transition-colors hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Address — right side */}
          <div className="flex flex-col gap-4 text-sm text-white/70 sm:max-w-sm sm:items-end sm:text-right">
            <a
              href={contact.phoneHref}
              className="font-semibold text-white transition-colors hover:text-accent"
            >
              {contact.phone}
            </a>
            {contact.offices.map((office) => (
              <p key={office.label} className="leading-relaxed">
                <span className="font-semibold text-white">{office.label}:</span>{" "}
                {office.address}
              </p>
            ))}
          </div>
        </div>

        {/* Bottom bar: copyright + legal (left) · socials (right) */}
        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/50">
            <span>© 2026 Cracktab. All rights reserved.</span>
            <Link href="/imprint" className="transition-colors hover:text-white">
              Imprint
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
          </div>

          <ul className="flex items-center gap-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-white/70 transition-colors hover:border-accent hover:text-accent"
                >
                  <SocialIcon name={s.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
