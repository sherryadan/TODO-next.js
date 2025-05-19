import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../lib/mongoosedb";
import TaskGroup from "../../../../models/TaskGroup";


export async function GET() {
  try {
    await connectionToDatabase();

    const groups = await TaskGroup.find();
    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json({ message: "Error fetching groups" }, { status: 500 });
  }
}
