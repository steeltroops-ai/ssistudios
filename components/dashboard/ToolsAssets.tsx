"use client";

import { motion } from "framer-motion";
import { 
  FolderOpen, 
  Type, 
  Palette, 
  Upload,
  Image as ImageIcon,
  Layers,
  Zap,
  ArrowRight,
  HardDrive,
  Clock
} from "lucide-react";
import { CardBackground, GlassBackground } from "@/components/shared/ThemeBackground";
import { useNavigation } from "@/lib/contexts/NavigationContext";

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  stats: {
    label: string;
    value: string;
  };
  route: string;
  isNew?: boolean;
}

export default function ToolsAssets() {
  const { navigateTo } = useNavigation();

  const tools: Tool[] = [
    {
      id: "media-library",
      title: "Media Library",
      description: "Manage your images, videos, and design assets",
      icon: <ImageIcon size={24} />,
      color: "text-blue-600",
      gradient: "from-blue-500 to-blue-600",
      stats: {
        label: "Files",
        value: "247",
      },
      route: "media",
    },
    {
      id: "font-collection",
      title: "Font Collection",
      description: "Professional typography for your designs",
      icon: <Type size={24} />,
      color: "text-green-600",
      gradient: "from-green-500 to-green-600",
      stats: {
        label: "Fonts",
        value: "156",
      },
      route: "fonts",
    },
    {
      id: "brand-assets",
      title: "Brand Assets",
      description: "Logos, colors, and brand identity elements",
      icon: <Palette size={24} />,
      color: "text-purple-600",
      gradient: "from-purple-500 to-purple-600",
      stats: {
        label: "Assets",
        value: "89",
      },
      route: "brand",
    },
    {
      id: "ai-tools",
      title: "AI Creative Tools",
      description: "Intelligent design assistance and automation",
      icon: <Zap size={24} />,
      color: "text-orange-600",
      gradient: "from-orange-500 to-orange-600",
      stats: {
        label: "Tools",
        value: "12",
      },
      route: "ai-tools",
      isNew: true,
    },
    {
      id: "layer-manager",
      title: "Layer Manager",
      description: "Organize and manage design layers efficiently",
      icon: <Layers size={24} />,
      color: "text-teal-600",
      gradient: "from-teal-500 to-teal-600",
      stats: {
        label: "Projects",
        value: "34",
      },
      route: "layers",
    },
    {
      id: "upload-center",
      title: "Upload Center",
      description: "Import and organize your design materials",
      icon: <Upload size={24} />,
      color: "text-indigo-600",
      gradient: "from-indigo-500 to-indigo-600",
      stats: {
        label: "Recent",
        value: "18",
      },
      route: "upload",
    },
  ];

  const quickStats = [
    {
      icon: <HardDrive size={16} />,
      label: "Storage Used",
      value: "2.3GB / 10GB",
      percentage: 23,
      color: "text-blue-600",
    },
    {
      icon: <Clock size={16} />,
      label: "Last Backup",
      value: "2 hours ago",
      color: "text-green-600",
    },
    {
      icon: <FolderOpen size={16} />,
      label: "Active Projects",
      value: "12 projects",
      color: "text-purple-600",
    },
  ];

  return (
    <section className="mb-12">
      <CardBackground className="p-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tools & Assets</h2>
            <p className="text-gray-600">Manage your creative resources and tools</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <GlassBackground className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className={`${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">
                      {stat.label}
                    </p>
                    {stat.percentage && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${stat.percentage}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassBackground>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              onClick={() => navigateTo(tool.route)}
              className="group cursor-pointer"
            >
              <GlassBackground className="p-6 h-full transition-all duration-300 group-hover:shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${tool.gradient} text-white transition-transform duration-300 group-hover:scale-110`}>
                    {tool.icon}
                  </div>
                  <div className="flex items-center gap-2">
                    {tool.isNew && (
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                    <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {tool.stats.label}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {tool.stats.value}
                    </span>
                  </div>
                </div>
              </GlassBackground>
            </motion.div>
          ))}
        </div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8"
        >
          <GlassBackground className="p-8 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-300 group cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <Upload size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quick Upload
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop files here or click to browse
              </p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
                Choose Files
              </button>
            </div>
          </GlassBackground>
        </motion.div>
      </CardBackground>
    </section>
  );
}
