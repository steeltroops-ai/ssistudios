"use client";

import { useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { 
  Edit, Type, Square, Image, Layers, History, 
  Settings, Palette, Move, RotateCcw, Save, Download, Undo, Redo
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import {
  EditorHeader,
  CanvasContainer,
  useBreakpoint,
} from "./ResponsiveLayout";
import {
  EnhancedButton,
  EnhancedToolButton,
  EnhancedInput,
  EnhancedColorInput,
  EnhancedPanel,
  EnhancedSidebar,
  ToolGrid,
} from "./DesignSystemComponents";
import { BottomSheet } from "./EditorPanels";

// Enhanced Mobile Toolbar with design system components
interface EnhancedMobileToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  className?: string;
}

const EnhancedMobileToolbar = forwardRef<HTMLDivElement, EnhancedMobileToolbarProps>(
  ({ selectedTool, onToolSelect, className }, ref) => {
    const tools = [
      { id: 'select', icon: Edit },
      { id: 'text', icon: Type },
      { id: 'shape', icon: Square },
      { id: 'image', icon: Image },
    ];
    
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={cn(
          "glass-sidebar border-t border-white/10 p-4",
          "flex items-center justify-center gap-3",
          className
        )}
        style={{ height: '72px' }}
      >
        {tools.map((tool) => (
          <EnhancedToolButton
            key={tool.id}
            active={selectedTool === tool.id}
            tool={tool.id as any}
            onClick={() => onToolSelect(tool.id)}
            className="h-12 w-12"
          >
            <tool.icon className="w-5 h-5" />
          </EnhancedToolButton>
        ))}
      </motion.div>
    );
  }
);

EnhancedMobileToolbar.displayName = "EnhancedMobileToolbar";

// Enhanced Tools Panel Content
interface EnhancedToolsPanelContentProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

const EnhancedToolsPanelContent = ({ selectedTool, onToolSelect }: EnhancedToolsPanelContentProps) => (
  <div className="space-y-6">
    <EnhancedPanel title="Tools" defaultOpen={true}>
      <ToolGrid
        selectedTool={selectedTool}
        onToolSelect={onToolSelect}
      />
    </EnhancedPanel>
    
    <EnhancedPanel title="Quick Actions" defaultOpen={false}>
      <div className="space-y-3">
        <EnhancedButton variant="secondary" className="w-full justify-start">
          <Move className="w-4 h-4 mr-3" />
          Move to Front
        </EnhancedButton>
        <EnhancedButton variant="secondary" className="w-full justify-start">
          <RotateCcw className="w-4 h-4 mr-3" />
          Rotate 90°
        </EnhancedButton>
        <EnhancedButton variant="secondary" className="w-full justify-start">
          <Palette className="w-4 h-4 mr-3" />
          Color Picker
        </EnhancedButton>
      </div>
    </EnhancedPanel>
  </div>
);

// Enhanced Properties Panel Content
const EnhancedPropertiesPanelContent = () => (
  <div className="space-y-6">
    <EnhancedPanel title="Position & Size" defaultOpen={true}>
      <div className="grid grid-cols-2 gap-3">
        <EnhancedInput
          label="X"
          variant="number"
          defaultValue="100"
          className="text-center"
        />
        <EnhancedInput
          label="Y"
          variant="number"
          defaultValue="100"
          className="text-center"
        />
        <EnhancedInput
          label="Width"
          variant="number"
          defaultValue="200"
          className="text-center"
        />
        <EnhancedInput
          label="Height"
          variant="number"
          defaultValue="150"
          className="text-center"
        />
      </div>
    </EnhancedPanel>
    
    <EnhancedPanel title="Appearance" defaultOpen={true}>
      <div className="space-y-4">
        <EnhancedColorInput
          label="Fill Color"
          value="#3B82F6"
          onChange={() => {}}
        />
        <EnhancedColorInput
          label="Stroke Color"
          value="#1E40AF"
          onChange={() => {}}
        />
        <EnhancedInput
          label="Opacity"
          variant="number"
          defaultValue="100"
          className="text-center"
        />
        <div className="space-y-2">
          <label className="property-label block">Blend Mode</label>
          <select className="w-full h-9 px-3 rounded-lg professional-input">
            <option value="normal">Normal</option>
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
            <option value="overlay">Overlay</option>
          </select>
        </div>
      </div>
    </EnhancedPanel>
    
    <EnhancedPanel title="Typography" defaultOpen={false}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="property-label block">Font Family</label>
          <select className="w-full h-9 px-3 rounded-lg professional-input">
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Arial">Arial</option>
          </select>
        </div>
        <EnhancedInput
          label="Font Size"
          variant="number"
          defaultValue="16"
          className="text-center"
        />
        <div className="space-y-2">
          <label className="property-label block">Font Weight</label>
          <select className="w-full h-9 px-3 rounded-lg professional-input">
            <option value="300">Light</option>
            <option value="400">Regular</option>
            <option value="500">Medium</option>
            <option value="600">Semibold</option>
            <option value="700">Bold</option>
          </select>
        </div>
      </div>
    </EnhancedPanel>
  </div>
);

