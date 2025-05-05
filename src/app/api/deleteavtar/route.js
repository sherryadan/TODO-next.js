import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../lib/mongoosedb";
import User from "../../../../models/User";
import { verifyToken } from "../../../../lib/auth";

export async function DELETE(request) {
  await connectionToDatabase();

  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);

    const user = await User.findByIdAndUpdate(
      decoded.id,
      { avatarUrl: "" },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Avatar deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting avatar:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
