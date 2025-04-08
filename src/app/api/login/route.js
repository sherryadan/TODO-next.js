import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../lib/mongoosedb";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";

export async function GET(request) {
  await connectionToDatabase();

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const password = searchParams.get("password");

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required!" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Email not found!" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Wrong password!" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Login successful!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}