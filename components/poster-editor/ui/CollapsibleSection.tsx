"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  priority?: "high" | "medium" | "low";
}

// Apple-Inspired Collapsible Section Component with Premium Materials
// Mathematical spacing using Apple's 8pt grid system for perfect visual rhythm
export const CollapsibleSection = ({
  title,
  children,
  defaultOpen = true,
  priority = "medium",
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Apple-style spacing hierarchy with 8pt grid system
  const spacingClasses = {
    high: "mb-6", // 24px - Apple's preferred large spacing
    medium: "mb-4", // 16px - Standard section spacing
    low: "mb-3", // 12px - Compact spacing
  };

  return (
    <div className={spacingClasses[priority]}>
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-black/[0.03] active:bg-black/[0.05] rounded-xl transition-all duration-200 group backdrop-blur-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-sm font-medium text-gray-800 group-hover:text-gray-900 tracking-tight">
          {title}
        </h4>
        <motion.div
          animate={{ rotate: isOpen ? 0 : -90 }}
          transition={{
            duration: 0.25,
            ease: [0.25, 0.46, 0.45, 0.94], // Apple's preferred easing curve
          }}
        >
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" />
        </motion.div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94], // Apple's spring animation
            }}
            className="overflow-hidden"
          >
            <div className="pt-4 px-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
