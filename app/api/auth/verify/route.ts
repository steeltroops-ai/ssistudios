import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth/jwt";
import dbConnect from "@/lib/database/dbconnect";
import { User } from "@/lib/models/User";
import { Member } from "@/lib/models/Employee";

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Verify the JWT token
    const tokenPayload = verifyAuthToken(request);
    
    if (!tokenPayload) {
      return NextResponse.json(
        {
          message: "Invalid or expired token",
          isAuthenticated: false,
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Fetch fresh user data
    let user: any = null;
    let isAdmin = tokenPayload.type === "admin";

    if (isAdmin) {
      user = await Member.findById(tokenPayload.userId);
    } else {
      user = await User.findById(tokenPayload.userId).select("-password");
    }

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          isAuthenticated: false,
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 404 }
      );
    }

    // Prepare user response
    const userResponse = isAdmin
      ? {
          id: user._id,
          username: user.username,
          name: user.name,
          role: user.role,
          isAdmin: true,
          type: "admin",
        }
      : {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          isEmailVerified: user.isEmailVerified,
          preferences: user.preferences,
          lastLoginAt: user.lastLoginAt,
          isAdmin: false,
          type: "user",
        };

    return NextResponse.json(
      {
        message: "Token is valid",
        isAuthenticated: true,
        user: userResponse,
        _meta: { responseTime: `${Date.now() - startTime}ms` },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Token verification error:", error);

    return NextResponse.json(
      {
        message: "Token verification failed",
        isAuthenticated: false,
        _meta: { responseTime: `${Date.now() - startTime}ms` },
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
