import { NextResponse } from "next/server";
import { verifyToken } from "../lib/auth";
export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    return NextResponse.next();
  }

  const tokenCookie = req.cookies.get("authToken");
  const token = tokenCookie?.value;

  if (token) {
    try {
      verifyToken(token);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  try {
    const decoded = verifyToken(token);
    req.userId = decoded.id;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!api|_next|static).*)"],
};
