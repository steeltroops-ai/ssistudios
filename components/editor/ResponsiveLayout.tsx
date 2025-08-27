"use client";

import { useState, useMemo, useRef, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronDown, Settings, X,
  Undo, Redo, Save, Download, ZoomIn, ZoomOut
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import {
  PrimaryButton,
  SuccessButton,
  SecondaryButton,
  IconButton,
  ToolPanel,
  PropertySection,
  BottomSheet,
} from "@/components/editor";

// Breakpoint hook following the strategy specifications
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop' | 'large'>('desktop');
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) setBreakpoint('mobile');        // 320px - 767px
      else if (width < 1024) setBreakpoint('tablet');  // 768px - 1023px
      else if (width < 1440) setBreakpoint('desktop'); // 1024px - 1439px
      else setBreakpoint('large');                     // 1440px+
    };
    
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);
  
  return breakpoint;
}

// Container size tracking hook
export function useContainerSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateSize = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setSize({ width, height });
      }
    };
    
    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }
    
    return () => resizeObserver.disconnect();
  }, []);
  
  return { ref, size };
}

// Apple-inspired Header Component following strategy specifications
interface EditorHeaderProps {
  projectName?: string;
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onExport?: () => void;
  className?: string;
}

export const EditorHeader = forwardRef<HTMLElement, EditorHeaderProps>(
  ({ 
    projectName = "Untitled Project", 
    onUndo, 
    onRedo, 
    onSave, 
    onExport, 
    className 
  }, ref) => {
    const breakpoint = useBreakpoint();
    
    // Dynamic header height based on breakpoint
    const headerHeight = {
      mobile: 'h-15',      // 60px
      tablet: 'h-16',      // 64px  
      desktop: 'h-18',     // 72px
      large: 'h-20'        // 80px
    }[breakpoint];
    
    return (
      <motion.header
        ref={ref}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn(
          headerHeight,
          "glass-sidebar border-b border-white/10 px-4 lg:px-6",
          className
        )}
      >
        <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
          {/* Left: Project Info */}
          <div className="flex items-center gap-3">
            <h1 className="editor-title text-lg lg:text-xl">
              Poster Editor
            </h1>
            {breakpoint !== 'mobile' && (
              <span className="text-sm text-white/60">
                {projectName}
              </span>
            )}
          </div>
          
          {/* Center: Primary Actions */}
          <div className="flex items-center" style={{ gap: 'var(--space-sm)' }}>
            <SecondaryButton 
              className="h-9 lg:h-10 px-3 lg:px-4"
              onClick={onUndo}
            >
              <Undo className="w-4 h-4" />
              {breakpoint !== 'mobile' && (
                <span className="ml-2 text-sm">Undo</span>
              )}
            </SecondaryButton>
            <SecondaryButton 
              className="h-9 lg:h-10 px-3 lg:px-4"
              onClick={onRedo}
            >
              <Redo className="w-4 h-4" />
              {breakpoint !== 'mobile' && (
                <span className="ml-2 text-sm">Redo</span>
              )}
            </SecondaryButton>
          </div>
          
          {/* Right: Save/Export */}
          <div className="flex items-center" style={{ gap: 'var(--space-sm)' }}>
            <PrimaryButton 
              className="h-9 lg:h-10 px-3 lg:px-4"
              onClick={onSave}
            >
              <Save className="w-4 h-4" />
              {breakpoint !== 'mobile' && (
                <span className="ml-2">Save</span>
              )}
            </PrimaryButton>
            <SuccessButton 
              className="h-9 lg:h-10 px-3 lg:px-4"
              onClick={onExport}
            >
              <Download className="w-4 h-4" />
              {breakpoint !== 'mobile' && (
                <span className="ml-2">Export</span>
              )}
            </SuccessButton>
          </div>
        </div>
      </motion.header>
    );
  }
);

EditorHeader.displayName = "EditorHeader";

// Dynamic Canvas Container following strategy specifications
interface CanvasContainerProps {
  children: React.ReactNode;
  canvasSize?: { width: number; height: number };
  onCanvasSizeChange?: (size: { width: number; height: number }) => void;
  className?: string;
}

