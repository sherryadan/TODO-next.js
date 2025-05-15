import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../lib/mongoosedb";
import Task from "../../../../models/Task";
import { verifyToken } from "../../../../lib/auth";

export async function GET(request) {
  await connectionToDatabase();

  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    const tasks = await Task.find({ userId: decoded.id });
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  await connectionToDatabase();

  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { message: "Title is required!" },
        { status: 400 }
      );
    }

    

    const newTask = await Task.create({
      title,
      description,
      userId: decoded.id,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

// Done 