import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../components/PageHeader";
import { blogPosts } from "../lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Build stories, industry notes, and behind-the-scenes content from the Cracktab team.",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title={
          <>
            Build stories &amp; <span className="text-accent">field notes.</span>
          </>
        }
        subtitle="Behind-the-scenes on how we build, migrate, and grow Shopify stores — plus the occasional industry note."
      />

      <section className="pb-20 sm:pb-28">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.title}
                href="/blog"
                className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors hover:border-accent/50"
              >
                <div
                  className="aspect-[16/10] bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${post.img})` }}
                />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-muted">
                    <span className="text-accent">{post.category}</span>
                    <span>·</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-medium leading-snug tracking-tight text-white transition-colors group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
