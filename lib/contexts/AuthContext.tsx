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
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The AuthProvider component that will wrap your app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // On initial load, check for a persisted user session with performance optimization
  useEffect(() => {
    const loadUserSession = async () => {
      try {
        // Use requestIdleCallback for non-blocking session check
        if ("requestIdleCallback" in window) {
          requestIdleCallback(() => {
            const storedUser = sessionStorage.getItem("user");
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
            setIsLoading(false);
          });
        } else {
          // Fallback for browsers without requestIdleCallback
          const storedUser = sessionStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to parse user from sessionStorage", error);
        sessionStorage.removeItem("user");
        setIsLoading(false);
      }
    };

    loadUserSession();
  }, []);

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

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    // The effect will handle redirecting to /login.
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
    login,
    logout,
    isLoading,
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
