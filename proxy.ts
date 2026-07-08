import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const userId = await verifySession(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  // Public read-only candidate share pages bypass the gate entirely.
  if (pathname.startsWith("/c/")) {
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