export const CanvasContainer = forwardRef<HTMLDivElement, CanvasContainerProps>(
  ({ 
    children, 
    canvasSize = { width: 800, height: 600 }, 
    onCanvasSizeChange,
    className 
  }, ref) => {
    const breakpoint = useBreakpoint();
    const { ref: containerRef, size: containerSize } = useContainerSize();
    const [zoomLevel, setZoomLevel] = useState(1);
    
    // Calculate optimal canvas size based on container - following strategy logic
    const optimalSize = useMemo(() => {
      const padding = breakpoint === 'mobile' ? 32 : 64; // 16px or 32px on each side
      const availableWidth = containerSize.width - padding;
      const availableHeight = containerSize.height - padding;
      
      if (availableWidth <= 0 || availableHeight <= 0) {
        return { width: canvasSize.width, height: canvasSize.height, scale: 1 };
      }
      
      const scaleX = availableWidth / canvasSize.width;
      const scaleY = availableHeight / canvasSize.height;
      const scale = Math.min(scaleX, scaleY, 1) * zoomLevel;
      
      return {
        width: canvasSize.width * scale,
        height: canvasSize.height * scale,
        scale
      };
    }, [containerSize, canvasSize, zoomLevel, breakpoint]);
    
    return (
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className={cn(
          "flex-1 flex items-center justify-center relative",
          breakpoint === 'mobile' ? 'p-4' : 'p-4 lg:p-8',
          className
        )}
        style={{ background: 'var(--editor-bg-primary)' }}
      >
        {/* Canvas */}
        <div 
          className="relative rounded-xl shadow-2xl border-2 border-dashed flex items-center justify-center"
          style={{
            width: optimalSize.width,
            height: optimalSize.height,
            background: 'var(--editor-bg-canvas)',
            borderColor: 'var(--editor-border-primary)',
            minWidth: '200px',
            minHeight: '150px'
          }}
        >
          {children}
          
          {/* Zoom Controls - positioned as per strategy */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <IconButton
              onClick={() => setZoomLevel(Math.max(0.1, zoomLevel - 0.1))}
              disabled={zoomLevel <= 0.1}
            >
              <ZoomOut className="w-4 h-4" />
            </IconButton>
            <span className="property-label px-2 py-1 glass-panel rounded text-xs">
              {Math.round(zoomLevel * 100)}%
            </span>
            <IconButton
              onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.1))}
              disabled={zoomLevel >= 3}
            >
              <ZoomIn className="w-4 h-4" />
            </IconButton>
          </div>
        </div>
      </motion.div>
    );
  }
);

CanvasContainer.displayName = "CanvasContainer";

// Responsive Panel System following strategy specifications
interface ResponsivePanelProps {
  side: 'left' | 'right';
  title: string;
  children: React.ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  className?: string;
}

export const ResponsivePanel = forwardRef<HTMLDivElement, ResponsivePanelProps>(
  ({ 
    side, 
    title, 
    children, 
    defaultWidth = 320, 
    minWidth = 200, 
    maxWidth = 500,
    collapsible = true,
    defaultCollapsed = false,
    onCollapseChange,
    className 
  }, ref) => {
    const breakpoint = useBreakpoint();
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
    const [showMobileSheet, setShowMobileSheet] = useState(false);
    
    const handleCollapse = (collapsed: boolean) => {
      setIsCollapsed(collapsed);
      onCollapseChange?.(collapsed);
    };
    
    // Mobile: Bottom Sheet
    if (breakpoint === 'mobile') {
      return (
        <>
          <button
            onClick={() => setShowMobileSheet(true)}
            className="glass-button p-2 rounded-lg"
          >
            <Settings className="w-4 h-4" />
            <span className="ml-2 text-sm">{title}</span>
          </button>
          
          <BottomSheet
            title={title}
            isOpen={showMobileSheet}
            onClose={() => setShowMobileSheet(false)}
          >
            {children}
          </BottomSheet>
        </>
      );
    }
    
    // Panel width based on breakpoint - following strategy specifications
    const panelWidth = {
      tablet: isCollapsed ? 48 : Math.min(defaultWidth * 0.75, 240),   // 80px -> 240px
      desktop: isCollapsed ? 48 : Math.min(defaultWidth, 320),         // 96px -> 320px  
      large: isCollapsed ? 48 : Math.min(defaultWidth * 1.25, 400)     // 120px -> 400px
    }[breakpoint] || defaultWidth;
    
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "glass-sidebar flex flex-col",
          side === 'left' ? "border-r border-white/10" : "border-l border-white/10",
          className
        )}
        style={{ width: panelWidth }}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-white/10" style={{ padding: 'var(--space-sm)' }}>
          {!isCollapsed && (
            <h3 className="panel-title">{title}</h3>
          )}
          {collapsible && (
            <button
              onClick={() => handleCollapse(!isCollapsed)}
              className="glass-button p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
            >
              <ChevronLeft 
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isCollapsed && "rotate-180",
                  side === 'right' && !isCollapsed && "rotate-180"
                )} 
              />
            </button>
          )}
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
              style={{ padding: 'var(--space-sm)' }}
            >
              <div className="space-y-4">
                {children}
              </div>
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

ResponsivePanel.displayName = "ResponsivePanel";
