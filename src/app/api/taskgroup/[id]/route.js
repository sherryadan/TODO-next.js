import connectionToDatabase from "../../../../../lib/mongoosedb";
import TaskGroup from "../../../../../models/TaskGroup";
import {NextResponse} from "next/server";
import {verifyToken} from "../../../../../lib/auth";
import {Types} from "mongoose";

export async function DELETE(request, { params }) {
  await connectionToDatabase();

  const { id } = params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const deleted = await TaskGroup.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "TaskGroup not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "TaskGroup deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/taskgroup/[id] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

