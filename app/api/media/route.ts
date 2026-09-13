import { NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { getVerifiedUser } from "../../lib/auth";
import { prisma } from "../../lib/db";

/**
 * The media picker's listing. A route handler rather than a Server Action
 * because it's a read the picker repeats as the author searches and pages.
 */

const PAGE_SIZE = 24;
const MAX_PAGE = 10_000;

/** Allowlisted — the query string never names a column directly. */
const ORDER: Record<string, Prisma.MediaOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  oldest: { createdAt: "asc" },
  largest: { sizeBytes: "desc" },
  smallest: { sizeBytes: "asc" },
};

export async function GET(request: Request) {
  const user = await getVerifiedUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const q = (params.get("q") ?? "").trim().slice(0, 100);
  const page = Math.min(MAX_PAGE, Math.max(1, Math.floor(Number(params.get("page"))) || 1));
  const orderBy: Prisma.MediaOrderByWithRelationInput =
    ORDER[params.get("sort") ?? ""] ?? ORDER.newest;

  // Parameterised by Prisma; the file name is part of the Blob URL.
  const where: Prisma.MediaWhereInput = q
    ? {
        OR: [
          { url: { contains: q, mode: "insensitive" } },
          { alt: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  try {
    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: { id: true, url: true, alt: true, mimeType: true },
      }),
      prisma.media.count({ where }),
    ]);

    return NextResponse.json(
      { items, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[media] listing failed", error);
    return NextResponse.json({ error: "Couldn't load the library." }, { status: 500 });
  }
}
