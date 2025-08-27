"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/utils";

// Performance-optimized CSS animations for simple transitions
// Use these instead of Framer Motion for better performance

interface CSSAnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}

// CSS Animated Button - Performance optimized for simple transitions
export const CSSAnimatedButton = forwardRef<HTMLButtonElement, CSSAnimatedButtonProps>(
  ({ active = false, children, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "tool-button transition-all duration-200 ease-out",
        "hover:scale-[1.02] active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-white/30",
        active && "tool-button-active",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

CSSAnimatedButton.displayName = "CSSAnimatedButton";

// CSS Animated Panel - Lightweight panel transitions
export const CSSAnimatedPanel = forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  className?: string;
  isVisible?: boolean;
}>(
  ({ children, className, isVisible = true }, ref) => (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-300 ease-out",
        isVisible 
          ? "opacity-100 translate-x-0" 
          : "opacity-0 translate-x-4 pointer-events-none",
        className
      )}
    >
      {children}
    </div>
  )
);

CSSAnimatedPanel.displayName = "CSSAnimatedPanel";

// CSS Animated Card - Hover effects with CSS only
export const CSSAnimatedCard = forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}>(
  ({ children, className, onClick }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        "glass-panel rounded-xl border border-white/10 p-4",
        "transition-all duration-200 ease-out",
        "hover:border-white/20 hover:scale-[1.01]",
        "active:scale-[0.99] cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-white/30",
        className
      )}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {children}
    </div>
  )
);

CSSAnimatedCard.displayName = "CSSAnimatedCard";

// CSS Animated Input - Focus transitions
export const CSSAnimatedInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}>(
  ({ label, error, className, ...props }, ref) => (
    <div className="space-y-2">
      {label && (
        <label className="property-label block transition-colors duration-200">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full h-9 px-3 rounded-lg glass-panel border border-white/10",
          "text-white placeholder-white/40 font-medium text-sm",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus:ring-1 focus:ring-[var(--editor-accent-primary)]",
          "focus:border-[var(--editor-accent-primary)] focus:scale-[1.01]",
          "hover:border-white/20",
          error && "border-[var(--editor-accent-danger)] focus:ring-[var(--editor-accent-danger)]",
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-xs text-[var(--editor-accent-danger)] transition-opacity duration-200">
          {error}
        </span>
      )}
    </div>
  )
);

CSSAnimatedInput.displayName = "CSSAnimatedInput";

// CSS Animated Toggle - Switch animations
export const CSSAnimatedToggle = forwardRef<HTMLButtonElement, {
  active: boolean;
  onToggle: (active: boolean) => void;
  label?: string;
  className?: string;
}>(
  ({ active, onToggle, label, className }, ref) => (
    <div className={cn("flex items-center gap-3", className)}>
      {label && (
        <label className="property-label">{label}</label>
      )}
      <button
        ref={ref}
        onClick={() => onToggle(!active)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-all duration-200 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-white/30",
          active 
            ? "bg-[var(--editor-accent-primary)]" 
            : "bg-white/20"
        )}
        role="switch"
        aria-checked={active}
      >
        <div
          className={cn(
            "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg",
            "transition-transform duration-200 ease-out",
            active ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  )
);

CSSAnimatedToggle.displayName = "CSSAnimatedToggle";

// CSS Animated Progress Bar
export const CSSAnimatedProgress = forwardRef<HTMLDivElement, {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}>(
  ({ value, max = 100, label, className }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <div className="flex items-center justify-between">
            <label className="property-label">{label}</label>
            <span className="text-xs text-white/60 font-mono">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        <div
          ref={ref}
          className="w-full h-2 bg-white/10 rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-[var(--editor-accent-primary)] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

CSSAnimatedProgress.displayName = "CSSAnimatedProgress";

// CSS Animated Skeleton - Loading states
export const CSSAnimatedSkeleton = forwardRef<HTMLDivElement, {
  className?: string;
  lines?: number;
}>(
  ({ className, lines = 3 }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-white/10 rounded animate-pulse",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "1.5s"
          }}
        />
      ))}
    </div>
  )
);

CSSAnimatedSkeleton.displayName = "CSSAnimatedSkeleton";
