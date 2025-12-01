import { NextRequest, NextResponse } from "next/server";
import { register } from "@/instrumentation";
import { Admin } from "../../../../../db/schema";

export async function GET(req: NextRequest) {
  try {
    await register();

    const username = req.nextUrl.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 }
      );
    }

    const existingUser = await Admin.findOne({ username });

    return NextResponse.json(
      { usernameExists: !!existingUser },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await register();

    const body = await req.json();
    const { name, username, email, bio, profilePicture } = body;

    if (!name || !username || !email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await Admin.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username or Email already exists" },
        { status: 400 }
      );
    }

    const newUser = await Admin.create({
      name,
      username,
      email,
      bio: bio || "",
      profilePicture: profilePicture || "",
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: newUser,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
