import { NextResponse } from "next/server";
import dbConnect from "@/lib/database/dbconnect";

export async function GET() {
  try {
    console.log("Testing database connection...");

    // Test database connection with shorter timeout
    const connectionPromise = dbConnect();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database connection timeout after 5 seconds")), 5000)
    );

    await Promise.race([connectionPromise, timeoutPromise]);

    console.log("Database connection successful!");

    return NextResponse.json({
      message: "Database connection successful!",
      timestamp: new Date().toISOString(),
      mongoUri: process.env.MONGODB_URI ? "Set" : "Not set",
      nodeEnv: process.env.NODE_ENV
    });
  } catch (error: any) {
    console.error("Database connection failed:", error);

    return NextResponse.json({
      message: "Database connection failed",
      error: error.message,
      timestamp: new Date().toISOString(),
      mongoUri: process.env.MONGODB_URI ? "Set" : "Not set",
      nodeEnv: process.env.NODE_ENV
    }, { status: 500 });
  }
}
