import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/database/dbconnect";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";
import rateLimit from "@/lib/utils/rateLimit";

// Rate limiting configuration
const limiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500, // Limit each IP to 500 requests per windowMs
});

// Input validation schema
interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

// Validation helper
function validateSignupInput(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Username validation
  if (!data.username || typeof data.username !== "string") {
    errors.push("Username is required");
  } else {
    const username = data.username.trim();
    if (username.length < 2) {
      errors.push("Username must be at least 2 characters");
    }
    if (username.length > 30) {
      errors.push("Username cannot exceed 30 characters");
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push(
        "Username can only contain letters, numbers, underscores, and hyphens"
      );
    }
  }

  // Email validation
  if (!data.email || typeof data.email !== "string") {
    errors.push("Email is required");
  } else {
    const email = data.email.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.push("Please enter a valid email address");
    }
  }

  // Password validation
  if (!data.password || typeof data.password !== "string") {
    errors.push("Password is required");
  } else {
    if (data.password.length < 6) {
      errors.push("Password must be at least 6 characters");
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
    await limiter.check(5, ip); // 5 requests per 15 minutes per IP

    // Parse request body
    const body = await request.json();

    // Validate input
    const validation = validateSignupInput(body);
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

    const { username, email, password }: SignupRequest = body;

    // Connect to database
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { username: username.toLowerCase().trim() },
      ],
    });

    if (existingUser) {
      const field =
        existingUser.email === email.toLowerCase().trim()
          ? "email"
          : "username";
      return NextResponse.json(
        {
          message: `An account with this ${field} already exists`,
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = new User({
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password, // Will be hashed by pre-save middleware
      preferences: {
        theme: "light",
        notifications: true,
        language: "en",
      },
    });

    // Save user to database
    await newUser.save();

    // Remove password from response
    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      isEmailVerified: newUser.isEmailVerified,
      preferences: newUser.preferences,
      createdAt: newUser.createdAt,
    };

    // Set secure headers
    const response = NextResponse.json(
      {
        message: "Account created successfully",
        user: userResponse,
        _meta: { responseTime: `${Date.now() - startTime}ms` },
      },
      { status: 201 }
    );

    // Security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");

    return response;
  } catch (error: any) {
    console.error("Signup error:", error);

    // Handle rate limiting
    if (error.status === 429) {
      return NextResponse.json(
        {
          message: "Too many signup attempts. Please try again later.",
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 429 }
      );
    }

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          message: `An account with this ${field} already exists`,
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        {
          message: "Validation failed",
          errors,
          _meta: { responseTime: `${Date.now() - startTime}ms` },
        },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        message: "An error occurred during signup. Please try again.",
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
