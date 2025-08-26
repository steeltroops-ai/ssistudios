"use client";

import { motion } from "framer-motion";
import { Edit, Save, Download, Undo, Redo, Layers } from "lucide-react";
import {
  PageBackground,
  GlassBackground,
} from "@/components/shared/ThemeBackground";

export default function PosterEditorContent() {
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
          className="flex items-center justify-between mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-800">Poster Editor</h1>
          <div className="flex items-center gap-2">
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
          {/* Tools Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-64"
          >
            <GlassBackground className="p-4 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Tools
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left">
                  <Edit className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Text Tool</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left">
                  <Layers className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Shapes</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left">
                  <Download className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Images</span>
                </button>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-8">
                Layers
              </h3>
              <div className="space-y-2">
                <div className="p-2 rounded bg-blue-100 border border-blue-200">
                  <span className="text-sm text-gray-700">Background</span>
                </div>
                <div className="p-2 rounded bg-gray-100 border border-gray-200">
                  <span className="text-sm text-gray-700">Text Layer 1</span>
                </div>
                <div className="p-2 rounded bg-gray-100 border border-gray-200">
                  <span className="text-sm text-gray-700">Logo</span>
                </div>
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

          {/* Properties Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-64 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Properties
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width
                </label>
                <input
                  type="number"
                  defaultValue="800"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <input
                  type="number"
                  defaultValue="600"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <input
                  type="color"
                  defaultValue="#ffffff"
                  className="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </PageBackground>
  );
}
