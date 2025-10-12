import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/signup", "/api/auth/signup"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Handle API route protection for protected routes
    if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
      // Protected API routes require authentication
      if (!req.nextauth.token) {
        return new NextResponse(
          JSON.stringify({ error: "Authentication required" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Always allow public routes
        if (publicRoutes.includes(pathname)) {
          return true;
        }

        // For NextAuth API routes, always allow
        if (pathname.startsWith("/api/auth/")) {
          return true;
        }

        // For all other routes, require authentication
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  },
);

// Configure which routes should be processed by middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
