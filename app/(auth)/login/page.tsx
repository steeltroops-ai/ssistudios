import { Metadata } from "next";
import LoginClient from "./LoginClient";

// Server-side metadata for SEO and performance
export const metadata: Metadata = {
  title: "Login - SSI Studios",
  description: "Sign in to your SSI Studios account",
  robots: "noindex, nofollow", // Don't index login pages
  other: {
    // Preload critical resources
    preload: "/api/admin-login",
    "dns-prefetch": "https://fonts.googleapis.com",
  },
};

// Server component for instant loading with resource hints
export default function LoginPage() {
  return <LoginClient />;
}
