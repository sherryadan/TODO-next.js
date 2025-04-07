// /app/api/signup/route.js
import { NextResponse } from "next/server";
import connectionToDatabase from "../../../../lib/mongoosedb";
import User from "../models/user";

export async function POST(request) {
  await connectionToDatabase();

  try {
    const data = await request.json();

    const {
      firstName,
      lastName,
      company,
      phone,
      website,
      visitors,
      email,
      password,
    } = data;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered!" },
        { status: 400 }
      );
    }

    const newUser = new User({
      firstName,
      lastName,
      company,
      phone,
      website,
      visitors,
      email,
      password,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
