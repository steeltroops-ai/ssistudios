"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface IconButtonProps {
  icon: LucideIcon;
  label?: string;
  active?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

// Apple-Inspired Icon Button Component - Premium Material Design
export const IconButton = ({
  icon: Icon,
  label,
  active = false,
  onClick,
  size = "md",
}: IconButtonProps) => {
  // Apple's 8pt grid system with accessibility-first sizing
  const sizeClasses = {
    sm: "w-8 h-8", // 32px - Compact size
    md: "w-10 h-10", // 40px - Standard touch target
    lg: "w-12 h-12", // 48px - Large touch target
  };

  const iconSizes = {
    sm: "w-4 h-4", // 16px
    md: "w-5 h-5", // 20px - Apple's preferred icon size
    lg: "w-6 h-6", // 24px
  };

  return (
    <motion.button
      whileHover={{
        scale: 1.02,
        y: -0.5,
        transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
      className={`${
        sizeClasses[size]
      } flex items-center justify-center rounded-xl transition-all duration-200 group relative backdrop-blur-sm ${
        active
          ? "bg-blue-500/10 border border-blue-500/20 text-blue-600 shadow-sm ring-1 ring-blue-500/10"
          : "bg-white/80 border border-black/[0.08] text-gray-700 hover:bg-white/90 hover:border-black/[0.12] hover:text-gray-900 hover:shadow-sm"
      }`}
      onClick={onClick}
      title={label}
    >
      <Icon
        className={`${iconSizes[size]} transition-all duration-200 ${
          active ? "scale-105" : "group-hover:scale-105"
        }`}
      />
      {label && (
        <div className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-gray-900/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20 backdrop-blur-sm shadow-lg">
          {label}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-gray-900/90 rotate-45"></div>
        </div>
      )}
    </motion.button>
  );
};
