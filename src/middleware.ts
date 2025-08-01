// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  //   const isDev = process.env.NODE_ENV === "development";

  //   // Skip auth check in development
  //   if (isDev) {
  //     return NextResponse.next();
  //   }
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.TOKEN_SECRET!)
    );

    // Role-based access
    const pathname = request.nextUrl.pathname;

    // Protect admin routes
    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Protect user dashboard if needed
    if (pathname.startsWith("/dashboard") && payload.role !== "user") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // You can attach user data to request if needed
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.id as string);
    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"], // Protect these paths
};
