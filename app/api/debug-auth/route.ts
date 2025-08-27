import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/database/dbconnect";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    await dbConnect();

    // Find user with password field
    const user = await User.findOne({
      $or: [{ email: username.toLowerCase().trim() }, { username: username.toLowerCase().trim() }],
    }).select("+password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Test password comparison methods
    const directBcryptCompare = await bcrypt.compare(password, user.password);
    const userMethodCompare = await user.comparePassword(password);

    // Also test manual hash to see what's happening
    const manualHash = await bcrypt.hash(password, 12);
    const manualCompare = await bcrypt.compare(password, manualHash);

    return NextResponse.json({
      message: "Password debug results",
      results: {
        userFound: true,
        username: user.username,
        email: user.email,
        hasPassword: !!user.password,
        passwordLength: user.password?.length || 0,
        passwordStartsWith: user.password?.substring(0, 10) || "N/A",
        directBcryptCompare,
        userMethodCompare,
        manualHash: manualHash.substring(0, 20) + "...",
        manualCompare,
        inputPassword: password,
        inputPasswordLength: password.length,
      }
    });

  } catch (error: any) {
    console.error("Debug auth error:", error);
    return NextResponse.json({ 
      error: "Debug failed", 
      details: error.message 
    }, { status: 500 });
  }
}
