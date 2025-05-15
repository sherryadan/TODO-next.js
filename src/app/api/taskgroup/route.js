import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../lib/mongoosedb";
import TaskGroup from "../../../../models/TaskGroup";
import { verifyToken } from "../../../../lib/auth";

function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split("; ").map(cookie => {
      const [key, ...v] = cookie.split("=");
      return [key, decodeURIComponent(v.join("="))];
    })
  );
}

export async function POST(req) {
  await connectionToDatabase();

  // Get cookies from request headers
  const cookieHeader = req.headers.get("cookie");
  const cookies = parseCookies(cookieHeader);
  const token = cookies.authToken;

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { name, tasks = [] } = await req.json();

  try {
    const newGroup = new TaskGroup({
      name,
      tasks,
      createdBy: payload.id, 
    });

    await newGroup.save();

    return NextResponse.json({ message: "Group created", group: newGroup }, { status: 201 });
  } catch (err) {
    console.error("POST /taskgroup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectionToDatabase();
    const groups = await TaskGroup.find().populate("taskIds");
    return NextResponse.json(groups);
  } catch (err) {
    console.error("GET /taskgroup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
