"use client";

import { useTheme, CherryBlossomBackground } from "@/lib/contexts/ThemeContext";
import { ReactNode } from "react";

interface ThemeBackgroundProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "tertiary" | "accent" | "glass" | "glass-elevated";
  className?: string;
}

/**
 * ThemeBackground - A comprehensive background component that adapts to the current theme
 * 
 * Features:
 * - Automatic theme-aware background application
 * - Support for different background variants
 * - Special handling for flower theme with cherry blossom background
 * - Smooth transitions between themes
 * - Professional glassmorphism effects
 */
export default function ThemeBackground({ 
  children, 
  variant = "primary", 
  className = "" 
}: ThemeBackgroundProps) {
  const { theme, isFlowerTheme } = useTheme();

  // Generate theme-aware CSS classes
  const getBackgroundClass = () => {
    const baseClass = `bg-theme-${variant}`;
    const transitionClass = "transition-all duration-300 ease-in-out";
    
    return `${baseClass} ${transitionClass} ${className}`;
  };

  return (
    <div className={getBackgroundClass()}>
      {/* Special cherry blossom background for flower theme */}
      {isFlowerTheme && <CherryBlossomBackground />}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/**
 * Specialized background components for common use cases
 */

// Page-level background wrapper
export function PageBackground({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <ThemeBackground variant="primary" className={`min-h-screen ${className}`}>
      {children}
    </ThemeBackground>
  );
}

// Card/Panel background wrapper
export function CardBackground({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <ThemeBackground variant="secondary" className={`rounded-lg p-4 ${className}`}>
      {children}
    </ThemeBackground>
  );
}

// Glass effect background wrapper
export function GlassBackground({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <ThemeBackground variant="glass" className={`rounded-xl border border-white/10 ${className}`}>
      {children}
    </ThemeBackground>
  );
}

// Elevated glass effect background wrapper
export function ElevatedGlassBackground({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <ThemeBackground variant="glass-elevated" className={`rounded-xl border border-white/20 shadow-2xl ${className}`}>
      {children}
    </ThemeBackground>
  );
}
