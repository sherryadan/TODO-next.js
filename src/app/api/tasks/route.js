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

// export async function PUT(req) {
//   await connectionToDatabase();

//   try {
//     const { id, title, description } = await req.json();

//     if (!id || !title || !description) {
//       return NextResponse.json({ error: "ID, title, and description are required" }, { status: 400 });
//     }

//     const updatedTask = await Task.findByIdAndUpdate(
//       id,
//       { title, description },
//       { new: true, runValidators: true } // Ensures updated task is returned
//     );

//     if (!updatedTask) {
//       return NextResponse.json({ error: "Task not found" }, { status: 404 });
//     }

//     return NextResponse.json(updatedTask, { status: 200 });
//   } catch (error) {
//     console.error("PUT Error:", error);
//     return NextResponse.json({ error: "Failed to update task", details: error.message }, { status: 500 });
//   }
// }

// export async function DELETE(req) {
//   await connectionToDatabase();

//   try {
//     const { id } = await req.json();

//     if (!id) {
//       return NextResponse.json({ error: "ID is required" }, { status: 400 });
//     }

//     const deletedTask = await Task.findByIdAndDelete(id);

//     if (!deletedTask) {
//       return NextResponse.json({ error: "Task not found" }, { status: 404 });
//     }

//     return NextResponse.json({ message: "Task deleted successfully" });
//   } catch (error) {
//     console.error("DELETE Error:", error);
//     return NextResponse.json({ error: "Failed to delete task", details: error.message }, { status: 500 });
//   }
// }
