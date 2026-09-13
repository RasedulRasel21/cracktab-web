import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import { requireUser } from "../../lib/auth";
import { prisma } from "../../lib/db";
import { fileName } from "../../lib/fileName";
import { mediaUsageMap } from "../../lib/media";
import { studio } from "../../lib/paths";
import Pagination from "../Pagination";
import { AltForm, DeleteMediaButton, MediaUpload } from "./MediaForms";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;
const MAX_PAGE = 10_000;

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

type Params = {
  q?: string;
  page?: string;
  deleted?: string;
  inuse?: string;
  denied?: string;
  gone?: string;
};

const sizeLabel = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const user = await requireUser();
  const params = await searchParams;

  const q = (params.q ?? "").trim().slice(0, 100);
  const page = Math.min(MAX_PAGE, Math.max(1, Math.floor(Number(params.page)) || 1));

  const where: Prisma.MediaWhereInput = q
    ? {
        OR: [
          { url: { contains: q, mode: "insensitive" } },
          { alt: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  let data: {
    items: {
      id: string;
      url: string;
      alt: string | null;
      sizeBytes: number;
      createdAt: Date;
      uploadedById: string | null;
      uploadedBy: { name: string } | null;
    }[];
    total: number;
    usage: Map<string, number>;
  } | null = null;

  try {
    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: {
          id: true,
          url: true,
          alt: true,
          sizeBytes: true,
          createdAt: true,
          uploadedById: true,
          uploadedBy: { select: { name: true } },
        },
      }),
      prisma.media.count({ where }),
    ]);
    data = { items, total, usage: await mediaUsageMap(items.map((item) => item.url)) };
  } catch (error) {
    console.error("[admin] could not load media", error);
  }

  const pageCount = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;
  const hrefFor = (n: number) => {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (n > 1) query.set("page", String(n));
    const qs = query.toString();
    return studio(`/media${qs ? `?${qs}` : ""}`);
  };
  const back = hrefFor(page).split("?")[1];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
            Media
          </h1>
          <p className="mt-2 text-sm text-muted">
            Every image uploaded to the blog. Describe them once here and the
            description follows them into the editor.
          </p>
        </div>
        <MediaUpload />
      </div>

      {params.deleted && (
        <p className="mt-6 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          Image deleted.
        </p>
      )}
      {params.inuse && (
        <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          That image is still used by a post. Remove it from the post first.
        </p>
      )}
      {params.denied && (
        <p className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Only the person who uploaded that image, or an admin, can delete it.
        </p>
      )}
      {params.gone && (
        <p className="mt-6 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          That image was already gone.
        </p>
      )}

      <form
        method="get"
        action={studio("/media")}
        role="search"
        className="mt-8 flex flex-wrap items-end gap-3 rounded-xl border border-line bg-surface p-4"
      >
        <label className="flex min-w-56 flex-1 flex-col gap-1.5">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-muted">
            Search
          </span>
          <input
            type="search"
            name="q"
            defaultValue={q}
            maxLength={100}
            placeholder="File name or description"
            className="h-10 w-full rounded-xl border border-line bg-black px-3 text-sm text-white outline-none transition-colors focus:border-accent"
          />
        </label>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-accent px-4 text-xs font-semibold uppercase tracking-wide text-accent-ink transition-colors hover:bg-accent-strong"
        >
          Search
        </button>
        {q && (
          <Link
            href={studio("/media")}
            className="inline-flex h-10 items-center px-2 text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:text-accent"
          >
            Clear
          </Link>
        )}
      </form>

      {data === null ? (
        <p className="mt-10 rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-sm text-red-200">
          The database is unreachable. Reload in a moment.
        </p>
      ) : data.items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-line bg-surface p-8">
          <p className="text-sm text-muted">
            {q ? "No images match that search." : data.total > 0 ? "That page is past the end." : "No images uploaded yet."}
          </p>
        </div>
      ) : (
        <>
          <p className="mt-6 text-xs text-muted">
            {data.total} image{data.total === 1 ? "" : "s"}
            {q ? " match" : ""}
          </p>

          <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.items.map((item) => {
              const used = data.usage.get(item.url) ?? 0;
              const canManage = user.role === "ADMIN" || item.uploadedById === user.id;
              return (
                <li key={item.id} className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
                  <a href={item.url} target="_blank" rel="noreferrer" className="block bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.alt ?? ""}
                      loading="lazy"
                      className="aspect-4/3 w-full object-cover"
                    />
                  </a>
                  <div className="flex flex-1 flex-col gap-3 p-3">
                    <div>
                      <p className="truncate text-xs font-semibold text-white" title={fileName(item.url)}>
                        {fileName(item.url)}
                      </p>
                      <p className="mt-0.5 truncate text-[0.7rem] text-muted">
                        {sizeLabel(item.sizeBytes)} · {dateFormat.format(item.createdAt)}
                        {item.uploadedBy && ` · ${item.uploadedBy.name}`}
                      </p>
                    </div>

                    <AltForm mediaId={item.id} alt={item.alt ?? ""} canEdit={canManage} />

                    <div className="mt-auto flex items-center justify-between gap-2">
                      <span
                        className={`studio-badge ${used > 0 ? "studio-badge-sky" : "studio-badge-slate"}`}
                      >
                        {used > 0 ? `Used in ${used} post${used === 1 ? "" : "s"}` : "Unused"}
                      </span>
                      {canManage &&
                        (used > 0 ? (
                          <span className="text-[0.65rem] text-muted" title="Remove it from every post first">
                            In use
                          </span>
                        ) : (
                          <DeleteMediaButton mediaId={item.id} back={back ? `?${back}` : ""} />
                        ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <Pagination page={page} pageCount={pageCount} label="Media pages" hrefFor={hrefFor} />
        </>
      )}
    </>
  );
}
