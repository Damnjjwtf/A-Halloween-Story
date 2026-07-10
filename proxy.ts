import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const userId = await verifySession(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  // Public surfaces bypass the gate entirely: read-only candidate share
  // pages, the "how it works" page, and the generated OG/preview images
  // (so link unfurls work before anyone is signed in).
  const isPublic =
    pathname.startsWith("/c/") ||
    pathname === "/about" ||
    pathname.includes("opengraph-image") ||
    pathname.includes("twitter-image");
  if (isPublic) {
    return NextResponse.next();
  }

  if (pathname === "/gate") {
    if (userId) {
      return NextResponse.redirect(new URL("/workbook", request.url));
    }
    return NextResponse.next();
  }

  if (!userId) {
    return NextResponse.redirect(new URL("/gate", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/workbook", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|ico|webmanifest)$).*)"],
};
