"use client";
import { useState, useCallback } from "react";
import AuthBg from "./AuthBg";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function LoginClient() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Optimized handlers for better INP
  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
    },
    []
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    []
  );

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      // Optimistic UI - start loading immediately
      const startTime = Date.now();

      try {
        const res = await fetch("/api/admin-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          // If response is not ok, throw an error to be caught below
          throw new Error(data.message || "Login failed. Please try again.");
        }

        // Show performance metrics in development
        if (
          process.env.NODE_ENV === "development" &&
          data._meta?.responseTime
        ) {
          console.log(`Login API response time: ${data._meta.responseTime}`);
          console.log(`Total login time: ${Date.now() - startTime}ms`);
        }

        // On success, call the login function with instant feedback
        login(data.user);

        // Keep loading state briefly for smooth transition
        setTimeout(() => setIsLoading(false), 100);
      } catch (err: any) {
        console.error("API Error Response:", err);
        setError(err.message);
        setIsLoading(false); // Stop loading on error
      }
    },
    [username, password, login]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent relative">
      {/* Background - Lazy loaded for performance */}
      <div className="hidden md:block absolute inset-0">
        <AuthBg />
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
          <div className="text-center animate-scale-in">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-sm tracking-wide">
              Verifying credentials...
            </p>
          </div>
        </div>
      )}

      {/* Login Form - Optimized for LCP */}
      <div
        className="relative z-10 w-full max-w-sm rounded-xl shadow-lg p-8
                   bg-white md:bg-gray-800/20 md:backdrop-blur-md
                   border border-gray-200 md:border-gray-700/50
                   md:text-gray-100"
      >
        <h1 className="text-2xl font-semibold text-gray-900 md:text-gray-100 mb-2 text-center">
          SSI Studios Admin
        </h1>
        <p className="text-gray-500 md:text-gray-300 text-sm text-center mb-6">
          Please log in to continue
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 md:text-gray-300">
              Username
            </label>
            <input
              type="text"
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2
                         text-gray-900 md:text-white
                         focus:outline-none focus:ring-2 focus:ring-black md:focus:ring-blue-300
                         bg-white md:bg-gray-900/30 md:border-gray-700/50
                         transition-all duration-150"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter your username"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 md:text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2
                         text-gray-900 md:text-white
                         focus:outline-none focus:ring-2 focus:ring-black md:focus:ring-blue-300
                         bg-white md:bg-gray-900/30 md:border-gray-700/50
                         transition-all duration-150"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed
                       md:bg-gray-800/40 md:border md:border-gray-700/50 md:hover:bg-gray-700/50 md:shadow-inner
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
