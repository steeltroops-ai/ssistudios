import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth/jwt";
import dbConnect from "@/lib/database/dbconnect";
import { User } from "@/lib/models/User";

// Get user's active sessions
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Verify the JWT token
    const tokenPayload = verifyAuthToken(request);
    
    if (!tokenPayload) {
      return NextResponse.json(
        {
          message: "Invalid or expired token",
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Fetch user with sessions
    const user = await User.findById(tokenPayload.userId).select("activeSessions");
    
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 404 }
      );
    }

    // Clean expired sessions
    await user.cleanExpiredSessions();

    // Return active sessions (without sensitive data)
    const sessions = user.activeSessions.map((session: any) => ({
      sessionId: session.sessionId,
      deviceInfo: session.deviceInfo,
      ipAddress: session.ipAddress,
      lastActivity: session.lastActivity,
      expiresAt: session.expiresAt,
      isCurrent: false, // Will be determined by client
    }));

    return NextResponse.json(
      {
        message: "Sessions retrieved successfully",
        sessions,
        _meta: { responseTime: `${Date.now() - startTime}ms` },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Sessions retrieval error:", error);

    return NextResponse.json(
      {
        message: "Failed to retrieve sessions",
        _meta: { responseTime: `${Date.now() - startTime}ms` },
      },
      { status: 500 }
    );
  }
}

// Revoke a specific session
export async function DELETE(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Verify the JWT token
    const tokenPayload = verifyAuthToken(request);
    
    if (!tokenPayload) {
      return NextResponse.json(
        {
          message: "Invalid or expired token",
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const revokeAll = searchParams.get("all") === "true";

    if (!sessionId && !revokeAll) {
      return NextResponse.json(
        {
          message: "Session ID is required or use ?all=true to revoke all sessions",
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Fetch user
    const user = await User.findById(tokenPayload.userId);
    
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 404 }
      );
    }

    if (revokeAll) {
      // Revoke all sessions
      await user.clearAllSessions();
      
      // Clear cookies for current session
      const response = NextResponse.json(
        {
          message: "All sessions revoked successfully",
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 200 }
      );

      // Clear authentication cookies
      response.cookies.set("access_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      });

      response.cookies.set("refresh_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      });

      return response;
    } else {
      // Revoke specific session
      await user.removeSession(sessionId!);
      
      return NextResponse.json(
        {
          message: "Session revoked successfully",
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Session revocation error:", error);

    return NextResponse.json(
      {
        message: "Failed to revoke session",
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

export async function PATCH() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
