"use client";

import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  X,
  Settings,
  Edit,
  Type,
  Square,
  Image,
  Layers,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";

// Enhanced Button System with OKLCH Colors
interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success" | "secondary" | "tool" | "ghost";
  size?: "sm" | "md" | "lg";
  active?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export const EnhancedButton = forwardRef<
  HTMLButtonElement,
  EnhancedButtonProps
>(
  (
    {
      variant = "secondary",
      size = "md",
      active = false,
      loading = false,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
      primary:
        "glass-button-primary text-white hover:scale-[1.01] active:scale-[0.99]",
      success: "text-white hover:scale-[1.01] active:scale-[0.99]",
      secondary: "glass-button text-white/80 hover:text-white/90",
      tool: active ? "tool-button-active" : "tool-button",
      ghost: "text-white/70 hover:text-white/90 hover:bg-white/5",
    };

    const sizeClasses = {
      sm: "h-9 px-3 text-sm rounded-lg",
      md: "h-10 px-4 text-sm rounded-xl",
      lg: "h-11 px-6 text-base rounded-xl",
    };

    const successStyle =
      variant === "success"
        ? {
            background: "var(--editor-accent-success)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
          }
        : {};

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        style={successStyle}
        disabled={loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";

// Enhanced Tool Button with Apple-inspired micro-interactions
interface EnhancedToolButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  tool?: "select" | "text" | "shape" | "image";
  children: React.ReactNode;
}

export const EnhancedToolButton = forwardRef<
  HTMLButtonElement,
  EnhancedToolButtonProps
>(({ active = false, tool, children, className, onClick, ...props }, ref) => (
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
      "flex items-center justify-center",
      active ? "text-white" : "text-white/70 hover:text-white/90",
      tool && `tool-${tool}`,
      className
    )}
    onClick={onClick}
    {...(props as any)}
  >
    {children}
  </motion.button>
));

EnhancedToolButton.displayName = "EnhancedToolButton";

// Enhanced Input System with OKLCH styling
interface EnhancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
  variant?: "default" | "color" | "number";
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  (
    { label, error, description, variant = "default", className, ...props },
    ref
  ) => (
    <div className="space-y-2">
      {label && <label className="property-label block">{label}</label>}

      {description && (
        <p className="text-xs" style={{ color: "var(--editor-text-tertiary)" }}>
          {description}
        </p>
      )}

      <input
        ref={ref}
        className={cn(
          "w-full h-9 px-3 rounded-lg professional-input",
          variant === "number" && "font-mono",
          variant === "color" && "font-mono text-sm",
          error &&
            "border-[var(--editor-accent-danger)] focus:border-[var(--editor-accent-danger)]",
          className
        )}
        {...props}
      />

      {error && (
        <p className="feedback-error text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  )
);

EnhancedInput.displayName = "EnhancedInput";

// Enhanced Color Input with visual preview
interface EnhancedColorInputProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export const EnhancedColorInput = forwardRef<
  HTMLDivElement,
  EnhancedColorInputProps
>(({ label, value, onChange, className }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)}>
    <label className="property-label block">{label}</label>

    <div className="flex items-center gap-2">
      <div
        className="w-9 h-9 rounded-lg border-2 cursor-pointer transition-all duration-200
                     hover:border-white/40 hover:scale-105 focus-within:ring-2 focus-within:ring-white/30"
        style={{
          backgroundColor: value,
          borderColor: "var(--editor-border-primary)",
        }}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "color";
          input.value = value;
          input.onchange = (e) =>
            onChange((e.target as HTMLInputElement).value);
          input.click();
        }}
      />

      <EnhancedInput
        variant="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
        pattern="^#[0-9A-Fa-f]{6}$"
        placeholder="#000000"
      />
    </div>
  </div>
));

EnhancedColorInput.displayName = "EnhancedColorInput";

// Enhanced Panel with Apple-inspired animations
interface EnhancedPanelProps {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
  className?: string;
}

export const EnhancedPanel = forwardRef<HTMLDivElement, EnhancedPanelProps>(
  (
    {
      title,
      children,
      collapsible = true,
      defaultOpen = true,
      onToggle,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const handleToggle = () => {
      const newState = !isOpen;
      setIsOpen(newState);
      onToggle?.(newState);
    };

    return (
      <div ref={ref} className={cn("glass-panel rounded-xl", className)}>
        <div
          className={cn(
            "flex items-center justify-between p-4 border-b border-white/10",
            collapsible && "cursor-pointer hover:bg-white/5 transition-colors"
          )}
          onClick={collapsible ? handleToggle : undefined}
        >
          <h3 className="panel-title">{title}</h3>
          {collapsible && (
            <motion.div
              animate={{ rotate: isOpen ? 0 : -90 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-white/60" />
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-4">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

EnhancedPanel.displayName = "EnhancedPanel";

// Enhanced Sidebar Panel with responsive behavior
interface EnhancedSidebarProps {
  side: "left" | "right";
  title: string;
  children: React.ReactNode;
  width?: number;
  collapsible?: boolean;
  onClose?: () => void;
  className?: string;
}

export const EnhancedSidebar = forwardRef<HTMLDivElement, EnhancedSidebarProps>(
  (
    {
      side,
      title,
      children,
      width = 320,
      collapsible = true,
      onClose,
      className,
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

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
          className
        )}
        style={{ width: isCollapsed ? 48 : width }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          {!isCollapsed && <h3 className="panel-title">{title}</h3>}

          <div className="flex items-center gap-1">
            {collapsible && (
              <EnhancedButton
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2"
              >
                <ChevronLeft
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isCollapsed && "rotate-180",
                    side === "right" && !isCollapsed && "rotate-180"
                  )}
                />
              </EnhancedButton>
            )}

            {onClose && (
              <EnhancedButton
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </EnhancedButton>
            )}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-y-auto custom-scrollbar p-4"
            >
              <div className="space-y-4">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed State */}
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

EnhancedSidebar.displayName = "EnhancedSidebar";

// Tool Grid Component
interface ToolGridProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  className?: string;
}

export const ToolGrid = forwardRef<HTMLDivElement, ToolGridProps>(
  ({ selectedTool, onToolSelect, className }, ref) => {
    const tools = [
      {
        id: "select",
        icon: Edit,
        label: "Select",
        description: "Select and move objects",
      },
      {
        id: "text",
        icon: Type,
        label: "Text",
        description: "Add text elements",
      },
      { id: "shape", icon: Square, label: "Shape", description: "Draw shapes" },
      {
        id: "image",
        icon: Image,
        label: "Image",
        description: "Insert images",
      },
    ];

    return (
      <div ref={ref} className={cn("grid grid-cols-2 gap-3", className)}>
        {tools.map((tool) => (
          <EnhancedToolButton
            key={tool.id}
            active={selectedTool === tool.id}
            tool={tool.id as any}
            onClick={() => onToolSelect(tool.id)}
            className="h-16 w-full flex-col gap-1"
            title={tool.description}
          >
            <tool.icon className="w-5 h-5" />
            <span className="text-xs">{tool.label}</span>
          </EnhancedToolButton>
        ))}
      </div>
    );
  }
);

ToolGrid.displayName = "ToolGrid";
