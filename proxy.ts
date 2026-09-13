import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { LOGIN_PATH, STUDIO_BASE } from "./app/lib/paths";

/**
 * The wall in front of the studio.
 *
 *  • The real paths (/admin, /login) are never reachable by name. They 404.
 *  • The public studio path 404s for anyone without a validly signed session.
 *    Not a redirect to sign-in: a redirect confirms there is something there
 *    worth signing in to. A 404 is indistinguishable from a page that doesn't
 *    exist.
 *  • Requests that get through are rewritten onto the real files.
 *
 * This checks the signature only. It runs on the Edge runtime, where Prisma
 * can't reach Postgres, so the database check — is the account still live, is
 * the session version current — happens in requireUser() on every studio page
 * and action. The proxy's job is to keep unauthenticated traffic from seeing
 * that the studio exists at all.
 *
 * The matcher can't reference the configured path (it must be static), so the
 * proxy runs on every page request and filters here. For public pages that is
 * a couple of string comparisons.
 */

const COOKIE = "cracktab_session";

/** Real locations on disk. Never served under these names. */
const INTERNAL = ["/admin", "/login", "/studio-preview"];

const within = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

async function signatureValid(token: string | undefined): Promise<boolean> {
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return false;

  try {
    await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

/**
 * The site's own 404 page, via a rewrite to a path nothing matches. A bare
 * `new Response(null, { status: 404 })` would have a different body from a
 * genuinely missing page — and that difference alone would confirm the
 * studio's location to anyone comparing responses.
 */
function notFound(request: NextRequest) {
  return NextResponse.rewrite(new URL("/__not-found", request.url));
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (INTERNAL.some((base) => within(pathname, base))) {
    return notFound(request);
  }

  if (pathname === LOGIN_PATH) {
    return NextResponse.rewrite(new URL(`/login${search}`, request.url));
  }

  if (within(pathname, STUDIO_BASE)) {
    if (!(await signatureValid(request.cookies.get(COOKIE)?.value))) {
      return notFound(request);
    }
    const rest = pathname.slice(STUDIO_BASE.length);
    // Draft preview lives outside /admin so it renders in the site's own
    // layout and theme — a preview wearing the studio's light shell would
    // show the author something readers never see.
    const inner = rest.startsWith("/preview/")
      ? `/studio-preview${rest.slice("/preview".length)}`
      : `/admin${rest}`;
    return NextResponse.rewrite(new URL(`${inner}${search}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Everything except build assets and static files.
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpe?g|gif|webp|avif|svg|ico|mp4|txt|xml|webmanifest)$).*)",
  ],
};
