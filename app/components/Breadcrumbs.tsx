import Link from "next/link";

export type Crumb = { name: string; href?: string };

/** Visible trail. The last crumb is the current page and isn't a link. */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={item.name} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">›</span>}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-accent">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-white">
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
