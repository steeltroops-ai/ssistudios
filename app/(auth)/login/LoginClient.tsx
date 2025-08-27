"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import AuthBg from "./AuthBg";
import { useAuth } from "@/lib/contexts/AuthContext";

// Apple-inspired validation patterns
interface ValidationState {
  username: {
    isValid: boolean;
    message: string;
    touched: boolean;
  };
  email: {
    isValid: boolean;
    message: string;
    touched: boolean;
  };
  password: {
    isValid: boolean;
    message: string;
    touched: boolean;
  };
  confirmPassword: {
    isValid: boolean;
    message: string;
    touched: boolean;
  };
}

// Authentication mode type
type AuthMode = "signin" | "signup";

export default function LoginClient() {
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    username: { isValid: false, message: "", touched: false },
    email: { isValid: false, message: "", touched: false },
    password: { isValid: false, message: "", touched: false },
    confirmPassword: { isValid: false, message: "", touched: false },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  // Real-time validation with Apple-style feedback
  const validateUsername = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return { isValid: false, message: "Username is required" };
    }
    if (trimmed.length < 2) {
      return { isValid: false, message: "Username too short" };
    }
    return { isValid: true, message: "" };
  }, []);

  const validateEmail = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return { isValid: false, message: "Email is required" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return { isValid: false, message: "Please enter a valid email" };
    }
    return { isValid: true, message: "" };
  }, []);

  const validatePassword = useCallback((value: string) => {
    if (!value) {
      return { isValid: false, message: "Password is required" };
    }
    if (value.length < 6) {
      return {
        isValid: false,
        message: "Password must be at least 6 characters",
      };
    }
    return { isValid: true, message: "" };
  }, []);

  const validateConfirmPassword = useCallback(
    (value: string, originalPassword: string) => {
      if (!value) {
        return { isValid: false, message: "Please confirm your password" };
      }
      if (value !== originalPassword) {
        return { isValid: false, message: "Passwords don't match" };
      }
      return { isValid: true, message: "" };
    },
    []
  );

  // Simplified handlers without real-time validation
  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(e.target.value);
      // Clear any existing errors when user starts typing
      if (validation.username.touched && !validation.username.isValid) {
        setValidation((prev) => ({
          ...prev,
          username: { isValid: true, message: "", touched: false },
        }));
      }
    },
    [validation.username.touched, validation.username.isValid]
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      // Clear any existing errors when user starts typing
      if (validation.email.touched && !validation.email.isValid) {
        setValidation((prev) => ({
          ...prev,
          email: { isValid: true, message: "", touched: false },
        }));
      }
    },
    [validation.email.touched, validation.email.isValid]
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      // Clear any existing errors when user starts typing
      if (validation.password.touched && !validation.password.isValid) {
        setValidation((prev) => ({
          ...prev,
          password: { isValid: true, message: "", touched: false },
        }));
      }
      // Also clear confirm password errors if they exist
      if (
        validation.confirmPassword.touched &&
        !validation.confirmPassword.isValid
      ) {
        setValidation((prev) => ({
          ...prev,
          confirmPassword: { isValid: true, message: "", touched: false },
        }));
      }
    },
    [
      validation.password.touched,
      validation.password.isValid,
      validation.confirmPassword.touched,
      validation.confirmPassword.isValid,
    ]
  );

  const handleConfirmPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value);
      // Clear any existing errors when user starts typing
      if (
        validation.confirmPassword.touched &&
        !validation.confirmPassword.isValid
      ) {
        setValidation((prev) => ({
          ...prev,
          confirmPassword: { isValid: true, message: "", touched: false },
        }));
      }
    },
    [validation.confirmPassword.touched, validation.confirmPassword.isValid]
  );

  // Validation only happens on form submission

  // Enhanced authentication handler with validation
  const handleAuth = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate fields based on auth mode
      const usernameValidation = validateUsername(username);
      const passwordValidation = validatePassword(password);
      const emailValidation =
        authMode === "signup"
          ? validateEmail(email)
          : { isValid: true, message: "" };
      const confirmPasswordValidation =
        authMode === "signup"
          ? validateConfirmPassword(confirmPassword, password)
          : { isValid: true, message: "" };

      setValidation({
        username: { ...usernameValidation, touched: true },
        email: { ...emailValidation, touched: authMode === "signup" },
        password: { ...passwordValidation, touched: true },
        confirmPassword: {
          ...confirmPasswordValidation,
          touched: authMode === "signup",
        },
      });

      // Don't submit if validation fails
      const isValid =
        usernameValidation.isValid &&
        passwordValidation.isValid &&
        (authMode === "signin" ||
          (emailValidation.isValid && confirmPasswordValidation.isValid));

      if (!isValid) {
        setError("Please fix the errors above");
        return;
      }

      setError("");
      setIsLoading(true);

      // Optimistic UI - start loading immediately
      const startTime = Date.now();

      try {
        // Choose API endpoint based on auth mode
        const endpoint =
          authMode === "signin" ? "/api/auth/login" : "/api/auth/signup";
        const requestBody =
          authMode === "signin"
            ? {
                username: username.trim(),
                password,
                userType: "admin",
                rememberMe,
              } // Try admin first, then user
            : {
                username: username.trim(),
                email: email.trim(),
                password,
                rememberMe,
              };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message ||
              `${
                authMode === "signin" ? "Login" : "Sign up"
              } failed. Please try again.`
          );
        }

        // Show performance metrics in development
        if (
          process.env.NODE_ENV === "development" &&
          data._meta?.responseTime
        ) {
          console.log(
            `${authMode} API response time: ${data._meta.responseTime}`
          );
          console.log(`Total ${authMode} time: ${Date.now() - startTime}ms`);
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
    [
      username,
      email,
      password,
      confirmPassword,
      authMode,
      login,
      validateUsername,
      validateEmail,
      validatePassword,
      validateConfirmPassword,
    ]
  );

  // Keyboard navigation enhancement
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !isLoading) {
        handleAuth(e as any);
      }
    },
    [handleAuth, isLoading]
  );

  // Focus management for accessibility
  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent relative">
      {/* Background - Preserved sophisticated galaxy animation */}
      <div className="absolute inset-0">
        <AuthBg />
      </div>

      {/* Apple-inspired loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="glass-panel-elevated p-8 rounded-2xl border border-white/10">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white/80"></div>
                <div className="absolute inset-0 rounded-full bg-white/5 animate-pulse"></div>
              </div>
              <span className="text-white/90 font-medium text-sm">
                Signing you in...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modern Login Form */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Main form container with refined glassmorphism */}
        <div className="glass-sidebar rounded-2xl p-6 border border-white/10 shadow-2xl backdrop-blur-xl">
          {/* Header with Apple-style typography and mode toggle */}
          <div className="text-center mb-6">
            {/* Mode Toggle with refined design */}
            <div className="mb-4">
              <div className="inline-flex bg-white/5 rounded-xl p-0.5 border border-white/10">
                <button
                  type="button"
                  onClick={() => setAuthMode("signin")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    authMode === "signin"
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-white/60 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    authMode === "signup"
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-white/60 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            <h1 className="text-2xl font-semibold text-white mb-1 tracking-tight">
              {authMode === "signin" ? "Welcome Back" : "Join SSI Studios"}
            </h1>
            <p className="text-white/60 text-sm font-medium">
              {authMode === "signin"
                ? "Sign in to your workspace"
                : "Create your account"}
            </p>
          </div>

          {/* Error message with Apple-style design */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                </div>
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleAuth}
            onKeyDown={handleKeyDown}
            className="space-y-4"
          >
            {/* Username field with compact design */}
            <div className="space-y-1">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white/80 px-1"
              >
                Username
              </label>
              <div className="relative">
                <input
                  ref={usernameRef}
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className={`w-full h-11 px-4 rounded-xl glass-panel border transition-all duration-200
                    text-white placeholder-white/40 font-medium text-sm
                    focus:outline-none focus:ring-1 focus:ring-white/30 focus:bg-white/8
                    ${
                      validation.username.touched &&
                      !validation.username.isValid
                        ? "border-red-400/60 ring-1 ring-red-400/30"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  placeholder="Enter your username"
                  autoComplete="username"
                />
                {validation.username.touched &&
                  !validation.username.isValid && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div>
                    </div>
                  )}
              </div>
            </div>

            {/* Email field - only for signup mode */}
            {authMode === "signup" && (
              <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white/80 px-1"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    ref={emailRef}
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full h-11 px-4 rounded-xl glass-panel border transition-all duration-200
                      text-white placeholder-white/40 font-medium text-sm
                      focus:outline-none focus:ring-1 focus:ring-white/30 focus:bg-white/8
                      ${
                        validation.email.touched && !validation.email.isValid
                          ? "border-red-400/60 ring-1 ring-red-400/30"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                  {validation.email.touched && !validation.email.isValid && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Password field with compact design */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/80 px-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full h-11 px-4 pr-12 rounded-xl glass-panel border transition-all duration-200
                    text-white placeholder-white/40 font-medium text-sm
                    focus:outline-none focus:ring-1 focus:ring-white/30 focus:bg-white/8
                    ${
                      validation.password.touched &&
                      !validation.password.isValid
                        ? "border-red-400/60 ring-1 ring-red-400/30"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  <div className="w-5 h-5 text-white/60 hover:text-white/80">
                    {showPassword ? (
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </div>
                </button>
                {validation.password.touched &&
                  !validation.password.isValid && (
                    <div className="absolute right-12 top-1/2 -translate-y-1/2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div>
                    </div>
                  )}
              </div>
            </div>

            {/* Confirm Password field - only for signup mode */}
            {authMode === "signup" && (
              <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-white/80 px-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    ref={confirmPasswordRef}
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`w-full h-11 px-4 pr-12 rounded-xl glass-panel border transition-all duration-200
                      text-white placeholder-white/40 font-medium text-sm
                      focus:outline-none focus:ring-1 focus:ring-white/30 focus:bg-white/8
                      ${
                        validation.confirmPassword.touched &&
                        !validation.confirmPassword.isValid
                          ? "border-red-400/60 ring-1 ring-red-400/30"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors duration-200"
                  >
                    <div className="w-5 h-5 text-white/60 hover:text-white/80">
                      {showConfirmPassword ? (
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                  {validation.confirmPassword.touched &&
                    !validation.confirmPassword.isValid && (
                      <div className="absolute right-12 top-1/2 -translate-y-1/2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Remember Me Checkbox (only for sign in) */}
            {authMode === "signin" && (
              <div className="flex items-center space-x-3 mb-4">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 transition-all duration-200 flex items-center justify-center
                    ${
                      rememberMe
                        ? "bg-blue-500 border-blue-500"
                        : "border-white/30 group-hover:border-white/50"
                    }`}
                  >
                    {rememberMe && (
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="ml-3 text-sm text-white/70 group-hover:text-white/90 transition-colors">
                    Remember me for 30 days
                  </span>
                </label>
              </div>
            )}

            {/* Compact submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 glass-button text-white font-medium rounded-xl border border-white/20
                         transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-white/30
                         disabled:cursor-not-allowed disabled:text-white/50 disabled:bg-white/5
                         hover:scale-[1.01] active:scale-[0.99] transform text-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/30 border-t-white/80"></div>
                  <span>
                    {authMode === "signin"
                      ? "Signing In..."
                      : "Creating Account..."}
                  </span>
                </div>
              ) : authMode === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>

            {/* Compact divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-transparent text-white/40 font-medium">
                  or
                </span>
              </div>
            </div>

            {/* Compact Google OAuth Button */}
            <button
              type="button"
              onClick={() => {
                // TODO: Implement Google OAuth
                console.log("Google OAuth clicked");
              }}
              disabled={isLoading}
              className="w-full h-11 bg-white/5 hover:bg-white/8 disabled:bg-white/3
                         text-white font-medium rounded-xl border border-white/10
                         transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-white/20
                         disabled:cursor-not-allowed disabled:text-white/30
                         hover:scale-[1.01] active:scale-[0.99] transform
                         flex items-center justify-center space-x-2 text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Compact footer */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-center text-white/40 text-xs">
              Secure access to your workspace
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
