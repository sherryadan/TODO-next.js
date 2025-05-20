import { NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/auth";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    const decoded = await verifyToken(token);
    return NextResponse.json({ valid: true, payload: decoded });
  } catch (error) {
    return NextResponse.json({ valid: false, error: "Invalid or expired token" }, { status: 401 });
  }
}