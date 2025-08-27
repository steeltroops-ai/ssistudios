"use client";

import { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils/utils";

// Panel props interfaces
interface BasePanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

interface CollapsiblePanelProps extends BasePanelProps {
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

interface ResizablePanelProps extends BasePanelProps {
  side: "left" | "right";
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  collapsible?: boolean;
  onClose?: () => void;
}

interface PropertySectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

// Main tool panels
export const ToolPanel = forwardRef<HTMLDivElement, ResizablePanelProps>(
  (
    {
      title,
      children,
      side,
      defaultWidth = 320,
      minWidth = 200,
      maxWidth = 500,
      collapsible = true,
      onClose,
      className,
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [width, setWidth] = useState(defaultWidth);

    const handleCollapse = () => {
      setIsCollapsed(!isCollapsed);
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: side === "left" ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: side === "left" ? -20 : 20 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "glass-sidebar flex flex-col",
          side === "left"
            ? "border-r border-white/10"
            : "border-l border-white/10",
          isCollapsed ? "w-12" : `w-[${width}px]`,
          className
        )}
        style={{ width: isCollapsed ? 48 : width }}
      >
        {/* Panel Header */}
        <div
          className="flex items-center justify-between border-b border-white/10"
          style={{ padding: "var(--space-sm)" }}
        >
          {!isCollapsed && <h3 className="panel-title">{title}</h3>}
          <div className="flex items-center gap-1">
            {collapsible && (
              <button
                onClick={handleCollapse}
                className="glass-button p-2 rounded-lg hover:bg-white/5 transition-colors"
                aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
              >
                <ChevronLeft
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isCollapsed && "rotate-180",
                    side === "right" && !isCollapsed && "rotate-180"
                  )}
                />
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="glass-button p-2 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Panel Content */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto custom-scrollbar"
              style={{ padding: "var(--space-sm)" }}
            >
              <div className="space-y-4">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed State Icons */}
        {isCollapsed && (
          <div className="flex flex-col items-center py-4 space-y-2">
            <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
              <span className="text-xs text-white/60">
                {title.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </motion.div>
    );
  }
);

ToolPanel.displayName = "ToolPanel";

// Properties panel sections with collapsible functionality
export const PropertySection = forwardRef<HTMLDivElement, PropertySectionProps>(
  ({ title, children, defaultOpen = true, className }, ref) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-white/5 transition-colors group"
        >
          <span className="property-label group-hover:text-white/90 transition-colors">
            {title}
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-white/60 transition-transform duration-200",
              !isOpen && "-rotate-90"
            )}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-3">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

PropertySection.displayName = "PropertySection";

// Simple glass panel for content grouping
export const GlassPanel = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className }, ref) => (
  <div
    ref={ref}
    className={cn(
      "glass-panel rounded-lg border border-white/10 transition-all duration-200",
      "hover:border-white/20 focus-within:border-[var(--editor-accent-primary)]",
      className
    )}
    style={{ padding: "var(--space-sm)" }}
  >
    {children}
  </div>
));

GlassPanel.displayName = "GlassPanel";

// Card-like panel for grouped content
export const ContentCard = forwardRef<HTMLDivElement, BasePanelProps>(
  ({ title, children, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass-panel rounded-xl border border-white/10",
        "transition-all duration-200 hover:border-white/20",
        className
      )}
    >
      <div
        className="border-b border-white/10"
        style={{ padding: "var(--space-sm)" }}
      >
        <h4 className="panel-title">{title}</h4>
      </div>
      <div style={{ padding: "var(--space-sm)" }}>{children}</div>
    </div>
  )
);

ContentCard.displayName = "ContentCard";

// Floating panel for contextual tools
export const FloatingPanel = forwardRef<
  HTMLDivElement,
  BasePanelProps & { position?: { x: number; y: number } }
>(({ title, children, position, className }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.2 }}
    className={cn(
      "fixed z-50 glass-sidebar border border-white/20 rounded-xl shadow-2xl",
      "min-w-[200px] max-w-[400px]",
      className
    )}
    style={{
      left: position?.x || "auto",
      top: position?.y || "auto",
    }}
  >
    <div
      className="border-b border-white/10"
      style={{ padding: "var(--space-sm)" }}
    >
      <h4 className="panel-title">{title}</h4>
    </div>
    <div style={{ padding: "var(--space-sm)" }}>{children}</div>
  </motion.div>
));

FloatingPanel.displayName = "FloatingPanel";

// Mobile-friendly bottom sheet panel
export const BottomSheet = forwardRef<
  HTMLDivElement,
  BasePanelProps & { isOpen: boolean; onClose: () => void }
>(({ title, children, isOpen, onClose, className }, ref) => (
  <AnimatePresence>
    {isOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />

        {/* Sheet */}
        <motion.div
          ref={ref}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 glass-sidebar",
            "rounded-t-2xl border-t border-white/20 max-h-[80vh] overflow-hidden",
            className
          )}
        >
          {/* Handle */}
          <div className="flex justify-center py-2">
            <div className="w-12 h-1 bg-white/30 rounded-full" />
          </div>

          {/* Header */}
          <div
            className="flex items-center justify-between border-b border-white/10"
            style={{ padding: "var(--space-sm)" }}
          >
            <h3 className="panel-title">{title}</h3>
            <button onClick={onClose} className="glass-button p-2 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div
            className="flex-1 overflow-y-auto custom-scrollbar"
            style={{ padding: "var(--space-sm)" }}
          >
            {children}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
));

BottomSheet.displayName = "BottomSheet";

// Apple-inspired Animated Panel with smooth transitions
export const AnimatedPanel = forwardRef<
  HTMLDivElement,
  BasePanelProps & {
    isOpen: boolean;
    side?: "left" | "right";
    onClose?: () => void;
  }
>(({ title, children, isOpen, side = "left", onClose, className }, ref) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        ref={ref}
        initial={{
          opacity: 0,
          x: side === "left" ? -20 : 20,
        }}
        animate={{
          opacity: 1,
          x: 0,
        }}
        exit={{
          opacity: 0,
          x: side === "left" ? -20 : 20,
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
        className={cn(
          "glass-sidebar flex flex-col",
          side === "left"
            ? "border-r border-white/10"
            : "border-l border-white/10",
          className
        )}
      >
        {/* Panel Header */}
        <div
          className="flex items-center justify-between border-b border-white/10"
          style={{ padding: "var(--space-sm)" }}
        >
          <h3 className="panel-title">{title}</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="glass-button p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Panel Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="flex-1 overflow-y-auto custom-scrollbar"
          style={{ padding: "var(--space-sm)" }}
        >
          <div className="space-y-4">{children}</div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
));

AnimatedPanel.displayName = "AnimatedPanel";
