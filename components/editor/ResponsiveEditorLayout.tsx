"use client";

import { useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { 
  Edit, Type, Square, Image, Layers, History, 
  Settings, Palette, Move, RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import {
  EditorHeader,
  CanvasContainer,
  ResponsivePanel,
  useBreakpoint,
} from "./ResponsiveLayout";
import {
  ToolButton,
  PropertySection,
  PropertyNumberInput,
  PropertyTextInput,
  ColorInput,
  PropertySelect,
} from "@/components/editor";

// Tool definitions following strategy specifications
const TOOLS = [
  { id: 'select', icon: Edit, label: 'Select' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'shape', icon: Square, label: 'Shape' },
  { id: 'image', icon: Image, label: 'Image' },
];

// Mobile Bottom Toolbar Component
interface MobileToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  className?: string;
}

const MobileToolbar = forwardRef<HTMLDivElement, MobileToolbarProps>(
  ({ selectedTool, onToolSelect, className }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={cn(
        "glass-sidebar border-t border-white/10 p-3",
        "flex items-center justify-center gap-2",
        className
      )}
      style={{ height: '64px' }}
    >
      {TOOLS.map((tool) => (
        <ToolButton
          key={tool.id}
          active={selectedTool === tool.id}
          onClick={() => onToolSelect(tool.id)}
          className="h-12 w-12"
        >
          <tool.icon className="w-5 h-5" />
        </ToolButton>
      ))}
    </motion.div>
  )
);

MobileToolbar.displayName = "MobileToolbar";

// Tools Panel Content
interface ToolsPanelContentProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

const ToolsPanelContent = ({ selectedTool, onToolSelect }: ToolsPanelContentProps) => (
  <div className="space-y-4">
    <PropertySection title="Tools" defaultOpen={true}>
      <div className="grid grid-cols-2 gap-2">
        {TOOLS.map((tool) => (
          <ToolButton
            key={tool.id}
            active={selectedTool === tool.id}
            onClick={() => onToolSelect(tool.id)}
            className="h-12 flex flex-col items-center justify-center gap-1"
          >
            <tool.icon className="w-5 h-5" />
            <span className="text-xs">{tool.label}</span>
          </ToolButton>
        ))}
      </div>
    </PropertySection>
    
    <PropertySection title="Quick Actions">
      <div className="space-y-2">
        <ToolButton className="w-full justify-start">
          <Move className="w-4 h-4 mr-2" />
          Move to Front
        </ToolButton>
        <ToolButton className="w-full justify-start">
          <RotateCcw className="w-4 h-4 mr-2" />
          Rotate 90°
        </ToolButton>
      </div>
    </PropertySection>
  </div>
);

// Properties Panel Content
const PropertiesPanelContent = () => (
  <div className="space-y-4">
    <PropertySection title="Position & Size" defaultOpen={true}>
      <div className="grid grid-cols-2 gap-3">
        <PropertyNumberInput label="X" value={100} />
        <PropertyNumberInput label="Y" value={100} />
        <PropertyNumberInput label="Width" value={200} />
        <PropertyNumberInput label="Height" value={150} />
      </div>
    </PropertySection>
    
    <PropertySection title="Appearance">
      <div className="space-y-3">
        <ColorInput label="Fill Color" value="#3B82F6" />
        <ColorInput label="Stroke Color" value="#1E40AF" />
        <PropertyNumberInput label="Opacity" value={100} />
        <PropertySelect label="Blend Mode" value="normal">
          <option value="normal">Normal</option>
          <option value="multiply">Multiply</option>
          <option value="screen">Screen</option>
          <option value="overlay">Overlay</option>
        </PropertySelect>
      </div>
    </PropertySection>
    
    <PropertySection title="Typography" defaultOpen={false}>
      <div className="space-y-3">
        <PropertySelect label="Font Family" value="Inter">
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Arial">Arial</option>
        </PropertySelect>
        <PropertyNumberInput label="Font Size" value={16} />
        <PropertySelect label="Font Weight" value="400">
          <option value="300">Light</option>
          <option value="400">Regular</option>
          <option value="500">Medium</option>
          <option value="600">Semibold</option>
          <option value="700">Bold</option>
        </PropertySelect>
      </div>
    </PropertySection>
  </div>
);

// Layers Panel Content (Desktop/Large only)
const LayersPanelContent = () => (
  <div className="space-y-4">
    <PropertySection title="Layers" defaultOpen={true}>
      <div className="space-y-2">
        {['Background', 'Text Layer', 'Shape 1', 'Image'].map((layer, index) => (
          <div
            key={layer}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg transition-colors",
              "hover:bg-white/5 cursor-pointer",
              index === 1 && "bg-white/10"
            )}
          >
            <Layers className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/80 flex-1">{layer}</span>
            <div className="w-2 h-2 rounded-full bg-white/40" />
          </div>
        ))}
      </div>
    </PropertySection>
  </div>
);

// History Panel Content (Desktop/Large only)
const HistoryPanelContent = () => (
  <div className="space-y-4">
    <PropertySection title="History" defaultOpen={true}>
      <div className="space-y-2">
        {['Initial State', 'Add Text', 'Change Color', 'Resize Shape'].map((action, index) => (
          <div
            key={action}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg transition-colors",
              "hover:bg-white/5 cursor-pointer text-sm",
              index === 3 && "bg-white/10"
            )}
          >
            <History className="w-4 h-4 text-white/60" />
            <span className="text-white/80">{action}</span>
          </div>
        ))}
      </div>
    </PropertySection>
  </div>
);

