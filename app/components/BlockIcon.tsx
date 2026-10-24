/**
 * Line icons for the block library grid on app pages, keyed by block name.
 * A name without an icon renders nothing, so the tile shows its name alone.
 */
const paths: Record<string, React.ReactNode> = {
  Upsell: <path d="M12 19V5M6 11l6-6 6 6" />,
  "Cross-sell": <path d="M4 7h13l-3-3M20 17H7l3 3" />,
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
  "Live visitors": (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  "Free shipping bar": (
    <>
      <path d="M2 6h12v10H2zM14 10h4l4 4v2h-8" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  "Star ratings": <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z" />,
  Testimonials: <path d="M4 5h16v11H9l-5 4z" />,
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
  "Trust badges": (
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
