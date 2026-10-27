/**
 * Line icons for the block library grid on app pages, keyed by block name.
 * A name without an icon renders nothing, so the tile shows its name alone.
 */
const paths: Record<string, React.ReactNode> = {
  Upsell: <path d="M12 19V5M6 11l6-6 6 6" />,
  "Cart upsell": (
    <>
      <path d="M3 4h2l2.5 11h11L21 7H7" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </>
  ),
  "Countdown timer": (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5M9 2h6" />
    </>
  ),
  "Stock indicator": (
    <>
      <path d="M3 7l9-4 9 4v10l-9 4-9-4z" />
      <path d="M3 7l9 4 9-4M12 11v10" />
    </>
  ),
  "Social proof": (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5a3 3 0 010 6M21 20c0-2.6-1.6-4.8-4-5.6" />
    </>
  ),
  "Estimated delivery": (
    <>
      <path d="M2 6h12v10H2zM14 10h4l4 4v2h-8" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  "Benefits grid": (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  "Payment icons": (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M6 15h4" />
    </>
  ),
  Features: <path d="M4 6l1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17M11 6h9M11 12h9M11 18h9" />,
  "Copy discount": (
    <>
      <path d="M20 12l-8 8-9-9V3h8z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </>
  ),
  Badge: <rect x="3" y="8" width="18" height="8" rx="4" />,
  "Direct checkout": <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  "Sticky add to cart": (
    <>
      <rect x="3" y="15" width="18" height="6" rx="2" />
      <path d="M12 3v8M8 7l4 4 4-4" />
    </>
  ),
  "Announcement bar": (
    <>
      <rect x="2" y="4" width="20" height="5" rx="1" />
      <path d="M2 13h20M2 17h14" />
    </>
  ),
  "FAQ accordion": (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M3 15h18M16 7l1.5 1.5L19 7" />
    </>
  ),
  "Comparison table": (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M12 4v16" />
    </>
  ),
  "Guarantee banner": (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z" />
      <path d="M8.5 12l2.5 2.5 4.5-4.5" />
    </>
  ),
  "Logo slider": (
    <>
      <rect x="5" y="7" width="14" height="10" rx="2" />
      <path d="M2 10l-1 2 1 2M22 10l1 2-1 2" />
    </>
  ),
};

export default function BlockIcon({ name }: { name: string }) {
  const icon = paths[name];
  if (!icon) return null;
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-accent"
    >
      {icon}
    </svg>
  );
}
