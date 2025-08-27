import jwt, { SignOptions } from "jsonwebtoken";
import { NextRequest } from "next/server";
import { randomBytes } from "crypto";

// JWT Configuration
const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

// Token payload interface
export interface TokenPayload {
  userId: string;
  username: string;
  email?: string;
  isAdmin: boolean;
  type: "user" | "admin";
  iat?: number;
  exp?: number;
}

// Refresh token payload
export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

/**
 * Generate JWT access token
 */
export function generateAccessToken(
  payload: Omit<TokenPayload, "iat" | "exp">,
  rememberMe: boolean = false
): string {
  const expiresIn = rememberMe ? "30d" : "24h"; // 30 days if remember me, otherwise 24 hours
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(
  payload: Omit<RefreshTokenPayload, "iat" | "exp">,
  rememberMe: boolean = false
): string {
  const expiresIn = rememberMe ? "30d" : "7d"; // 30 days if remember me, otherwise 7 days
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify JWT access token
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

/**
 * Verify JWT refresh token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    console.error("Refresh token verification failed:", error);
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Extract token from cookies
 */
export function extractTokenFromCookies(request: NextRequest): string | null {
  return request.cookies.get("access_token")?.value || null;
}

/**
 * Get token from request (tries both header and cookies)
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Try Authorization header first
  let token = extractTokenFromHeader(request);
  if (token) return token;

  // Fallback to cookies
  return extractTokenFromCookies(request);
}

/**
 * Middleware helper to verify authentication
 */
export function verifyAuthToken(request: NextRequest): TokenPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  return verifyAccessToken(token);
}

/**
 * Generate secure cookie options
 */
export function getSecureCookieOptions(
  rememberMe: boolean = false,
  maxAge?: number
) {
  const defaultMaxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000 // 30 days for remember me
    : 24 * 60 * 60 * 1000; // 24 hours default

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: maxAge || defaultMaxAge,
    path: "/",
  };
}

/**
 * Create authentication response with tokens
 */
export function createAuthResponse(user: any, response: Response) {
  const accessToken = generateAccessToken({
    userId: user._id || user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin || false,
    type: user.type || (user.isAdmin ? "admin" : "user"),
  });

  const refreshToken = generateRefreshToken({
    userId: user._id || user.id,
    tokenVersion: user.tokenVersion || 0,
  });

  // Set secure cookies
  const cookieOptions = getSecureCookieOptions();
  response.headers.set(
    "Set-Cookie",
    [
      `access_token=${accessToken}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join("; ")}`,
      `refresh_token=${refreshToken}; ${Object.entries({
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
        .map(([key, value]) => `${key}=${value}`)
        .join("; ")}`,
    ].join(", ")
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id || user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin || false,
      type: user.type || (user.isAdmin ? "admin" : "user"),
    },
  };
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Extract device info from user agent
 */
export function getDeviceInfo(userAgent: string): string {
  // Simple device detection - can be enhanced with a proper library
  if (userAgent.includes("Mobile")) {
    if (userAgent.includes("iPhone")) return "iPhone";
    if (userAgent.includes("Android")) return "Android Mobile";
    return "Mobile Device";
  }

  if (userAgent.includes("iPad")) return "iPad";
  if (userAgent.includes("Macintosh")) return "Mac";
  if (userAgent.includes("Windows")) return "Windows PC";
  if (userAgent.includes("Linux")) return "Linux PC";

  return "Unknown Device";
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
