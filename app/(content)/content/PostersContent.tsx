"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Download,
  Eye,
} from "lucide-react";

export default function PostersContent() {
  const posterCategories = [
    { name: "Business", count: 45, color: "bg-blue-500" },
    { name: "Events", count: 32, color: "bg-green-500" },
    { name: "Marketing", count: 28, color: "bg-purple-500" },
    { name: "Social Media", count: 56, color: "bg-pink-500" },
    { name: "Education", count: 23, color: "bg-orange-500" },
    { name: "Healthcare", count: 18, color: "bg-teal-500" },
  ];

  const mockPosters = [
    {
      id: 1,
      title: "Business Conference 2024",
      category: "Business",
      downloads: 1234,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Summer Sale Event",
      category: "Marketing",
      downloads: 892,
      rating: 4.6,
    },
    {
      id: 3,
      title: "Health Awareness Campaign",
      category: "Healthcare",
      downloads: 567,
      rating: 4.9,
    },
    {
      id: 4,
      title: "Educational Workshop",
      category: "Education",
      downloads: 445,
      rating: 4.7,
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
              Poster Gallery
            </h1>
            <p className="text-lg text-gray-600">
              Professional poster templates for every occasion
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New
            </button>
          </div>
        </motion.div>

        {/* Search and Filters */}
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
              placeholder="Search posters..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              Filter
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Grid className="w-5 h-5" />
            </button>
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <List className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {posterCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300"
              >
                <div
                  className={`w-12 h-12 ${category.color} rounded-lg mb-3 flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-lg">
                    {category.name[0]}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.count} templates
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Posters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Popular Posters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockPosters.map((poster, index) => (
              <motion.div
                key={poster.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300 cursor-pointer group"
              >
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Poster Preview</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {poster.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {poster.category}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">
                        {poster.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {poster.downloads}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Advanced Poster Management
            </h2>
            <p className="text-gray-600 mb-6">
              Full poster creation, editing, and management system with
              AI-powered design suggestions.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Coming Soon
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
