"use client";

import { lazy, Suspense, ReactNode } from "react";
import { motion } from "framer-motion";

// Lazy load motion components for better performance
const LazyMotionDiv = lazy(() => 
  import("framer-motion").then(mod => ({ default: mod.motion.div }))
);

const LazyMotionMain = lazy(() => 
  import("framer-motion").then(mod => ({ default: mod.motion.main }))
);

const LazyAnimatePresence = lazy(() => 
  import("framer-motion").then(mod => ({ default: mod.AnimatePresence }))
);

// Lightweight CSS-based animations for simple cases
interface SimpleAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeInUp({ children, className = "", delay = 0 }: SimpleAnimationProps) {
  return (
    <div 
      className={`animate-fade-in-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function FadeIn({ children, className = "", delay = 0 }: SimpleAnimationProps) {
  return (
    <div 
      className={`animate-fade-in ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function SlideInLeft({ children, className = "", delay = 0 }: SimpleAnimationProps) {
  return (
    <div 
      className={`animate-slide-in-left ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// Optimized motion wrapper for critical animations only
interface OptimizedMotionProps {
  children: ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  layoutId?: string;
  whileHover?: any;
  whileTap?: any;
  drag?: boolean | "x" | "y";
  dragConstraints?: any;
  onDragEnd?: (event: any, info: any) => void;
}

export function OptimizedMotionDiv({ 
  children, 
  className = "",
  initial,
  animate,
  exit,
  transition,
  layoutId,
  whileHover,
  whileTap,
  drag,
  dragConstraints,
  onDragEnd,
  ...props 
}: OptimizedMotionProps) {
  // Use CSS animations for simple cases
  if (!whileHover && !whileTap && !drag && !layoutId && !exit) {
    const hasComplexAnimation = initial && animate && (
      typeof initial === 'object' && typeof animate === 'object' &&
      (Object.keys(initial).length > 2 || Object.keys(animate).length > 2)
    );
    
    if (!hasComplexAnimation) {
      return (
        <div className={`animate-fade-in-up ${className}`} {...props}>
          {children}
        </div>
      );
    }
  }

  // Use Framer Motion for complex animations
  return (
    <Suspense fallback={<div className={className}>{children}</div>}>
      <LazyMotionDiv
        className={className}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        layoutId={layoutId}
        whileHover={whileHover}
        whileTap={whileTap}
        drag={drag}
        dragConstraints={dragConstraints}
        onDragEnd={onDragEnd}
        {...props}
      >
        {children}
      </LazyMotionDiv>
    </Suspense>
  );
}

export function OptimizedMotionMain({ 
  children, 
  className = "",
  initial,
  animate,
  exit,
  transition,
  ...props 
}: OptimizedMotionProps) {
  return (
    <Suspense fallback={<main className={className}>{children}</main>}>
      <LazyMotionMain
        className={className}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        {...props}
      >
        {children}
      </LazyMotionMain>
    </Suspense>
  );
}

export function OptimizedAnimatePresence({ 
  children,
  mode = "wait",
  ...props 
}: { 
  children: ReactNode;
  mode?: "wait" | "sync" | "popLayout";
  [key: string]: any;
}) {
  return (
    <Suspense fallback={<>{children}</>}>
      <LazyAnimatePresence mode={mode} {...props}>
        {children}
      </LazyAnimatePresence>
    </Suspense>
  );
}

// Performance-optimized variants for common animations
export const fadeInUpVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const fadeInVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const slideInLeftVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export const scaleVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

// Optimized transition presets
export const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 25,
  mass: 0.8,
  duration: 0.25,
};

export const easeTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1]
};

// Hook for reduced motion preference
export function useReducedMotion() {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Conditional motion wrapper that respects user preferences
export function ConditionalMotion({ 
  children, 
  fallback,
  ...motionProps 
}: OptimizedMotionProps & { fallback?: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return <>{fallback || children}</>;
  }
  
  return (
    <OptimizedMotionDiv {...motionProps}>
      {children}
    </OptimizedMotionDiv>
  );
}

// Direct motion export for critical cases where lazy loading isn't suitable
export { motion };
