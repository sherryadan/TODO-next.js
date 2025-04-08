import { NextResponse } from "next/server";
import { verifyToken } from "../../lib/auth";

export function middleware(req) {
  const token = req.cookies.get("authToken");

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: No token provided" },
      { status: 401 }
    );
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
  matcher: ["/api/tasks/:path*"], 
};