"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User, Command } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import GlobalSearchBar from "./GlobalSearchBar";
import NotificationCenter from "./NotificationCenter";
import UserMenu from "./UserMenu";

interface EnhancedHeaderProps {
  title: string;
  isLoading?: boolean;
}

export default function EnhancedHeader({
  title,
  isLoading,
}: EnhancedHeaderProps) {
  const { user } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsSearchFocused(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="enhanced-header sticky top-0 z-40 border-b border-neutral-200/20">
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        {/* Left Section - Page Title */}
        <div className="flex items-center gap-4">
          <AnimatePresence mode="wait">
            <motion.h1
              key={title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                duration: 0.2,
              }}
              className="text-xl font-semibold text-neutral-900"
            >
              {title}
            </motion.h1>
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="loading-spinner"
            />
          )}
        </div>

        {/* Right Section - Search, Notifications, User */}
        <div className="flex items-center gap-3">
          {/* Global Search Bar */}
          <GlobalSearchBar
            isFocused={isSearchFocused}
            onFocusChange={setIsSearchFocused}
          />

          {/* Notification Center */}
          <NotificationCenter count={notificationCount} />

          {/* User Menu */}
          <UserMenu user={user} />
        </div>
      </div>

      {/* Enhanced Header Styles with OKLCH Design System */}
      <style jsx>{`
        .enhanced-header {
          /* OKLCH Background with glassmorphism */
          background: var(--color-neutral-50, oklch(0.98 0 0 / 0.95));
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);

          /* Subtle shadow using OKLCH neutral colors */
          box-shadow: 0 1px 0 var(--color-neutral-200, oklch(0.9 0 0 / 0.3)),
            0 1px 3px var(--color-neutral-900, oklch(0.1 0 0 / 0.05));
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid var(--color-neutral-300, oklch(0.8 0 0));
          border-top: 2px solid var(--color-primary-500, oklch(0.55 0.16 240));
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .enhanced-header {
            background: #fff;
            border-color: #000;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .enhanced-header * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Dark theme support */
        @media (prefers-color-scheme: dark) {
          .enhanced-header {
            background: var(--color-neutral-900, oklch(0.1 0 0 / 0.95));
            border-color: var(--color-neutral-800, oklch(0.2 0 0 / 0.3));
          }

          .enhanced-header h1 {
            color: var(--color-neutral-100, oklch(0.95 0 0));
          }
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .enhanced-header {
            padding-left: var(--space-4, 16px);
            padding-right: var(--space-4, 16px);
          }

          .enhanced-header h1 {
            font-size: 1.125rem;
          }
        }

        /* Focus management for accessibility */
        .enhanced-header:focus-within {
          box-shadow: 0 1px 0 var(--color-neutral-200, oklch(0.9 0 0 / 0.3)),
            0 1px 3px var(--color-neutral-900, oklch(0.1 0 0 / 0.05)),
            0 0 0 2px var(--color-primary-500, oklch(0.55 0.16 240 / 0.2));
        }

        /* Smooth transitions for all interactive elements */
        .enhanced-header * {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </header>
  );
}
