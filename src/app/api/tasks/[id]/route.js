import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../../lib/mongoosedb";
import Task from "../../../../../models/Task";

export async function PUT(request) {
  await connectionToDatabase();

  try {
    const datatask = await request.json();
    const renewtask = datatask;
    const updatedTask = await Task.findByIdAndUpdate(datatask._id, renewtask);

    await updatedTask.save();
    return NextResponse.json({ message: "Task updated Successfully" });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update task", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  await connectionToDatabase();

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  
  try {
    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    await Task.findByIdAndDelete(id);

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete task", details: error.message },
      { status: 500 }
    );
  }
}
