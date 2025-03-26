import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../lib/mongoosedb";
import Task from "../../../../models/Task";

export async function GET() {
  await connectionToDatabase();
  const tasks = await Task.find();
  return NextResponse.json(tasks);
}
export async function POST(req) {
  await connectionToDatabase();

  try {
    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const freshTask = new Task({ title, description });
    await freshTask.save();

    return NextResponse.json(freshTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create task", details: error.message },
      { status: 500 }
    );
  }
}
