import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, generateAccessToken, getSecureCookieOptions } from "@/lib/auth/jwt";
import dbConnect from "@/lib/database/dbconnect";
import { User } from "@/lib/models/User";
import { Member } from "@/lib/models/Employee";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Get refresh token from cookies
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          message: "No refresh token provided",
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 401 }
      );
    }

    // Verify refresh token
    const tokenPayload = verifyRefreshToken(refreshToken);
    
    if (!tokenPayload) {
      return NextResponse.json(
        {
          message: "Invalid or expired refresh token",
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Fetch user and check token version
    let user: any = null;
    let isAdmin = false;

    // Try to find user first
    user = await User.findById(tokenPayload.userId);
    
    if (!user) {
      // Try admin/member collection
      user = await Member.findById(tokenPayload.userId);
      isAdmin = true;
    }

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 404 }
      );
    }

    // Check if token version matches (for security)
    if (!isAdmin && user.tokenVersion !== tokenPayload.tokenVersion) {
      return NextResponse.json(
        {
          message: "Token version mismatch - please log in again",
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 401 }
      );
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      isAdmin: isAdmin,
      type: isAdmin ? "admin" : "user",
    }, user.rememberMe || false);

    // Update session activity if not admin
    if (!isAdmin) {
      // Find current session and update activity
      const userAgent = request.headers.get("user-agent") || "Unknown";
      const currentSession = user.activeSessions.find((session: any) => 
        session.userAgent === userAgent
      );
      
      if (currentSession) {
        await user.updateSessionActivity(currentSession.sessionId);
      }
    }

    // Create response
    const response = NextResponse.json(
      {
        message: "Token refreshed successfully",
        accessToken: newAccessToken, // Include in response for client-side access
        _meta: { responseTime: `${Date.now() - startTime}ms` },
      },
      { status: 200 }
    );

    // Set new access token cookie
    const cookieOptions = getSecureCookieOptions(user.rememberMe || false);
    response.cookies.set("access_token", newAccessToken, cookieOptions);

    // Security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");

    return response;
  } catch (error: any) {
    console.error("Token refresh error:", error);

    return NextResponse.json(
      {
        message: "Token refresh failed",
        _meta: { responseTime: `${Date.now() - startTime}ms` },
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
