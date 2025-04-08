import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../lib/mongoosedb";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  console.log("API hit");

  await connectionToDatabase();

  try {
    const data = await request.json();

    const {
      firstName,
      lastName,
      company,
      phone,
      website,
      email,
      password,
    } = data;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered!" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      company,
      phone,
      website,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
