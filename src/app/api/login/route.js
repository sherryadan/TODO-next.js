import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../lib/mongoosedb";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../../../../lib/auth";

export async function POST(request) {
  await connectionToDatabase();

  try {
    
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { message: "Invalid JSON input!" },
        { status: 400 }
      );
    }
    const { email, password } = body;

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
      return NextResponse.json({ message: "Wrong password!" }, { status: 401 });
    }

    const token = generateToken({ id: user._id, email: user.email });

    const response = NextResponse.json(
      { message: "Login successful!" },
      { status: 200 }
    );
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}


// Done