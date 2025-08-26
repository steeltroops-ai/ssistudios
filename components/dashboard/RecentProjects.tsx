"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Edit3, 
  Copy, 
  MoreHorizontal,
  Clock,
  FileText,
  Image as ImageIcon,
  Award
} from "lucide-react";
import { CardBackground, GlassBackground } from "@/components/shared/ThemeBackground";
import { useNavigation } from "@/lib/contexts/NavigationContext";

interface Project {
  id: string;
  title: string;
  type: "poster" | "card" | "certificate" | "logo";
  thumbnail: string;
  lastModified: string;
  status: "draft" | "completed" | "in-progress";
  size: string;
}

const getTypeIcon = (type: Project['type']) => {
  switch (type) {
    case 'poster':
      return <ImageIcon size={16} />;
    case 'card':
      return <FileText size={16} />;
    case 'certificate':
      return <Award size={16} />;
    case 'logo':
      return <Edit3 size={16} />;
    default:
      return <FileText size={16} />;
  }
};

const getTypeColor = (type: Project['type']) => {
  switch (type) {
    case 'poster':
      return 'bg-blue-100 text-blue-700';
    case 'card':
      return 'bg-green-100 text-green-700';
    case 'certificate':
      return 'bg-purple-100 text-purple-700';
    case 'logo':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-700';
    case 'draft':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export default function RecentProjects() {
  const { navigateTo } = useNavigation();

  // Mock recent projects data
  const recentProjects: Project[] = [
    {
      id: "1",
      title: "Corporate Event Poster",
      type: "poster",
      thumbnail: "https://placehold.co/300x400/3B82F6/FFFFFF?text=Poster",
      lastModified: "2 hours ago",
      status: "in-progress",
      size: "1920x1080",
    },
    {
      id: "2",
      title: "Business Card Design",
      type: "card",
      thumbnail: "https://placehold.co/300x200/10B981/FFFFFF?text=Card",
      lastModified: "1 day ago",
      status: "completed",
      size: "3.5x2 in",
    },
    {
      id: "3",
      title: "Achievement Certificate",
      type: "certificate",
      thumbnail: "https://placehold.co/400x300/8B5CF6/FFFFFF?text=Certificate",
      lastModified: "3 days ago",
      status: "completed",
      size: "A4",
    },
    {
      id: "4",
      title: "Brand Logo Concept",
      type: "logo",
      thumbnail: "https://placehold.co/300x300/F59E0B/FFFFFF?text=Logo",
      lastModified: "1 week ago",
      status: "draft",
      size: "512x512",
    },
  ];

  return (
    <section className="mb-12">
      <CardBackground className="p-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Projects</h2>
            <p className="text-gray-600">Continue working on your latest designs</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateTo("templates")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </motion.button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="group cursor-pointer"
            >
              <GlassBackground className="p-4 transition-all duration-300 group-hover:shadow-xl">
                {/* Project Thumbnail */}
                <div className="relative mb-4 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors duration-200">
                        <Edit3 size={16} />
                      </button>
                      <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors duration-200">
                        <Copy size={16} />
                      </button>
                      <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors duration-200">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status.replace('-', ' ')}
                  </div>
                </div>

                {/* Project Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(project.type)}`}>
                        {getTypeIcon(project.type)}
                        {project.type}
                      </span>
                      <span className="text-xs text-gray-500">{project.size}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>{project.lastModified}</span>
                  </div>
                </div>
              </GlassBackground>
            </motion.div>
          ))}
        </div>

        {/* Empty State (if no projects) */}
        {recentProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent projects</h3>
            <p className="text-gray-600 mb-6">Start creating your first design project</p>
            <button
              onClick={() => navigateTo("poster-editor")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Create New Project
            </button>
          </motion.div>
        )}
      </CardBackground>
    </section>
  );
}
