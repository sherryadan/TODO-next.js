import mongoose from "mongoose";
import connectionToDatabase from "../../../../lib/mongoosedb";
import Task from "../../../../models/Task";
import TaskGroup from "../../../../models/TaskGroup";
import { NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/auth";

export async function PATCH(request) {
  await connectionToDatabase();

  const token = request.cookies.get("authToken")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    const { taskId, groupId } = await request.json();

    console.log("Received taskId:", taskId, "groupId:", groupId);

    if (!taskId || !groupId) {
      return NextResponse.json(
        { message: "taskId and groupId are required" },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(taskId) ||
      !mongoose.Types.ObjectId.isValid(groupId)
    ) {
      console.log("Invalid IDs:", taskId, groupId);
      return NextResponse.json(
        { message: "Invalid taskId or groupId" },
        { status: 400 }
      );
    }

    const task = await Task.findOne({ _id: taskId, userId: decoded.id });
    if (!task) {
      console.log("Task not found:", taskId);
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    const group = await TaskGroup.findById(groupId);
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    task.groupId = groupId;
    await task.save();

    await TaskGroup.findByIdAndUpdate(groupId, {
      $addToSet: { taskIds: taskId },
    });

    return NextResponse.json(
      { message: "Task added to group" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /tasks/group error:", error.message);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
