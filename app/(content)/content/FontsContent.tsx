"use client";

import { motion } from "framer-motion";
import {
  Type,
  Download,
  Star,
  Search,
  Filter,
  Upload,
  Eye,
} from "lucide-react";

export default function FontsContent() {
  const fontCategories = [
    {
      name: "Sans Serif",
      count: 234,
      example: "Modern & Clean",
      style: "font-sans",
    },
    {
      name: "Serif",
      count: 156,
      example: "Classic & Elegant",
      style: "font-serif",
    },
    {
      name: "Display",
      count: 89,
      example: "Bold & Dramatic",
      style: "font-bold",
    },
    {
      name: "Script",
      count: 67,
      example: "Elegant & Flowing",
      style: "italic",
    },
    {
      name: "Monospace",
      count: 45,
      example: "Code & Technical",
      style: "font-mono",
    },
    {
      name: "Handwritten",
      count: 34,
      example: "Personal & Casual",
      style: "font-light",
    },
  ];

  const popularFonts = [
    {
      name: "Inter",
      category: "Sans Serif",
      downloads: 12543,
      rating: 4.9,
      weights: 9,
    },
    {
      name: "Playfair Display",
      category: "Serif",
      downloads: 8932,
      rating: 4.8,
      weights: 6,
    },
    {
      name: "Roboto",
      category: "Sans Serif",
      downloads: 15678,
      rating: 4.7,
      weights: 12,
    },
    {
      name: "Montserrat",
      category: "Sans Serif",
      downloads: 11234,
      rating: 4.8,
      weights: 18,
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Font Library
            </h1>
            <p className="text-lg text-gray-600">
              Discover and manage your typography collection
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Font
            </button>
          </div>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search fonts..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              Filter
            </button>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>All Categories</option>
              <option>Sans Serif</option>
              <option>Serif</option>
              <option>Display</option>
            </select>
          </div>
        </motion.div>

        {/* Font Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Font Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fontCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <Type className="w-8 h-8 text-blue-600" />
                  <span className="text-sm text-gray-500">
                    {category.count} fonts
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {category.name}
                </h3>
                <p className={`text-2xl text-gray-700 ${category.style}`}>
                  {category.example}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Popular Fonts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Popular Fonts
          </h2>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {popularFonts.map((font, index) => (
                <motion.div
                  key={font.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3
                          className="text-2xl font-semibold text-gray-800"
                          style={{ fontFamily: font.name }}
                        >
                          {font.name}
                        </h3>
                        <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {font.category}
                        </span>
                      </div>
                      <div
                        className="text-4xl text-gray-700 mb-3"
                        style={{ fontFamily: font.name }}
                      >
                        The quick brown fox jumps over the lazy dog
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {font.downloads.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          {font.rating}
                        </div>
                        <span>{font.weights} weights</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-200">
            <Type className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Advanced Font Management
            </h2>
            <p className="text-gray-600 mb-6">
              AI-powered font pairing, custom font creation, and advanced
              typography tools.
            </p>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Coming Soon
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
