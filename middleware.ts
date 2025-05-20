import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  function checkURLSuperAdmin(url: string) {
    const coachRegex = /\bsuperadmin\b(?!\w)/;
    return coachRegex.test(url);
  }

  function checkURLAdmin(url: string) {
    const coachRegex = /\badmin\b(?!\w)/;
    return coachRegex.test(url);
  }

  function checkURLSupport(url: string) {
    const coachRegex = /\bsupport\b(?!\w)/;
    return coachRegex.test(url);
  }

  const authToken = request.cookies.get("authToken")?.value;

  const currentRole = request.cookies.get("currentRole")?.value;

  const loginInUserNotAccessPaths =
    request.nextUrl.pathname === "/auth/create-account" ||
    request.nextUrl.pathname === "/auth/admin-create-account" ||
    request.nextUrl.pathname.startsWith("/auth/forgot-password") ||
    request.nextUrl.pathname === "/auth/login" ||
    request.nextUrl.pathname.startsWith("/auth/reset-password") ||
    request.nextUrl.pathname.startsWith("/auth/verify-account");

  if (loginInUserNotAccessPaths) {
    if (authToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    // remaining all the other routes leaving routes in the loginInUserNotAccessPaths
    if (!authToken || !currentRole) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  if (
    request.nextUrl.pathname.startsWith("/superadmin") ||
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/support")
  ) {
    const currentUrl = request.nextUrl;

    if (!currentRole) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    } else {
      const currentURL = currentUrl.href.toString();

      if (currentRole.toLowerCase() === "superadmin") {
        const isTryingToAccessCoach = checkURLSuperAdmin(currentURL);

        if (!isTryingToAccessCoach) {
          return NextResponse.redirect(new URL("/superadmin/dashboard", request.url));
        }
      } else if (currentRole.toLowerCase() === "admin") {
        const isTryingToAccessCoachee = checkURLAdmin(currentURL);

        if (!isTryingToAccessCoachee) {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        }
      } else if (currentRole.toLowerCase() === "support") {
        const isTryingToAccessAdmin = checkURLSupport(currentURL);

        if (!isTryingToAccessAdmin) {
          return NextResponse.redirect(new URL("/support/dashboard", request.url));
        }
      }
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/auth/:path*",
    "/superadmin/:path*",
    "/admin/:path*",
    "/support/:path*",
  ],
};
