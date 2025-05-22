import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    return NextResponse.next();
  }

  const tokenCookie = req.cookies.get("authToken");
  const token = tokenCookie?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const verifyRes = await fetch(`${req.nextUrl.origin}/api/verifytoken`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (verifyRes.ok) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch (error) {
    console.error("Token verification failed in middleware:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next|static).*)"],
};
