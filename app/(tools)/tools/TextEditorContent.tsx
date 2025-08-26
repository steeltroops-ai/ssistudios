"use client";

import { motion } from "framer-motion";
import {
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Minus,
} from "lucide-react";

export default function TextEditorContent() {
  const textTools = [
    {
      name: "Font Family",
      icon: Type,
      description: "Choose from 1000+ fonts",
      feature: "Typography",
    },
    {
      name: "Bold",
      icon: Bold,
      description: "Make text bold",
      feature: "Formatting",
    },
    {
      name: "Italic",
      icon: Italic,
      description: "Italicize text",
      feature: "Formatting",
    },
    {
      name: "Underline",
      icon: Underline,
      description: "Underline text",
      feature: "Formatting",
    },
    {
      name: "Align Left",
      icon: AlignLeft,
      description: "Left align text",
      feature: "Alignment",
    },
    {
      name: "Align Center",
      icon: AlignCenter,
      description: "Center align text",
      feature: "Alignment",
    },
    {
      name: "Align Right",
      icon: AlignRight,
      description: "Right align text",
      feature: "Alignment",
    },
    {
      name: "Text Color",
      icon: Palette,
      description: "Change text color",
      feature: "Styling",
    },
  ];

  const features = [
    {
      title: "Rich Text Formatting",
      description: "Complete text formatting with fonts, colors, and styles",
      items: [
        "1000+ Google Fonts",
        "Custom font uploads",
        "Advanced typography controls",
        "Text effects and shadows",
      ],
    },
    {
      title: "Layout & Alignment",
      description: "Precise text positioning and alignment tools",
      items: [
        "Multi-line text support",
        "Paragraph spacing",
        "Line height controls",
        "Text wrapping options",
      ],
    },
    {
      title: "Advanced Features",
      description: "Professional text editing capabilities",
      items: [
        "Text on path",
        "Variable fonts",
        "OpenType features",
        "Multi-language support",
      ],
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Text Editor</h1>
          <p className="text-lg text-gray-600">
            Professional typography tools for stunning text designs
          </p>
        </motion.div>

        {/* Text Tools Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {textTools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-purple-300 cursor-pointer group"
            >
              <tool.icon className="w-6 h-6 text-purple-600 group-hover:text-purple-700 transition-colors mb-2" />
              <h4 className="text-sm font-semibold text-gray-800 mb-1">
                {tool.name}
              </h4>
              <p className="text-xs text-gray-600">{tool.description}</p>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded mt-2 inline-block">
                {tool.feature}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <Minus className="w-3 h-3 text-purple-500 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Advanced Text Editor
            </h2>
            <p className="text-gray-600 mb-6">
              Professional text editing with real-time preview and advanced
              typography controls.
            </p>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Launch Editor
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
