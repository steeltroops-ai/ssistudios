"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/utils";

// Button variant types
interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

interface ToolButtonProps extends BaseButtonProps {
  active?: boolean;
}

// Primary action buttons (Save, Export) - Apple-inspired with OKLCH colors
export const PrimaryButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ children, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "h-11 px-6 rounded-xl text-white font-medium",
        "transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]",
        "focus:outline-none focus:ring-2 focus:ring-white/30",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        "shadow-lg hover:shadow-xl",
        className
      )}
      style={{
        background: "var(--editor-accent-primary)",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
      }}
      {...props}
    >
      {children}
    </button>
  )
);

PrimaryButton.displayName = "PrimaryButton";

// Success action buttons (Export, Publish) - Apple-inspired with OKLCH success color
export const SuccessButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ children, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "h-11 px-6 rounded-xl text-white font-medium",
        "transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]",
        "focus:outline-none focus:ring-2 focus:ring-white/30",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        "shadow-lg hover:shadow-xl",
        className
      )}
      style={{
        background: "var(--editor-accent-success)",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
      }}
      {...props}
    >
      {children}
    </button>
  )
);

SuccessButton.displayName = "SuccessButton";

// Secondary actions (Undo, Redo)
export const SecondaryButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ children, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "h-10 px-4 rounded-xl glass-panel border border-white/10 text-white/80",
        "font-medium transition-all duration-200 hover:border-white/20",
        "hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2",
        "focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed",
        "disabled:hover:scale-100 disabled:hover:border-white/10",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

SecondaryButton.displayName = "SecondaryButton";

// Tool buttons (Select, Text, Shape)
export const ToolButton = forwardRef<HTMLButtonElement, ToolButtonProps>(
  ({ active = false, children, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "h-11 w-11 lg:h-12 lg:w-12 rounded-xl glass-panel border transition-all duration-200",
        "hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2",
        "focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed",
        "disabled:hover:scale-100",
        active
          ? "border-[var(--editor-tool-active)] bg-[var(--editor-tool-active)]/10 text-white"
          : "border-white/10 hover:border-white/20 text-white/70 hover:text-white/90",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

ToolButton.displayName = "ToolButton";

// Ghost button for minimal actions
export const GhostButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ children, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "h-9 px-3 rounded-lg text-white/70 hover:text-white/90",
        "hover:bg-white/5 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-white/30",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

GhostButton.displayName = "GhostButton";

// Icon button for toolbar actions
export const IconButton = forwardRef<HTMLButtonElement, ToolButtonProps>(
  ({ active = false, children, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "h-9 w-9 rounded-lg glass-panel border transition-all duration-200",
        "hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2",
        "focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed",
        "disabled:hover:scale-100 flex items-center justify-center",
        active
          ? "border-[var(--editor-tool-active)] bg-[var(--editor-tool-active)]/10 text-white"
          : "border-white/10 hover:border-white/20 text-white/70 hover:text-white/90",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

IconButton.displayName = "IconButton";

// Compact button for mobile interfaces
export const CompactButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ children, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "h-8 px-3 rounded-lg glass-panel border border-white/10",
        "text-white/80 text-sm font-medium transition-all duration-200",
        "hover:border-white/20 hover:text-white/90",
        "focus:outline-none focus:ring-1 focus:ring-white/30",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

CompactButton.displayName = "CompactButton";

// Animated Tool Button with Apple-inspired micro-interactions
export const AnimatedToolButton = forwardRef<
  HTMLButtonElement,
  ToolButtonProps
>(({ active = false, children, className, onClick, ...props }, ref) => (
  <motion.button
    ref={ref}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    animate={{
      backgroundColor: active ? "var(--editor-tool-active)" : "transparent",
      borderColor: active
        ? "var(--editor-tool-active)"
        : "rgba(255, 255, 255, 0.1)",
    }}
    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    className={cn(
      "h-12 w-12 rounded-xl glass-panel border focus:outline-none focus:ring-2",
      "focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed",
      "disabled:hover:scale-100 flex items-center justify-center",
      active ? "text-white" : "text-white/70 hover:text-white/90",
      className
    )}
    onClick={onClick}
    {...(props as any)}
  >
    {children}
  </motion.button>
));

AnimatedToolButton.displayName = "AnimatedToolButton";
