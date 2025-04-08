import { NextResponse } from "next/server";
import { verifyToken } from "../lib/auth";
export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") || 
    pathname.startsWith("/static") || 
    // pathname.startsWith("/") || 
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const tokenCookie = req.cookies.get("authToken");
  const token = tokenCookie?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    verifyToken(token);
    return NextResponse.redirect(new URL("/", req.url));
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  runtime: "nodejs",
  matcher: ["/:path*"], 
};