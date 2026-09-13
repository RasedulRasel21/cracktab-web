import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "../../../../lib/auth";
import { prisma } from "../../../../lib/db";
import { studio } from "../../../../lib/paths";
import { MAX_REVISIONS } from "../../../../lib/revisions";
import { htmlToText } from "../../../../lib/text";
import ConfirmButton from "../../../ConfirmButton";
import { restoreRevision } from "../../../actions";

export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});
const when = (date: Date) => `${dateFormat.format(date)} UTC`;

const words = (html: string) => htmlToText(html).split(" ").filter(Boolean).length;

type Full = NonNullable<Awaited<ReturnType<typeof loadRevision>>>;

function loadRevision(id: string) {
  return prisma.postRevision.findUnique({ where: { id } });
}

/** What this save changed, compared with the one before it. */
function changes(current: Full, previous: Full | null): string[] {
  if (!previous) return ["First saved version"];

  const out: string[] = [];
  if (current.title !== previous.title) out.push("Title");
  if (current.slug !== previous.slug) out.push("URL");
  if (current.excerpt !== previous.excerpt) out.push("Excerpt");
  if (current.bodyHtml !== previous.bodyHtml) {
    const delta = words(current.bodyHtml) - words(previous.bodyHtml);
    out.push(delta === 0 ? "Body" : `Body (${delta > 0 ? "+" : ""}${delta} words)`);
  }
  if (current.coverUrl !== previous.coverUrl || current.coverAlt !== previous.coverAlt) out.push("Cover");
  if (current.categoryId !== previous.categoryId) out.push("Category");
  if (current.tagNames !== previous.tagNames) out.push("Tags");
  if (
    current.metaTitle !== previous.metaTitle ||
    current.metaDescription !== previous.metaDescription ||
    current.canonicalUrl !== previous.canonicalUrl ||
    current.noindex !== previous.noindex
  ) {
    out.push("SEO");
  }
  return out.length ? out : ["No content changes"];
}

export default async function RevisionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ rev?: string }>;
}) {
  const [{ id }, { rev }, user] = await Promise.all([params, searchParams, requireUser()]);

  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, title: true, authorId: true },
  });
  if (!post || (user.role !== "ADMIN" && post.authorId !== user.id)) notFound();

  // The list without bodies — up to fifty full posts is a lot to pull for a sidebar.
  const list = await prisma.postRevision.findMany({
    where: { postId: id },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, editorName: true, createdAt: true },
  });

  const selectedIndex = Math.max(0, rev ? list.findIndex((item) => item.id === rev) : 0);
  const selectedMeta = list[selectedIndex];

  const [selected, previous] = selectedMeta
    ? await Promise.all([
        loadRevision(selectedMeta.id),
        list[selectedIndex + 1] ? loadRevision(list[selectedIndex + 1].id) : Promise.resolve(null),
      ])
    : [null, null];

  const category = selected?.categoryId
    ? await prisma.category.findUnique({
        where: { id: selected.categoryId },
        select: { name: true },
      })
    : null;

  return (
    <>
      <div className="mb-10">
        <Link
          href={studio(`/posts/${post.id}/edit`)}
          className="text-xs font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent"
        >
          ← Back to editor
        </Link>
        <h1 className="mt-4 font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
          History
        </h1>
        <p className="mt-2 text-sm text-muted">
          {post.title} · every save is kept, up to the last {MAX_REVISIONS}.
        </p>
      </div>

      {list.length === 0 || !selected ? (
        <div className="rounded-2xl border border-line bg-surface p-8">
          <p className="text-sm text-muted">
            No history yet — it starts with the next save of this post.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[20rem_1fr]">
          <nav aria-label="Versions" className="lg:self-start">
            <ol className="flex flex-col gap-2">
              {list.map((item, index) => {
                const active = index === selectedIndex;
                return (
                  <li key={item.id}>
                    <Link
                      href={studio(`/posts/${post.id}/revisions${index === 0 ? "" : `?rev=${item.id}`}`)}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-xl border px-4 py-3 transition-colors ${
                        active ? "border-accent bg-accent/10" : "border-line bg-surface hover:border-accent"
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-white">{when(item.createdAt)}</span>
                        {index === 0 && <span className="studio-badge studio-badge-emerald">Current</span>}
                      </span>
                      <span className="mt-1 block truncate text-xs text-muted">
                        {item.editorName} · {item.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          <section className="flex min-w-0 flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-line bg-surface p-5">
              <div>
                <p className="text-sm font-semibold text-white">
                  Saved by {selected.editorName} · {when(selected.createdAt)}
                </p>
                <p className="mt-2 flex flex-wrap gap-1.5">
                  {changes(selected, previous).map((change) => (
                    <span key={change} className="studio-badge studio-badge-slate">
                      {change}
                    </span>
                  ))}
                </p>
              </div>

              {selectedIndex === 0 ? (
                <span className="text-xs text-muted">This is the current version.</span>
              ) : (
                <ConfirmButton
                  action={restoreRevision}
                  hidden={{ revisionId: selected.id }}
                  label="Restore this version"
                  title="Restore this version?"
                  description="Its title, body, cover, category, tags and SEO settings replace the current ones. Whether the post is published doesn't change. The current version stays in history, so this can be undone."
                  confirmLabel="Restore"
                  destructive={false}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-5 font-display text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong"
                />
              )}
            </div>

            <dl className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-surface p-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted">URL</dt>
                <dd className="mt-1 break-all text-white">/blog/{selected.slug}</dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted">Category</dt>
                <dd className="mt-1 text-white">
                  {selected.categoryId ? (category?.name ?? "A category since deleted") : "None"}
                </dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted">Tags</dt>
                <dd className="mt-1 text-white">{selected.tagNames || "None"}</dd>
              </div>
              <div>
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted">Meta title</dt>
                <dd className="mt-1 text-white">{selected.metaTitle || "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted">Meta description</dt>
                <dd className="mt-1 text-white">{selected.metaDescription || "—"}</dd>
              </div>
            </dl>

            <article className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
              {selected.coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.coverUrl}
                  alt={selected.coverAlt ?? ""}
                  className="mb-6 aspect-16/9 w-full rounded-xl border border-line object-cover"
                />
              )}
              <h2 className="font-display text-2xl font-medium tracking-tight text-white">{selected.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{selected.excerpt}</p>
              {/* Sanitised when it was saved, like the live body. */}
              <div
                className="prose mt-6 max-w-none"
                dangerouslySetInnerHTML={{ __html: selected.bodyHtml }}
              />
            </article>
          </section>
        </div>
      )}
    </>
  );
}
