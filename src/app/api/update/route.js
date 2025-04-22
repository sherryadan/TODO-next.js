
import { NextResponse } from 'next/server';
import User from '../../../../models/User';
import connectionToDatabase from '../../../../lib/mongoosedb';

export async function POST(request) {
    try {
      await connectionToDatabase();
  
      let body;
      try {
        body = await request.json();
      } catch {
        return NextResponse.json({ error: "Missing or invalid JSON body" }, { status: 400 });
      }
  
      const { email, firstName, lastName, phone, company, website } = body;
  
      if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
      }
  
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { firstName, lastName, phone, company, website },
        { new: true }
      );
  
      if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "User updated", user: updatedUser });
    } catch (error) {
      console.error("Update error:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

  // Done 