// Enhanced Layers Panel Content
const EnhancedLayersPanelContent = () => (
  <div className="space-y-4">
    <EnhancedPanel title="Layers" defaultOpen={true}>
      <div className="space-y-2">
        {['Background', 'Text Layer', 'Shape 1', 'Image'].map((layer, index) => (
          <div
            key={layer}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
              "hover:bg-white/5 cursor-pointer glass-panel",
              index === 1 && "bg-white/10 border-[var(--editor-accent-primary)]"
            )}
          >
            <Layers className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/80 flex-1">{layer}</span>
            <div className="w-2 h-2 rounded-full bg-white/40" />
          </div>
        ))}
      </div>
    </EnhancedPanel>
  </div>
);

// Enhanced History Panel Content
const EnhancedHistoryPanelContent = () => (
  <div className="space-y-4">
    <EnhancedPanel title="History" defaultOpen={true}>
      <div className="space-y-2">
        {['Initial State', 'Add Text', 'Change Color', 'Resize Shape'].map((action, index) => (
          <div
            key={action}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
              "hover:bg-white/5 cursor-pointer glass-panel text-sm",
              index === 3 && "bg-white/10 border-[var(--editor-accent-primary)]"
            )}
          >
            <History className="w-4 h-4 text-white/60" />
            <span className="text-white/80">{action}</span>
          </div>
        ))}
      </div>
    </EnhancedPanel>
  </div>
);

// Enhanced Header Component
interface EnhancedEditorHeaderProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onExport?: () => void;
  className?: string;
}

const EnhancedEditorHeader = forwardRef<HTMLElement, EnhancedEditorHeaderProps>(
  ({ onUndo, onRedo, onSave, onExport, className }, ref) => {
    const breakpoint = useBreakpoint();
    
    return (
      <motion.header
        ref={ref}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn(
          "glass-sidebar border-b border-white/10 px-6",
          {
            'h-15': breakpoint === 'mobile',
            'h-16': breakpoint === 'tablet',
            'h-18': breakpoint === 'desktop',
            'h-20': breakpoint === 'large'
          },
          className
        )}
      >
        <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
          {/* Left: Project Info */}
          <div className="flex items-center gap-4">
            <h1 className="editor-title">Poster Editor</h1>
            {breakpoint !== 'mobile' && (
              <span className="text-sm" style={{ color: 'var(--editor-text-tertiary)' }}>
                Untitled Project
              </span>
            )}
          </div>
          
          {/* Center: Primary Actions */}
          <div className="flex items-center gap-3">
            <EnhancedButton
              variant="secondary"
              size={breakpoint === 'mobile' ? 'sm' : 'md'}
              onClick={onUndo}
            >
              <Undo className="w-4 h-4" />
              {breakpoint !== 'mobile' && <span className="ml-2">Undo</span>}
            </EnhancedButton>
            <EnhancedButton
              variant="secondary"
              size={breakpoint === 'mobile' ? 'sm' : 'md'}
              onClick={onRedo}
            >
              <Redo className="w-4 h-4" />
              {breakpoint !== 'mobile' && <span className="ml-2">Redo</span>}
            </EnhancedButton>
          </div>
          
          {/* Right: Save/Export */}
          <div className="flex items-center gap-3">
            <EnhancedButton
              variant="primary"
              size={breakpoint === 'mobile' ? 'sm' : 'md'}
              onClick={onSave}
            >
              <Save className="w-4 h-4" />
              {breakpoint !== 'mobile' && <span className="ml-2">Save</span>}
            </EnhancedButton>
            <EnhancedButton
              variant="success"
              size={breakpoint === 'mobile' ? 'sm' : 'md'}
              onClick={onExport}
            >
              <Download className="w-4 h-4" />
              {breakpoint !== 'mobile' && <span className="ml-2">Export</span>}
            </EnhancedButton>
          </div>
        </div>
      </motion.header>
    );
  }
);

