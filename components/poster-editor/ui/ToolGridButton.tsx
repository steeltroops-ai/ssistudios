"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ToolGridButtonProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  description?: string;
}

// Apple-Inspired Tool Grid Component - Premium Material Design
export const ToolGridButton = ({
  icon: Icon,
  label,
  active = false,
  onClick,
  description,
}: ToolGridButtonProps) => (
  <motion.button
    whileHover={{
      scale: 1.02,
      y: -1,
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
    }}
    whileTap={{
      scale: 0.98,
      transition: { duration: 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
    }}
    className={`h-16 w-full flex flex-col items-center justify-center gap-1.5 rounded-2xl border transition-all duration-200 group relative backdrop-blur-sm ${
      active
        ? "bg-blue-500/10 border-blue-500/20 text-blue-600 shadow-sm ring-1 ring-blue-500/10"
        : "bg-white/80 border-black/[0.08] text-gray-700 hover:bg-white/90 hover:border-black/[0.12] hover:text-gray-900 hover:shadow-sm"
    }`}
    onClick={onClick}
    title={description}
  >
    <Icon
      className={`w-5 h-5 transition-all duration-200 ${
        active ? "scale-105" : "group-hover:scale-105"
      }`}
    />
    <span className="text-xs font-medium leading-tight tracking-tight">
      {label}
    </span>
    {active && (
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
    )}
  </motion.button>
);
