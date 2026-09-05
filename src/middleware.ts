import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/auth/session";

export async function middleware(request: NextRequest) {
  const session = getSessionCookie(request);
  const pathname = request.nextUrl.pathname;

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/verify-otp");
  const isPublic = pathname === "/";

  // No session yet? Only allow public landing, login, signup, and the OTP step.
  if (!session && !isAuthRoute && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Already logged in? Send auth routes to dashboard.
  if (session && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// `/` is a public landing page; everything else requires auth.
// Exclude /api routes (auth handlers, exports) from the middleware.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
