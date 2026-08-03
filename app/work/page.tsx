import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../components/PageHeader";
import CtaBand from "../components/CtaBand";
import { works } from "../lib/site";

export const metadata: Metadata = {
  title: "Our Works",
  description:
    "A look at Shopify stores we've designed, built, and grown. Real brands, real results.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Works"
        title={
          <>
            Shopify stores we&apos;ve{" "}
            <span className="text-accent">designed, built &amp; grown.</span>
          </>
        }
        subtitle="Real brands, real results. A look at some of the stores we've shipped and scaled."
      />

      <section className="pb-20 sm:pb-28">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((w) => (
              <Link
                key={w.name}
                href="/work"
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-line"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${w.img})` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-xl font-medium tracking-tight text-white sm:text-2xl">
                    {w.name}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/80">
                    {w.teaser}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Want results like these?" />
    </>
  );
}
