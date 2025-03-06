import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// this function will execute when `/api/auth/register`route is hit
// there is no routing library in next.js, by default file based routing
// Requrest method is defined just befor the function
// this api folder in app si the backend for this full stack framnwork

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password is required",
        },
        { status: 400 }
      );
    }
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "User already exist",
        },
        { status: 400 }
      );
    }

    await User.create(
      { message: "user registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("User Registration Error: ", error);
    return NextResponse.json(
      {
        error: "Filed to register the user",
      },
      { status: 400 }
    );
  }
}
 