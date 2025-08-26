"use client";

import { motion } from "framer-motion";
import {
  Upload,
  Image,
  Video,
  Music,
  File,
  Search,
  Filter,
  Grid,
  List,
  Folder,
} from "lucide-react";

export default function MediaContent() {
  const mediaTypes = [
    {
      name: "Images",
      icon: Image,
      count: 1234,
      size: "2.3 GB",
      color: "bg-blue-500",
    },
    {
      name: "Videos",
      icon: Video,
      count: 89,
      size: "5.7 GB",
      color: "bg-red-500",
    },
    {
      name: "Audio",
      icon: Music,
      count: 156,
      size: "890 MB",
      color: "bg-green-500",
    },
    {
      name: "Documents",
      icon: File,
      count: 67,
      size: "234 MB",
      color: "bg-purple-500",
    },
  ];

  const recentFiles = [
    {
      name: "summer-campaign.jpg",
      type: "Image",
      size: "2.4 MB",
      modified: "2 hours ago",
    },
    {
      name: "product-video.mp4",
      type: "Video",
      size: "45.2 MB",
      modified: "1 day ago",
    },
    {
      name: "brand-logo.svg",
      type: "Vector",
      size: "156 KB",
      modified: "3 days ago",
    },
    {
      name: "presentation.pdf",
      type: "Document",
      size: "8.9 MB",
      modified: "1 week ago",
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
              Media Library
            </h1>
            <p className="text-lg text-gray-600">
              Organize and manage your design assets
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Files
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
              placeholder="Search media files..."
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

        {/* Media Type Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {mediaTypes.map((type, index) => (
            <motion.div
              key={type.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 cursor-pointer"
            >
              <div
                className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mb-4`}
              >
                <type.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {type.name}
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">{type.count} files</p>
                <p className="text-sm text-gray-500">{type.size}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Files */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Files
          </h2>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {recentFiles.map((file, index) => (
                <motion.div
                  key={file.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <File className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {file.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {file.type} • {file.size}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {file.modified}
                    </span>
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
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-8 border border-green-200">
            <Folder className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Advanced Media Management
            </h2>
            <p className="text-gray-600 mb-6">
              Full media library with AI-powered tagging, smart folders, and
              collaboration features.
            </p>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
              Coming Soon
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
