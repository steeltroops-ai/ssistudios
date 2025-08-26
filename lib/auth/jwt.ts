import jwt, { SignOptions } from "jsonwebtoken";
import { NextRequest } from "next/server";

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
  payload: Omit<TokenPayload, "iat" | "exp">
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(
  payload: Omit<RefreshTokenPayload, "iat" | "exp">
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verify JWT access token
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "ssi-studios",
      audience: "ssi-studios-users",
    }) as TokenPayload;
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
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "ssi-studios",
      audience: "ssi-studios-refresh",
    }) as RefreshTokenPayload;
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
export function getSecureCookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: maxAge || 24 * 60 * 60 * 1000, // 24 hours default
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
