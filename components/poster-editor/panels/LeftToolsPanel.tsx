"use client";

import { motion } from "framer-motion";
import {
  Settings,
  MousePointer,
  Type,
  Square,
  Image,
  Brush,
  Eraser,
  Move,
  RotateCcw,
  Palette,
  Copy,
  Scissors,
  Trash2,
  PaintBucket,
  Crop,
  Layers,
  Eye,
  History,
} from "lucide-react";
import { GlassBackground } from "@/components/shared/ThemeBackground";
import { CollapsibleSection } from "../ui/CollapsibleSection";
import { ToolGridButton } from "../ui/ToolGridButton";
import { IconButton } from "../ui/IconButton";

interface LeftToolsPanelProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

export const LeftToolsPanel = ({
  selectedTool,
  onToolSelect,
}: LeftToolsPanelProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{
      delay: 0.2,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94], // Apple's spring curve
    }}
    className="w-72 lg:w-80"
  >
    <div className="p-6 shadow-lg border border-black/[0.06] h-full flex flex-col backdrop-blur-sm bg-white/70 rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
          Tools & Actions
        </h3>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-xl hover:bg-black/[0.03] transition-colors cursor-pointer"
        >
          <Settings className="w-5 h-5 text-gray-600 hover:text-gray-800 transition-colors" />
        </motion.div>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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
              onClick={() => onToolSelect("select")}
              description="Select and move objects"
            />
            <ToolGridButton
              icon={Type}
              label="Text"
              active={selectedTool === "text"}
              onClick={() => onToolSelect("text")}
              description="Add text elements"
            />
            <ToolGridButton
              icon={Square}
              label="Shape"
              active={selectedTool === "shape"}
              onClick={() => onToolSelect("shape")}
              description="Draw shapes"
            />
            <ToolGridButton
              icon={Image}
              label="Image"
              active={selectedTool === "image"}
              onClick={() => onToolSelect("image")}
              description="Insert images"
            />
            <ToolGridButton
              icon={Brush}
              label="Brush"
              active={selectedTool === "brush"}
              onClick={() => onToolSelect("brush")}
              description="Paint and draw"
            />
            <ToolGridButton
              icon={Eraser}
              label="Eraser"
              active={selectedTool === "eraser"}
              onClick={() => onToolSelect("eraser")}
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
                  <span className="text-sm text-gray-700 flex-1">{layer}</span>
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
            {["Initial State", "Add Text", "Change Color", "Resize Shape"].map(
              (action, index) => (
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
              )
            )}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  </motion.div>
);
