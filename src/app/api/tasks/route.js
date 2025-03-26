import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../lib/mongoosedb";
import Task from "../../../../models/Task";

// Get a Task from Database
export async function GET() {
  await connectionToDatabase();
  const tasks = await Task.find({});
  return NextResponse.json(tasks);
}

// Creates a new task  (POST)
export async function POST(req) {
  await connectionToDatabase();
  const { title, description } = await req.json(); // parse the request body to get title and description
  const newTask = new Task({ title, description });
  await newTask.save();

  if (!title || !description) {
    // validate if no title and description exisits
    return NextResponse.json({ error: "ERROR" });
  }

  return NextResponse.json(newTask);
}

// Updates a task
export async function PUT(req) {
  await connectionToDatabase();
  const { id, title, description } = await req.json();

  const updatedTask = await Task.findByIdAndUpdate(
    id,
    { title, description },
    { new: true }
  );
  if (!updatedTask) {
    return NextResponse.json({ error: "ERROR" });
  }
  return NextResponse.json(updatedTask);
}

// Deletes a task
export async function DELETE(req) {
  await connectionToDatabase();
  const { id } = await req.json();
  const task = await Task.findByIdAndDelete(id);
  return NextResponse.json({ message: "Task Deleted Successfully" });
}