EnhancedEditorHeader.displayName = "EnhancedEditorHeader";

// Main Enhanced Responsive Editor Layout
interface EnhancedResponsiveEditorLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export const EnhancedResponsiveEditorLayout = forwardRef<HTMLDivElement, EnhancedResponsiveEditorLayoutProps>(
  ({ children, className }, ref) => {
    const breakpoint = useBreakpoint();
    const [selectedTool, setSelectedTool] = useState('select');
    const [showMobileProperties, setShowMobileProperties] = useState(false);
    
    // Mobile Layout (320px - 767px)
    if (breakpoint === 'mobile') {
      return (
        <div ref={ref} className={cn("flex flex-col h-screen", className)}>
          <EnhancedEditorHeader />
          
          <CanvasContainer className="flex-1">
            {children || (
              <div className="flex items-center justify-center text-white/80">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                    <Edit className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="panel-title">Start Creating</h3>
                    <p className="property-label mt-2">
                      Select a tool to begin designing
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CanvasContainer>
          
          <EnhancedMobileToolbar
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
          />
          
          <BottomSheet
            title="Properties"
            isOpen={showMobileProperties}
            onClose={() => setShowMobileProperties(false)}
          >
            <EnhancedPropertiesPanelContent />
          </BottomSheet>
        </div>
      );
    }
    
    // Tablet Layout (768px - 1023px)
    if (breakpoint === 'tablet') {
      return (
        <div ref={ref} className={cn("flex h-screen", className)}>
          <EnhancedSidebar
            side="left"
            title="Tools"
            width={280}
          >
            <EnhancedToolsPanelContent
              selectedTool={selectedTool}
              onToolSelect={setSelectedTool}
            />
          </EnhancedSidebar>
          
          <div className="flex-1 flex flex-col">
            <EnhancedEditorHeader />
            
            <div className="flex flex-1">
              <CanvasContainer className="flex-1">
                {children || (
                  <div className="flex items-center justify-center text-white/80">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                        <Edit className="w-10 h-10" />
                      </div>
                      <div>
                        <h3 className="editor-title">Canvas Ready</h3>
                        <p className="tool-label mt-2">
                          Select a tool from the sidebar to start creating
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CanvasContainer>
              
              <EnhancedSidebar
                side="right"
                title="Properties"
                width={320}
              >
                <EnhancedPropertiesPanelContent />
              </EnhancedSidebar>
            </div>
          </div>
        </div>
      );
    }
    
    // Desktop & Large Desktop Layouts
    return (
      <div ref={ref} className={cn("flex h-screen", className)}>
        <EnhancedSidebar
          side="left"
          title="Tools"
          width={breakpoint === 'large' ? 360 : 320}
        >
          <EnhancedToolsPanelContent
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
          />
        </EnhancedSidebar>
        
        {breakpoint === 'large' && (
          <EnhancedSidebar
            side="left"
            title="Layers"
            width={280}
          >
            <EnhancedLayersPanelContent />
          </EnhancedSidebar>
        )}
        
        <div className="flex-1 flex flex-col">
          <EnhancedEditorHeader />
          
          <div className="flex flex-1">
            <CanvasContainer className="flex-1">
              {children || (
                <div className="flex items-center justify-center text-white/80">
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                      <Edit className="w-12 h-12" />
                    </div>
                    <div>
                      <h2 className="editor-title">Professional Canvas</h2>
                      <p className="tool-label mt-3">
                        Your creative workspace is ready. Select a tool to begin designing your poster.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CanvasContainer>
          </div>
          
          {/* Context Toolbar */}
          <div className="glass-sidebar border-t border-white/10 p-4 h-16 flex items-center justify-center">
            <span className="property-label">
              {breakpoint === 'large' ? 'Advanced Context Toolbar' : 'Context Toolbar'} - Selection Based
            </span>
          </div>
        </div>
        
        <EnhancedSidebar
          side="right"
          title="Properties"
          width={breakpoint === 'large' ? 380 : 340}
        >
          <EnhancedPropertiesPanelContent />
        </EnhancedSidebar>
        
        {breakpoint === 'large' && (
          <EnhancedSidebar
            side="right"
            title="History"
            width={280}
          >
            <EnhancedHistoryPanelContent />
          </EnhancedSidebar>
        )}
      </div>
    );
  }
);

EnhancedResponsiveEditorLayout.displayName = "EnhancedResponsiveEditorLayout";
