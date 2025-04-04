// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define which paths require authentication
const protectedPaths = ["/", "/profile", "/admin"];

// Define paths that are always accessible
const publicPaths = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path should be protected
  const isPathProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const token = request.cookies.get("auth_token")?.value;
  if (token && pathname.startsWith("/login")) {
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  // If this is a public path or not a protected path, allow the request
  if (publicPaths.some((path) => pathname === path) || !isPathProtected) {
    return NextResponse.next();
  }

  // If there's no token and we're on a protected path, redirect to login
  if (!token && isPathProtected) {
    const loginUrl = new URL("/login", request.url);
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
