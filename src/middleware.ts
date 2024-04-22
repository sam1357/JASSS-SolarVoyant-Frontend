import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware function to handle authentication and redirection.
 * This middleware checks the authentication token for the incoming request
 * and performs redirection based on the request path and authentication status.
 *
 * @param {NextRequest} req The Next.js request object.
 * @returns {NextResponse} The Next.js response object.
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  switch (req.nextUrl.pathname) {
    case req.nextUrl.pathname.match(/^\/dashboard\/(.+)$/)?.input:
      if (!token) return NextResponse.redirect(new URL("/login", req.url));
      break;
    case "/signup":
    case "/login":
      if (token) return NextResponse.redirect(new URL("/dashboard/overview", req.url));
      break;
    default:
      break;
  }
  return res;
}

/**
 * Configuration for middleware.
 */
export const config = {
  matcher: ["/dashboard(/.+)?", "/login", "/signup"],
};
