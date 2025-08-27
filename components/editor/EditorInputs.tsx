"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils/utils";

// Base input props
interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

interface ColorInputProps extends BaseInputProps {
  onColorChange?: (color: string) => void;
}

// Property number inputs for dimensions, opacity, etc.
export const PropertyNumberInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="space-y-2">
      {label && <label className="property-label block">{label}</label>}
      <input
        ref={ref}
        type="number"
        className={cn(
          "w-full h-9 px-3 rounded-lg glass-panel professional-input text-sm",
          "border border-white/10 text-white placeholder-white/40 font-medium",
          "focus:outline-none focus:ring-1 focus:ring-[var(--editor-accent-primary)]",
          "focus:border-[var(--editor-accent-primary)] transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error &&
            "border-[var(--editor-accent-danger)] focus:ring-[var(--editor-accent-danger)]",
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-xs text-[var(--editor-accent-danger)]">
          {error}
        </span>
      )}
    </div>
  )
);

PropertyNumberInput.displayName = "PropertyNumberInput";

// Text inputs for names, labels, etc.
export const PropertyTextInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="space-y-2">
      {label && <label className="property-label block">{label}</label>}
      <input
        ref={ref}
        type="text"
        className={cn(
          "w-full h-9 px-3 rounded-lg glass-panel professional-input text-sm",
          "border border-white/10 text-white placeholder-white/40 font-medium",
          "focus:outline-none focus:ring-1 focus:ring-[var(--editor-accent-primary)]",
          "focus:border-[var(--editor-accent-primary)] transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error &&
            "border-[var(--editor-accent-danger)] focus:ring-[var(--editor-accent-danger)]",
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-xs text-[var(--editor-accent-danger)]">
          {error}
        </span>
      )}
    </div>
  )
);

PropertyTextInput.displayName = "PropertyTextInput";

// Color picker inputs
export const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(
  ({ label, error, onColorChange, className, ...props }, ref) => (
    <div className="space-y-2">
      {label && <label className="property-label block">{label}</label>}
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "w-9 h-9 rounded-lg border-2 cursor-pointer transition-colors",
            "hover:border-white/40 border-white/20",
            error && "border-[var(--editor-accent-danger)]"
          )}
          style={{ backgroundColor: (props.value as string) || "#ffffff" }}
          onClick={() => {
            // Trigger the hidden color input
            const colorInput = document.getElementById(
              `color-${props.id || "input"}`
            ) as HTMLInputElement;
            colorInput?.click();
          }}
        />
        <input
          ref={ref}
          type="text"
          className={cn(
            "flex-1 h-9 px-3 rounded-lg glass-panel professional-input text-sm font-mono",
            "border border-white/10 text-white placeholder-white/40",
            "focus:outline-none focus:ring-1 focus:ring-[var(--editor-accent-primary)]",
            "focus:border-[var(--editor-accent-primary)] transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error &&
              "border-[var(--editor-accent-danger)] focus:ring-[var(--editor-accent-danger)]",
            className
          )}
          {...props}
        />
        <input
          id={`color-${props.id || "input"}`}
          type="color"
          className="sr-only"
          value={props.value}
          onChange={(e) => {
            onColorChange?.(e.target.value);
            props.onChange?.(e);
          }}
        />
      </div>
      {error && (
        <span className="text-xs text-[var(--editor-accent-danger)]">
          {error}
        </span>
      )}
    </div>
  )
);

ColorInput.displayName = "ColorInput";

// Select dropdown for options
export const PropertySelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, children, ...props }, ref) => (
    <div className="space-y-2">
      {label && <label className="property-label block">{label}</label>}
      <select
        ref={ref}
        className={cn(
          "w-full h-9 px-3 rounded-lg glass-panel professional-input text-sm",
          "border border-white/10 text-white bg-transparent",
          "focus:outline-none focus:ring-1 focus:ring-[var(--editor-accent-primary)]",
          "focus:border-[var(--editor-accent-primary)] transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error &&
            "border-[var(--editor-accent-danger)] focus:ring-[var(--editor-accent-danger)]",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span className="text-xs text-[var(--editor-accent-danger)]">
          {error}
        </span>
      )}
    </div>
  )
);

PropertySelect.displayName = "PropertySelect";

// Range slider for values like opacity, rotation
export const PropertySlider = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    { label, error, className, min = 0, max = 100, step = 1, ...props },
    ref
  ) => (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="property-label">{label}</label>
          <span className="text-xs text-white/60 font-mono">
            {props.value || 0}
          </span>
        </div>
      )}
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        className={cn(
          "w-full h-2 rounded-lg appearance-none cursor-pointer",
          "bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--editor-accent-primary)]",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4",
          "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--editor-accent-primary)]",
          "[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all",
          "[&::-webkit-slider-thumb]:hover:scale-110",
          "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full",
          "[&::-moz-range-thumb]:bg-[var(--editor-accent-primary)] [&::-moz-range-thumb]:cursor-pointer",
          "[&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-xs text-[var(--editor-accent-danger)]">
          {error}
        </span>
      )}
    </div>
  )
);

PropertySlider.displayName = "PropertySlider";

// Textarea for longer text content
export const PropertyTextarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
  }
>(({ label, error, className, ...props }, ref) => (
  <div className="space-y-2">
    {label && <label className="property-label block">{label}</label>}
    <textarea
      ref={ref}
      className={cn(
        "w-full min-h-[80px] p-3 rounded-lg glass-panel professional-input text-sm",
        "border border-white/10 text-white placeholder-white/40 font-medium",
        "focus:outline-none focus:ring-1 focus:ring-[var(--editor-accent-primary)]",
        "focus:border-[var(--editor-accent-primary)] transition-all duration-200",
        "resize-vertical disabled:opacity-50 disabled:cursor-not-allowed",
        error &&
          "border-[var(--editor-accent-danger)] focus:ring-[var(--editor-accent-danger)]",
        className
      )}
      {...props}
    />
    {error && (
      <span className="text-xs text-[var(--editor-accent-danger)]">
        {error}
      </span>
    )}
  </div>
));

PropertyTextarea.displayName = "PropertyTextarea";
