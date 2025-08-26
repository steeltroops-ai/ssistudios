"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User, Command } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import GlobalSearchBar from "./GlobalSearchBar";
import NotificationCenter from "./NotificationCenter";
import UserMenu from "./UserMenu";

interface TopNavigationProps {
  title: string;
  isLoading?: boolean;
}

export default function TopNavigation({
  title,
  isLoading,
}: TopNavigationProps) {
  const { user } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Mock data

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
    <header className="top-navigation border-b border-white/10 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
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
              className="text-xl font-semibold text-white"
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
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
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

      {/* Glassmorphism styles */}
      <style jsx>{`
        .top-navigation {
          background: oklch(0.15 0.02 240 / 0.8);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          box-shadow: 0 1px 0 oklch(0.2 0.01 240 / 0.3);
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .top-navigation {
            background: #000;
            border-color: #fff;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .top-navigation * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </header>
  );
}
