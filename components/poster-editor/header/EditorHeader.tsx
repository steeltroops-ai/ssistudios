"use client";

import { motion } from "framer-motion";
import { Save, Download, Undo, Redo, Palette } from "lucide-react";
import DashboardHeader from "@/app/(dashboard)/dashboard/Header";

// DashboardHeader-Inspired Button Component
const HeaderButton = ({
  children,
  onClick,
  variant = "secondary",
  className = "",
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  title?: string;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    title={title}
    className={`
      relative p-2 transition-all duration-200 rounded-full cursor-pointer
      ${
        variant === "primary"
          ? "text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
          : "text-white/80 hover:text-white hover:bg-white/10 hover:scale-110 active:scale-95"
      }
      ${className}
    `}
  >
    {children}
  </motion.button>
);

// Apple-Inspired Editor Header Component with Transparent Background
export const EditorHeader = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.1,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94], // Apple's signature spring curve
      }}
      className="w-full bg-transparent sticky top-0 z-50"
    >
      <div className="max-w-full px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between w-full gap-4">
          {/* Left - Premium Logo Design - Aligned with Left Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex items-center flex-shrink-0 ml-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-none">
                <span className="hidden sm:inline">Poster Editor</span>
                <span className="sm:hidden">Editor</span>
              </h1>
            </div>
          </motion.div>

          {/* Center - Dashboard Header with Bottom Padding */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="hidden md:flex justify-center flex-1"
            style={{ paddingBottom: "2px" }}
          >
            <DashboardHeader />
          </motion.div>

          {/* Right - Apple-Style Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex items-center gap-3 flex-shrink-0 mr-2"
          >
            {/* Undo/Redo Button Group - DashboardHeader Style */}
            <div className="flex items-center gap-1 p-1 rounded-full backdrop-blur-xl border border-white/10 shadow-lg bg-gradient-to-r from-gray-800/80 to-gray-900/80">
              <HeaderButton title="Undo">
                <Undo className="w-5 h-5" />
              </HeaderButton>
              <HeaderButton title="Redo">
                <Redo className="w-5 h-5" />
              </HeaderButton>
            </div>

            {/* Primary Action Buttons - DashboardHeader Style */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 text-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};
