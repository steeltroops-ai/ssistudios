"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  Save,
  Download,
  Undo,
  Redo,
  Layers,
  Type,
  Square,
  Image,
  Move,
  RotateCcw,
  Palette,
  History,
  Settings,
  Eye,
  EyeOff,
  ChevronDown,
  Grid3X3,
  Maximize2,
  Minimize2,
  Crop,
  Filter,
  Zap,
  MousePointer,
  Brush,
  Eraser,
  PaintBucket,
  Scissors,
  Copy,
  Trash2,
} from "lucide-react";
import {
  PageBackground,
  GlassBackground,
} from "@/components/shared/ThemeBackground";
import DashboardHeader from "@/app/(dashboard)/dashboard/Header";

// Local Component Definitions (no external imports)

// Professional Collapsible Section Component with Mathematical Spacing
// Fibonacci-based 8px grid system: 8, 13, 21, 34px for organic spatial rhythm
const CollapsibleSection = ({
  title,
  children,
  defaultOpen = true,
  priority = "medium",
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  priority?: "high" | "medium" | "low";
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Mathematical spacing based on priority and Fibonacci sequence
  const spacingClasses = {
    high: "mb-5", // 20px (close to 21px Fibonacci)
    medium: "mb-4", // 16px (close to 13px Fibonacci)
    low: "mb-3", // 12px (close to 8px Fibonacci)
  };

  return (
    <div className={spacingClasses[priority]}>
      <div
        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50/80 rounded-lg transition-all duration-200 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
          {title}
        </h4>
        <motion.div
          animate={{ rotate: isOpen ? 0 : -90 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
        </motion.div>
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
            <div className="pt-3 px-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Professional Icon Button Component - Industry Standard Design
const IconButton = ({
  icon: Icon,
  label,
  active = false,
  onClick,
  size = "md",
}: {
  icon: any;
  label?: string;
  active?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}) => {
  // Mathematical icon sizing based on golden ratio and accessibility standards
  const sizeClasses = {
    sm: "w-8 h-8", // 32px - Fibonacci sequence
    md: "w-10 h-10", // 40px - Close to 34px Fibonacci
    lg: "w-12 h-12", // 48px - Professional standard
  };

  const iconSizes = {
    sm: "w-4 h-4", // 16px
    md: "w-5 h-5", // 20px - Optimal for accessibility
    lg: "w-6 h-6", // 24px
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      className={`${
        sizeClasses[size]
      } flex items-center justify-center rounded-lg transition-all duration-200 group relative ${
        active
          ? "bg-blue-100 border-2 border-blue-400 text-blue-700 shadow-md"
          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 hover:shadow-sm"
      }`}
      onClick={onClick}
      title={label}
    >
      <Icon
        className={`${iconSizes[size]} transition-transform duration-200 ${
          active ? "scale-110" : "group-hover:scale-105"
        }`}
      />
      {label && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {label}
        </div>
      )}
    </motion.button>
  );
};

// Professional Tool Grid Component - Figma/Adobe Style
const ToolGridButton = ({
  icon: Icon,
  label,
  active = false,
  onClick,
  description,
}: {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
  description?: string;
}) => (
  <motion.button
    whileHover={{ scale: 1.03, y: -2 }}
    whileTap={{ scale: 0.97 }}
    className={`h-14 w-full flex flex-col items-center justify-center gap-1 rounded-xl border-2 transition-all duration-200 group relative ${
      active
        ? "bg-blue-100 border-blue-400 text-blue-700 shadow-lg"
        : "bg-white border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 hover:shadow-md"
    }`}
    onClick={onClick}
    title={description}
  >
    <Icon
      className={`w-5 h-5 transition-transform duration-200 ${
        active ? "scale-110" : "group-hover:scale-105"
      }`}
    />
    <span className="text-xs font-medium leading-tight">{label}</span>
    {active && (
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
    )}
  </motion.button>
);

export default function PosterEditorContent() {
  const [selectedTool, setSelectedTool] = useState("select");
  return (
    <PageBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 max-w-full overflow-hidden"
        style={{ paddingTop: "2rem" }}
      >
        {/* Editor Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 items-center mb-6"
        >
          {/* Left - Title */}
          <h1 className="text-2xl font-bold text-gray-800">Poster Editor</h1>

          {/* Center - Dashboard Header */}
          <div className="flex justify-center">
            <DashboardHeader />
          </div>

          {/* Right - Buttons */}
          <div className="flex justify-end items-center gap-2">
            <button className="p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
              <Undo className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
              <Redo className="w-5 h-5 text-gray-600" />
            </button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
              <Save className="w-4 h-4 inline mr-2" />
              Save
            </button>
            <button className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4 inline mr-2" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Editor Layout */}
        <div className="flex gap-4 h-[calc(100vh-200px)]">
          {/* Professional Tools Panel - Scrollbar-Free Design */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-72"
          >
            <GlassBackground className="p-5 shadow-xl border border-gray-200/50 h-full flex flex-col backdrop-blur-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  Tools & Actions
                </h3>
                <Settings className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
              </div>

              <div className="flex-1 space-y-1 overflow-hidden">
                {/* Content container with optimized spacing */}

                {/* Primary Design Tools */}
                <CollapsibleSection
                  title="Design Tools"
                  defaultOpen={true}
                  priority="high"
                >
                  <div className="grid grid-cols-3 gap-2">
                    <ToolGridButton
                      icon={MousePointer}
                      label="Select"
                      active={selectedTool === "select"}
                      onClick={() => setSelectedTool("select")}
                      description="Select and move objects"
                    />
                    <ToolGridButton
                      icon={Type}
                      label="Text"
                      active={selectedTool === "text"}
                      onClick={() => setSelectedTool("text")}
                      description="Add text elements"
                    />
                    <ToolGridButton
                      icon={Square}
                      label="Shape"
                      active={selectedTool === "shape"}
                      onClick={() => setSelectedTool("shape")}
                      description="Draw shapes"
                    />
                    <ToolGridButton
                      icon={Image}
                      label="Image"
                      active={selectedTool === "image"}
                      onClick={() => setSelectedTool("image")}
                      description="Insert images"
                    />
                    <ToolGridButton
                      icon={Brush}
                      label="Brush"
                      active={selectedTool === "brush"}
                      onClick={() => setSelectedTool("brush")}
                      description="Paint and draw"
                    />
                    <ToolGridButton
                      icon={Eraser}
                      label="Eraser"
                      active={selectedTool === "eraser"}
                      onClick={() => setSelectedTool("eraser")}
                      description="Erase elements"
                    />
                  </div>
                </CollapsibleSection>

                {/* Quick Actions */}
                <CollapsibleSection
                  title="Quick Actions"
                  defaultOpen={true}
                  priority="high"
                >
                  <div className="grid grid-cols-4 gap-2">
                    <IconButton icon={Move} label="Move to Front" size="md" />
                    <IconButton icon={RotateCcw} label="Rotate 90°" size="md" />
                    <IconButton icon={Palette} label="Color Picker" size="md" />
                    <IconButton icon={Copy} label="Duplicate" size="md" />
                    <IconButton icon={Scissors} label="Cut" size="md" />
                    <IconButton icon={Trash2} label="Delete" size="md" />
                    <IconButton icon={PaintBucket} label="Fill" size="md" />
                    <IconButton icon={Crop} label="Crop" size="md" />
                  </div>
                </CollapsibleSection>

                {/* Layers */}
                <CollapsibleSection title="Layers" defaultOpen={false}>
                  <div className="space-y-2">
                    {["Background", "Text Layer", "Shape 1", "Image"].map(
                      (layer, index) => (
                        <div
                          key={layer}
                          className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                            index === 1
                              ? "bg-blue-100 border border-blue-200"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <Layers className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700 flex-1">
                            {layer}
                          </span>
                          <div className="flex gap-1">
                            <Eye className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                            <Settings className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600" />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CollapsibleSection>

                {/* History */}
                <CollapsibleSection title="History" defaultOpen={false}>
                  <div className="space-y-2">
                    {[
                      "Initial State",
                      "Add Text",
                      "Change Color",
                      "Resize Shape",
                    ].map((action, index) => (
                      <div
                        key={action}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 cursor-pointer text-sm ${
                          index === 3
                            ? "bg-blue-100 border border-blue-200"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <History className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{action}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              </div>
            </GlassBackground>
          </motion.div>

          {/* Canvas Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 flex items-center justify-center"
          >
            <div className="w-96 h-96 bg-white rounded-lg shadow-md border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <Edit className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Canvas
                </h3>
                <p className="text-gray-500">Start creating your poster</p>
              </div>
            </div>
          </motion.div>

          {/* Professional Properties Panel - Optimized Layout */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-72 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 p-5 h-full flex flex-col"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                Properties
              </h3>
              <div className="flex gap-2">
                <Eye className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
                <Settings className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
              </div>
            </div>

            <div className="flex-1 space-y-1 overflow-hidden">
              {/* Optimized content container */}

              {/* Position & Size */}
              <CollapsibleSection title="Position & Size" defaultOpen={true} priority="high">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">X</label>
                    <input
                      type="number"
                      defaultValue="100"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono bg-white/80 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Y</label>
                    <input
                      type="number"
                      defaultValue="100"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono bg-white/80 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">W</label>
                    <input
                      type="number"
                      defaultValue="800"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono bg-white/80 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">H</label>
                    <input
                      type="number"
                      defaultValue="600"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono bg-white/80 transition-all duration-200"
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Appearance */}
              <CollapsibleSection title="Appearance" defaultOpen={true}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Fill Color
                    </label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
                        style={{ backgroundColor: "#3B82F6" }}
                      />
                      <input
                        type="text"
                        defaultValue="#3B82F6"
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Stroke Color
                    </label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
                        style={{ backgroundColor: "#1E40AF" }}
                      />
                      <input
                        type="text"
                        defaultValue="#1E40AF"
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Opacity
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="100"
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 text-center mt-1">
                      100%
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Blend Mode
                    </label>
                    <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option value="normal">Normal</option>
                      <option value="multiply">Multiply</option>
                      <option value="screen">Screen</option>
                      <option value="overlay">Overlay</option>
                      <option value="darken">Darken</option>
                      <option value="lighten">Lighten</option>
                    </select>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Typography */}
              <CollapsibleSection title="Typography" defaultOpen={false}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Font Family
                    </label>
                    <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Font Size
                    </label>
                    <input
                      type="number"
                      defaultValue="16"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Font Weight
                    </label>
                    <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option value="300">Light</option>
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semibold</option>
                      <option value="700">Bold</option>
                      <option value="800">Extra Bold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Text Align
                    </label>
                    <div className="flex gap-1">
                      <button className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                        Left
                      </button>
                      <button className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                        Center
                      </button>
                      <button className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                        Right
                      </button>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Canvas Settings */}
              <CollapsibleSection title="Canvas Settings" defaultOpen={false}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Show Grid</span>
                    <Grid3X3 className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Snap to Grid</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Show Rulers</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Zoom
                    </label>
                    <div className="flex items-center gap-2">
                      <Minimize2 className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
                      <input
                        type="range"
                        min="10"
                        max="500"
                        defaultValue="100"
                        className="flex-1"
                      />
                      <Maximize2 className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-1">
                      100%
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </PageBackground>
  );
}
