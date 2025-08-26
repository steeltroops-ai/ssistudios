// =========================================================================
// app/api/admin-login/route.ts
// No changes needed
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Member } from "@/lib/models/Employee";
import dbConnect from "@/lib/database/dbconnect";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    await dbConnect();

    const { username, password } = await req.json();

    // Input validation
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required." },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedUsername = username.trim().toLowerCase();

    // Find user with optimized query
    let user = await Member.findOne({
      username: sanitizedUsername,
    }).select("+password");

    // Auto-create user if it doesn't exist and credentials match expected
    if (!user && sanitizedUsername === "puneet" && password === "puneet@ssi") {
      console.log("👤 Creating default admin user...");
      const hashedPassword = await bcrypt.hash(password, 12);

      user = new Member({
        username: sanitizedUsername,
        password: hashedPassword,
      });

      await user.save();
      console.log("✅ Default admin user created successfully!");
    }

    if (!user) {
      // Add artificial delay to prevent timing attacks
      await new Promise((resolve) => setTimeout(resolve, 100));
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Compare password with bcrypt (fallback to plain text for existing users)
    let isMatch = false;
    if (user.password.startsWith("$2")) {
      // Hashed password
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Plain text password (legacy) - should be migrated
      isMatch = password === user.password;

      // Auto-migrate to hashed password
      if (isMatch) {
        const hashedPassword = await bcrypt.hash(password, 12);
        await Member.findByIdAndUpdate(user._id, { password: hashedPassword });
      }
    }

    if (!isMatch) {
      // Add artificial delay to prevent timing attacks
      await new Promise((resolve) => setTimeout(resolve, 100));
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Success response with performance metrics
    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        message: "Login successful!",
        user: {
          id: user._id,
          username: user.username,
        },
        _meta: {
          responseTime: `${responseTime}ms`,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login." },
      { status: 500 }
    );
  }
}
