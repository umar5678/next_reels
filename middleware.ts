import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // The middleware function will only be invoked if the authorized callback returns true.
  function middleware() {
    return NextResponse.next();
  },

  // The middleware function will only be invoked if the authorized callback returns true.
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        ) {
          return true;
        }

        // public

        if (pathname === "/" || pathname.startsWith("/api/videos")) {
          return true;
        }

            // explain here
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};