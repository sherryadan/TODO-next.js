import { NextResponse } from "next/server";
import { verifyToken } from "../lib/auth";
export function middleware(req) {

  const tokenCookie = req.cookies.get("authToken");
  const token = tokenCookie?.value;
  const isLoginPage = req.nextUrl.pathname.startsWith("/login");
  const isSignupPage = req.nextUrl.pathname.startsWith("/signup");

  if (token && (isLoginPage || isSignupPage)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!token && !(isLoginPage || isSignupPage)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }


  if (token){
  try {
    verifyToken(token);
    return NextResponse.next();
   
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
return NextResponse.next();
}


export const config = {
  runtime: "nodejs",
  matcher: ["/((?!api|_next|static).*)"],
};
