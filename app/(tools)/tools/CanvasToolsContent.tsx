"use client";

import { motion } from "framer-motion";
import {
  Edit3,
  Move,
  RotateCw,
  Square,
  Circle,
  Type,
  Image,
  Layers,
} from "lucide-react";

export default function CanvasToolsContent() {
  const tools = [
    {
      name: "Move Tool",
      icon: Move,
      description: "Select and move objects",
      shortcut: "V",
    },
    {
      name: "Rotate Tool",
      icon: RotateCw,
      description: "Rotate selected objects",
      shortcut: "R",
    },
    {
      name: "Rectangle",
      icon: Square,
      description: "Draw rectangles",
      shortcut: "U",
    },
    {
      name: "Circle",
      icon: Circle,
      description: "Draw circles and ellipses",
      shortcut: "O",
    },
    {
      name: "Text Tool",
      icon: Type,
      description: "Add and edit text",
      shortcut: "T",
    },
    {
      name: "Image Tool",
      icon: Image,
      description: "Insert images",
      shortcut: "I",
    },
    {
      name: "Layers",
      icon: Layers,
      description: "Manage layers",
      shortcut: "L",
    },
    {
      name: "Edit Tool",
      icon: Edit3,
      description: "Edit object properties",
      shortcut: "E",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen p-8 bg-white max-w-full overflow-hidden"
      style={{ paddingTop: "2rem" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Canvas Tools
          </h1>
          <p className="text-lg text-gray-600">
            Professional design tools for creating stunning visuals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <tool.icon className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                  {tool.shortcut}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-600">{tool.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600 mb-6">
              Advanced canvas tools with real-time collaboration and AI-powered
              design assistance.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Get Notified
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
