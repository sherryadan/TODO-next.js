import { NextResponse } from "next/server";

let tasks = [];
export async function GET() {
  return NextResponse.json(tasks);
}

export async function POST(req) {
  const { title, description } = await req.json();
  if (!title || !description) {
    return NextResponse.json({ error: "ERROR" });
  }
  
  const newTask = { id: tasks.length, title, description };
  tasks.push(newTask);
  return NextResponse.json(newTask);
}

export async function PUT(req) {
  const { id, title, description } = await req.json();
  const index = tasks.findIndex((task) => task.id === id);
  
  if (index === -1) {
    return NextResponse.json({ error: "ERROR" });
  }

  tasks[index] = { id, title, description };
  return NextResponse.json(tasks[index]);
}


export async function DELETE(req) {
  const { id } = await req.json();
  tasks = tasks.filter(task => task.id !== id);
  return NextResponse.json({ message: "DONE" });
}
