import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../lib/mongoosedb";
import TaskGroup from "../../../../models/TaskGroup";
import mongoose from "mongoose";
import { verifyToken } from "../../../../lib/auth";

export async function POST(request) {
  await connectionToDatabase();

  // Extract token from cookies
  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    const { name, tasks = [] } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: "Group name is required!" },
        { status: 400 }
      );
    }

    // Convert task IDs to ObjectId and validate
    const taskIds = tasks.map(id => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid task ID: ${id}`);
      }
      return new mongoose.Types.ObjectId(id);
    });

    const newGroup = await TaskGroup.create({
      name,
      taskIds,
      createdBy: decoded.id,
    });

    return NextResponse.json({ message: "Group created", group: newGroup }, { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error.message);
    return NextResponse.json(
      { message: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectionToDatabase();
    const groups = await TaskGroup.find().populate("taskIds");
    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    console.error("Error fetching groups:", error.message);
    return NextResponse.json(
      { message: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}
