"use client";

import { motion } from "framer-motion";
import { Eye, Settings, Minimize2, Maximize2, Grid3X3 } from "lucide-react";
import { CollapsibleSection } from "../ui/CollapsibleSection";

export const RightPropertiesPanel = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{
      delay: 0.4,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94], // Apple's spring curve
    }}
    className="w-72 lg:w-80 bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-black/[0.06] p-4 sm:p-6 h-full flex flex-col overflow-hidden"
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
        Properties
      </h3>
      <div className="flex gap-1">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-xl hover:bg-black/[0.03] transition-colors cursor-pointer"
        >
          <Eye className="w-5 h-5 text-gray-600 hover:text-gray-800 transition-colors" />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-xl hover:bg-black/[0.03] transition-colors cursor-pointer"
        >
          <Settings className="w-5 h-5 text-gray-600 hover:text-gray-800 transition-colors" />
        </motion.div>
      </div>
    </div>

    <div className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {/* Position & Size */}
      <CollapsibleSection
        title="Position & Size"
        defaultOpen={true}
        priority="high"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-800 mb-1 tracking-tight">
              X
            </label>
            <input
              type="number"
              defaultValue="100"
              className="w-full px-4 py-3 text-sm border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 text-center font-mono bg-white/80 hover:bg-white/90 transition-all duration-200 backdrop-blur-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-800 mb-1 tracking-tight">
              Y
            </label>
            <input
              type="number"
              defaultValue="100"
              className="w-full px-4 py-3 text-sm border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 text-center font-mono bg-white/80 hover:bg-white/90 transition-all duration-200 backdrop-blur-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-800 mb-1 tracking-tight">
              W
            </label>
            <input
              type="number"
              defaultValue="800"
              className="w-full px-4 py-3 text-sm border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 text-center font-mono bg-white/80 hover:bg-white/90 transition-all duration-200 backdrop-blur-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-800 mb-1 tracking-tight">
              H
            </label>
            <input
              type="number"
              defaultValue="600"
              className="w-full px-4 py-3 text-sm border border-black/[0.08] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 text-center font-mono bg-white/80 hover:bg-white/90 transition-all duration-200 backdrop-blur-sm"
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
            <div className="text-xs text-gray-500 text-center mt-1">100%</div>
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
            <div className="text-xs text-gray-500 text-center mt-1">100%</div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  </motion.div>
);
