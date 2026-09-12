import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Gate for /admin.
 *
 * `middleware.ts` is deprecated in Next 16 — this is the `proxy` convention
 * that replaced it. It runs before rendering, so it can bounce a logged-out
 * request without paying for a render.
 *
 * It verifies the session signature only: this runs in the Edge runtime, where
 * Prisma cannot open a TCP connection to Postgres. Any check that needs the
 * database (does this user still exist? has their role changed?) belongs in
 * the page, which is why every admin page also calls requireUser().
 */
const COOKIE = "cracktab_session";

async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const value = process.env.AUTH_SECRET;
  if (!value) return false;

  try {
    await jwtVerify(token, new TextEncoder().encode(value));
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const authed = await isValidSession(request.cookies.get(COOKIE)?.value);

  if (pathname.startsWith("/admin") && !authed) {
    const url = new URL("/login", request.url);
    // Send them back where they were headed once they're in.
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  // No point showing the login form to someone already signed in.
  if (pathname === "/login" && authed) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
