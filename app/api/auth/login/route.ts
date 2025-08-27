import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/database/dbconnect";
import { User } from "@/lib/models/User";
import { Member } from "@/lib/models/Employee"; // Existing admin model
import bcrypt from "bcryptjs";
import rateLimit from "@/lib/utils/rateLimit";
import {
  generateAccessToken,
  generateRefreshToken,
  getSecureCookieOptions,
  generateSessionId,
  getDeviceInfo,
  getClientIP,
} from "@/lib/auth/jwt";

// Rate limiting configuration
const limiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500,
});

// Input validation schema
interface LoginRequest {
  username: string;
  password: string;
  userType?: "user" | "admin"; // Optional: specify user type
  rememberMe?: boolean; // Optional: extended session
}

// Validation helper
function validateLoginInput(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Username/email validation
  if (!data.username || typeof data.username !== "string") {
    errors.push("Username or email is required");
  } else {
    const username = data.username.trim();
    if (username.length < 2) {
      errors.push("Username or email is too short");
    }
  }

  // Password validation
  if (!data.password || typeof data.password !== "string") {
    errors.push("Password is required");
  } else {
    if (data.password.length < 3) {
      errors.push("Password is too short");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Apply rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    await limiter.check(10, ip); // 10 requests per 15 minutes per IP

    // Parse request body
    const body = await request.json();

    // Validate input
    const validation = validateLoginInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.errors,
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 400 }
      );
    }

    const {
      username,
      password,
      userType,
      rememberMe = false,
    }: LoginRequest = body;
    const identifier = username.toLowerCase().trim();

    console.log(`Login attempt for ${identifier}, rememberMe: ${rememberMe}`);

    // Connect to database
    await dbConnect();

    let user: any = null;
    let isAdmin = false;

    // Try to find user in both collections
    if (!userType || userType === "user") {
      // First try regular users collection
      user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      }).select("+password");
    }

    if (!user && (!userType || userType === "admin")) {
      // Then try admin collection (existing functionality)
      user = await Member.findOne({ username: identifier });
      isAdmin = true;
    }

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid username or password",
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 401 }
      );
    }

    // Check if account is locked (for regular users)
    if (!isAdmin && user.isLocked) {
      return NextResponse.json(
        {
          message:
            "Account is temporarily locked due to too many failed login attempts. Please try again later.",
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 423 }
      );
    }

    // Verify password - use direct bcrypt comparison for both user types
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(
        `Password verification for ${identifier}: ${isPasswordValid}`
      );
    } catch (error) {
      console.error("Password comparison error:", error);
      isPasswordValid = false;
    }

    if (!isPasswordValid) {
      // Increment login attempts for regular users
      if (!isAdmin) {
        await user.incLoginAttempts();
      }

      return NextResponse.json(
        {
          message: "Invalid username or password",
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 401 }
      );
    }

    // Reset login attempts on successful login (for regular users)
    if (!isAdmin && user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login time and session management
    if (!isAdmin) {
      user.lastLoginAt = new Date();
      user.rememberMe = rememberMe;

      // Create session data
      const sessionId = generateSessionId();
      const userAgent = request.headers.get("user-agent") || "Unknown";
      const deviceInfo = getDeviceInfo(userAgent);
      const ipAddress = getClientIP(request);
      const expiresAt = new Date(
        Date.now() +
          (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
      );

      // Add session to user
      await user.addSession({
        sessionId,
        deviceInfo,
        ipAddress,
        userAgent,
        expiresAt,
      });
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

    // Generate JWT tokens
    const accessToken = generateAccessToken(
      {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        isAdmin: isAdmin,
        type: isAdmin ? "admin" : "user",
      },
      rememberMe
    );

    const refreshToken = generateRefreshToken(
      {
        userId: user._id.toString(),
        tokenVersion: user.tokenVersion || 0,
      },
      rememberMe
    );

    // Create response with user data
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: userResponse,
        accessToken, // Include token in response for client-side access
        _meta: { responseTime: `${Date.now() - startTime}ms` },
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookies
    const cookieOptions = getSecureCookieOptions(rememberMe);
    console.log(`Setting cookies with options:`, cookieOptions);
    console.log(
      `Access token length: ${accessToken.length}, Refresh token length: ${refreshToken.length}`
    );

    response.cookies.set("access_token", accessToken, cookieOptions);
    response.cookies.set("refresh_token", refreshToken, {
      ...cookieOptions,
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // 30 days if remember me, otherwise 7 days
    });

    // Security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");

    return response;
  } catch (error: any) {
    console.error("Login error:", error);

    // Handle rate limiting
    if (error.status === 429) {
      return NextResponse.json(
        {
          message: "Too many login attempts. Please try again later.",
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 429 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        message: "An error occurred during login. Please try again.",
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