// Main Responsive Editor Layout
interface ResponsiveEditorLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export const ResponsiveEditorLayout = forwardRef<HTMLDivElement, ResponsiveEditorLayoutProps>(
  ({ children, className }, ref) => {
    const breakpoint = useBreakpoint();
    const [selectedTool, setSelectedTool] = useState('select');
    
    // Mobile Layout (320px - 767px)
    if (breakpoint === 'mobile') {
      return (
        <div ref={ref} className={cn("flex flex-col h-screen", className)}>
          <EditorHeader 
            onUndo={() => console.log('Undo')}
            onRedo={() => console.log('Redo')}
            onSave={() => console.log('Save')}
            onExport={() => console.log('Export')}
          />
          
          <CanvasContainer className="flex-1">
            {children || (
              <div className="flex items-center justify-center text-white/60">
                <span>Canvas Content</span>
              </div>
            )}
          </CanvasContainer>
          
          <MobileToolbar
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
          />
        </div>
      );
    }
    
    // Tablet Layout (768px - 1023px)
    if (breakpoint === 'tablet') {
      return (
        <div ref={ref} className={cn("flex h-screen", className)}>
          <ResponsivePanel
            side="left"
            title="Tools"
            defaultWidth={240}
            collapsible={true}
          >
            <ToolsPanelContent
              selectedTool={selectedTool}
              onToolSelect={setSelectedTool}
            />
          </ResponsivePanel>
          
          <div className="flex-1 flex flex-col">
            <EditorHeader 
              onUndo={() => console.log('Undo')}
              onRedo={() => console.log('Redo')}
              onSave={() => console.log('Save')}
              onExport={() => console.log('Export')}
            />
            
            <div className="flex flex-1">
              <CanvasContainer className="flex-1">
                {children || (
                  <div className="flex items-center justify-center text-white/60">
                    <span>Canvas Content</span>
                  </div>
                )}
              </CanvasContainer>
              
              <ResponsivePanel
                side="right"
                title="Properties"
                defaultWidth={320}
                collapsible={true}
              >
                <PropertiesPanelContent />
              </ResponsivePanel>
            </div>
          </div>
        </div>
      );
    }
    
    // Desktop Layout (1024px - 1439px)
    if (breakpoint === 'desktop') {
      return (
        <div ref={ref} className={cn("flex h-screen", className)}>
          <ResponsivePanel
            side="left"
            title="Tools"
            defaultWidth={320}
            collapsible={true}
          >
            <ToolsPanelContent
              selectedTool={selectedTool}
              onToolSelect={setSelectedTool}
            />
          </ResponsivePanel>
          
          <div className="flex-1 flex flex-col">
            <EditorHeader 
              onUndo={() => console.log('Undo')}
              onRedo={() => console.log('Redo')}
              onSave={() => console.log('Save')}
              onExport={() => console.log('Export')}
            />
            
            <div className="flex flex-1">
              <div className="flex-1 flex flex-col">
                <CanvasContainer className="flex-1">
                  {children || (
                    <div className="flex items-center justify-center text-white/60">
                      <span>Canvas Content</span>
                    </div>
                  )}
                </CanvasContainer>
                
                {/* Context Toolbar */}
                <div className="glass-sidebar border-t border-white/10 p-3 h-12 flex items-center justify-center">
                  <span className="text-sm text-white/60">Context Toolbar - Selection Based</span>
                </div>
              </div>
              
              <ResponsivePanel
                side="right"
                title="Properties"
                defaultWidth={400}
                collapsible={true}
              >
                <PropertiesPanelContent />
              </ResponsivePanel>
            </div>
          </div>
        </div>
      );
    }
    
    // Large Desktop Layout (1440px+)
    return (
      <div ref={ref} className={cn("flex h-screen", className)}>
        <ResponsivePanel
          side="left"
          title="Tools"
          defaultWidth={400}
          collapsible={true}
        >
          <ToolsPanelContent
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
          />
        </ResponsivePanel>
        
        <div className="flex-1 flex flex-col">
          <EditorHeader 
            onUndo={() => console.log('Undo')}
            onRedo={() => console.log('Redo')}
            onSave={() => console.log('Save')}
            onExport={() => console.log('Export')}
          />
          
          <div className="flex flex-1">
            <ResponsivePanel
              side="left"
              title="Layers"
              defaultWidth={240}
              collapsible={true}
            >
              <LayersPanelContent />
            </ResponsivePanel>
            
            <div className="flex-1 flex flex-col">
              <CanvasContainer className="flex-1">
                {children || (
                  <div className="flex items-center justify-center text-white/60">
                    <span>Canvas Content</span>
                  </div>
                )}
              </CanvasContainer>
              
              {/* Advanced Context Toolbar */}
              <div className="glass-sidebar border-t border-white/10 p-4 h-16 flex items-center justify-center">
                <span className="text-sm text-white/60">Advanced Context Toolbar</span>
              </div>
            </div>
            
            <ResponsivePanel
              side="right"
              title="Properties"
              defaultWidth={400}
              collapsible={true}
            >
              <PropertiesPanelContent />
            </ResponsivePanel>
            
            <ResponsivePanel
              side="right"
              title="History"
              defaultWidth={240}
              collapsible={true}
            >
              <HistoryPanelContent />
            </ResponsivePanel>
          </div>
        </div>
      </div>
    );
  }
);

ResponsiveEditorLayout.displayName = "ResponsiveEditorLayout";
