"use client";

import { motion } from "framer-motion";
import { Palette, Upload, Download, Search } from "lucide-react";

export default function LogoContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen p-8 bg-transparent max-w-full overflow-hidden"
      style={{ paddingTop: "2rem" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Logo Gallery</h1>
        <p className="text-lg text-gray-600">
          Manage and organize your logo collection
        </p>
      </motion.div>

      {/* Action Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Upload Logo
          </h3>
          <p className="text-gray-600">Add new logos to your collection</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Palette className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Create Logo
          </h3>
          <p className="text-gray-600">Design a new logo from scratch</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Browse Gallery
          </h3>
          <p className="text-gray-600">Explore your logo collection</p>
        </motion.div>
      </div>

      {/* Logo Grid Placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Recent Logos
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="aspect-square bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Palette className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">Logo {i}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
