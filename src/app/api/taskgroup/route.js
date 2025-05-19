import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../lib/mongoosedb";
import TaskGroup from "../../../../models/TaskGroup";
import mongoose from "mongoose";
import { verifyToken } from "../../../../lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  await connectionToDatabase();

  const token = request.cookies.get("authToken")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    const userId = decoded.id || decoded.userId;
    if (!userId) {
      return NextResponse.json(
        { message: "Invalid token data" },
        { status: 401 }
      );
    }

    const { name, tasks = [] } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: "Group name is required!" },
        { status: 400 }
      );
    }

    const taskIds = [];
    for (const id of tasks) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { message: `Invalid task ID: ${id}` },
          { status: 400 }
        );
      }
      taskIds.push(new mongoose.Types.ObjectId(id));
    }

    const newGroup = await TaskGroup.create({
      name,
      taskIds,
      createdBy: userId,
      groupid: uuidv4(),
    });

    return NextResponse.json(
      { message: "Group created", groupId: newGroup._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { message: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectionToDatabase();

    // Get auth token from cookies
    const token = request.cookies.get("authToken")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get user ID
    const decoded = verifyToken(token);

    const groups = await TaskGroup.find({ createdBy: decoded.id }).populate(
      "taskIds"
    );

    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    console.error("GET /api/taskgroup error:", error.message);
    return NextResponse.json(
      { message: "Failed to fetch task groups", error: error.message },
      { status: 500 }
    );
  }
}
