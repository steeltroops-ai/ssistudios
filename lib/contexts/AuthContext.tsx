// contexts/AuthContext.tsx
// NEW FILE: This centralizes all authentication logic.
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

// Define the shape of the user and context
interface User {
  id: string;
  username: string;
  email?: string;
  fullName?: string;
  isAdmin: boolean;
  type: "user" | "admin";
  isEmailVerified?: boolean;
  rememberMe?: boolean; // For extended session preference
  preferences?: {
    theme: "light" | "dark" | "flower";
    notifications: boolean;
    language: string;
  };
  lastLoginAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean; // To handle initial auth check
  refreshToken: () => Promise<boolean>;
  getSessions: () => Promise<any[]>;
  revokeSession: (sessionId: string) => Promise<boolean>;
  revokeAllSessions: () => Promise<boolean>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The AuthProvider component that will wrap your app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // On initial load, check for a persisted user session and verify with server
  useEffect(() => {
    const loadUserSession = async () => {
      try {
        // First check sessionStorage for immediate UI update
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          } catch (error) {
            console.error("Failed to parse stored user data:", error);
            sessionStorage.removeItem("user");
          }
        }

        // Then verify with server using JWT token
        try {
          const response = await fetch("/api/auth/verify", {
            method: "GET",
            credentials: "include", // Include cookies
          });

          if (response.ok) {
            const data = await response.json();
            if (data.isAuthenticated && data.user) {
              setUser(data.user);
              sessionStorage.setItem("user", JSON.stringify(data.user));
            } else {
              // Token invalid, clear local state
              setUser(null);
              sessionStorage.removeItem("user");
            }
          } else {
            // Token invalid or expired, clear local state
            setUser(null);
            sessionStorage.removeItem("user");
          }
        } catch (verifyError) {
          console.error("Auth verification failed:", verifyError);
          // On verification error, keep local state but don't redirect
        }
      } catch (error) {
        console.error("Failed to load user session:", error);
        sessionStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserSession();
  }, []);

  // Set up automatic token refresh
  useEffect(() => {
    if (!user) return;

    // Refresh token every 23 hours (1 hour before expiration for 24h tokens)
    // or every 29 days for remember me tokens
    const refreshInterval = user.rememberMe
      ? 29 * 24 * 60 * 60 * 1000
      : 23 * 60 * 60 * 1000;

    const interval = setInterval(async () => {
      console.log("Attempting automatic token refresh...");
      const success = await refreshToken();
      if (!success) {
        console.log("Automatic token refresh failed, user logged out");
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [user]);

  // This crucial effect handles all redirection logic
  useEffect(() => {
    // Don't redirect until the initial loading is complete
    if (isLoading) {
      return;
    }

    const isAuthPage = pathname === "/login";

    // If user is not logged in and not on the login page, redirect them
    if (!user && !isAuthPage) {
      router.push("/login");
    }

    // If user IS logged in and tries to access the login page, redirect to dashboard
    if (user && isAuthPage) {
      router.push("/dashboard");
    }
  }, [user, isLoading, pathname, router]);

  const login = (userData: User) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
    // No need to push here; the effect above will handle it.
  };

  const logout = async () => {
    try {
      // Call logout API to clear server-side cookies
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear local state regardless of API call result
      setUser(null);
      sessionStorage.removeItem("user");
      // The effect will handle redirecting to /login.
    }
  };

  // Refresh access token
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        // Token is automatically set in cookies by the API
        return true;
      } else {
        // Refresh failed, logout user
        await logout();
        return false;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      await logout();
      return false;
    }
  };

  // Get user's active sessions
  const getSessions = async (): Promise<any[]> => {
    try {
      const response = await fetch("/api/auth/sessions", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        return data.sessions || [];
      } else {
        console.error("Failed to fetch sessions");
        return [];
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      return [];
    }
  };

  // Revoke a specific session
  const revokeSession = async (sessionId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `/api/auth/sessions?sessionId=${sessionId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      return response.ok;
    } catch (error) {
      console.error("Error revoking session:", error);
      return false;
    }
  };

  // Revoke all sessions (logout from all devices)
  const revokeAllSessions = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/sessions?all=true", {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        // Clear local state as well
        setUser(null);
        sessionStorage.removeItem("user");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error revoking all sessions:", error);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
    login,
    logout,
    isLoading,
    refreshToken,
    getSessions,
    revokeSession,
    revokeAllSessions,
  };

  // Render a loading state or null while checking auth to prevent content flashes
  if (isLoading) {
    // You can replace this with a full-page loading spinner
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily access the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
