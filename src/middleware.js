import { NextResponse } from "next/server";
import { verifyToken } from "../lib/auth";

export function middleware(req) {
  const tokenCookie = req.cookies.get("authToken");
  const token = tokenCookie?.value;
  // console.log("Token from cookie:", token);

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    verifyToken(token); 
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or expired token" },
      { status: 401 }
    );
  }
}

export const config = {
    runtime: 'nodejs',
  matcher: ["/:path*"], 
};