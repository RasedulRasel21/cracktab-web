import Link from "next/link";
import { caseStudies, pexels } from "../lib/site";

type Tile = { src: string; href: string | null; name: string | null };

/**
 * "Example Work" bento grid.
 *
 * Fills with real work first — this service's own case studies lead, then every
 * other real case study, then the shots for brands that don't have a case-study
 * page yet. Only once those run out do Pexels placeholders fill the remainder.
 * `seed` rotates both pools so two services don't show an identical grid.
 */

// Real work without a case-study page of its own — shown, but not linked.
const EXTRA_REAL: { src: string; name: string }[] = [
  { src: "/works/Femdisc.png", name: "Femdisc" },
  { src: "/works/Lockeroom.jpg", name: "Lockeroom" },
  { src: "/works/Luxe-cosmetics.jpg", name: "Luxe Cosmetics" },
  { src: "/works/Seetrueglasses.jpg", name: "SeeTrue Glasses" },
];

const FILLER = [
  3735641, 4481259, 1029896, 2536965, 1266139, 6311392, 5632402, 3585047,
  6311663, 4041392, 3373736, 2693644,
];

/**
 * Two tiles per column over a 12-row track. Columns 1 and 4 run tall-then-short
 * (8+4) while the rest split 5+7 — the differing break points are what give the
 * grid its staggered, bento rhythm rather than a flat two-row band.
 */
const SPANS = [
  "lg:row-span-8",
  "lg:row-span-4",
  "lg:row-span-5",
  "lg:row-span-7",
  "lg:row-span-5",
  "lg:row-span-7",
  "lg:row-span-8",
  "lg:row-span-4",
  "lg:row-span-5",
  "lg:row-span-7",
  "lg:row-span-5",
  "lg:row-span-7",
];

function rotate<T>(items: T[], by: number): T[] {
  if (items.length === 0) return items;
  const n = ((by % items.length) + items.length) % items.length;
  return [...items.slice(n), ...items.slice(0, n)];
}

export default function WorkMosaic({
  slugs,
  seed = 0,
}: {
  slugs: string[];
  seed?: number;
}) {
  // This service's own examples first, then every other real case study.
  const featured = slugs
    .map((slug) => caseStudies.find((c) => c.slug === slug))
    .filter((c) => c !== undefined)
    .filter((c) => !c.placeholder);

  const rest = caseStudies
    .filter((c) => !c.placeholder)
    .filter((c) => !featured.some((f) => f.slug === c.slug));

  const real: Tile[] = [
    ...[...featured, ...rest].map((c) => ({
      src: c.img,
      href: `/work/${c.slug}`,
      name: c.name,
    })),
    ...rotate(EXTRA_REAL, seed).map((x) => ({
      src: x.src,
      href: null,
      name: x.name,
    })),
  ];

  const tiles: Tile[] = Array.from({ length: SPANS.length }, (_, i) => {
    if (i < real.length) return real[i];
    const id = FILLER[(i - real.length + seed) % FILLER.length];
    return { src: pexels(id, 700, 900), href: null, name: null };
  });

  return (
    // Below lg the row spans are inert and tiles fall into a plain square grid;
    // at lg the flow turns column-wise so each pair stacks into its own column.
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:h-[34rem] lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none lg:grid-rows-12">
      {tiles.map((tile, i) => {
        const shell = `group relative block aspect-square overflow-hidden rounded-xl border border-line lg:aspect-auto ${SPANS[i]}`;

        const body = (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: `url(${tile.src})` }}
            />
            {tile.name && (
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent p-3 pt-10 font-display text-xs font-semibold tracking-tight text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {tile.name}
              </span>
            )}
          </>
        );

        return tile.href ? (
          <Link
            key={i}
            href={tile.href}
            aria-label={`View ${tile.name} case study`}
            className={shell}
          >
            {body}
          </Link>
        ) : (
          <div
            key={i}
            aria-hidden={tile.name ? undefined : "true"}
            className={shell}
          >
            {body}
          </div>
        );
      })}
    </div>
  );
}
