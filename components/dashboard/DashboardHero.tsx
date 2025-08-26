"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Upload,
  LayoutGrid,
  Palette,
  FileText,
  Settings,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useNavigation } from "@/lib/contexts/NavigationContext";
import { CardBackground } from "@/components/shared/ThemeBackground";

// Helper to capitalize the first letter
function capitalizeFirstLetter(name: string): string {
  if (!name) return "Guest";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  action: () => void;
}

export default function DashboardHero() {
  const { user } = useAuth();
  const { navigateTo } = useNavigation();
  const displayName = capitalizeFirstLetter(user?.username || "Guest");

  const quickActions: QuickAction[] = [
    {
      id: "create-poster",
      label: "Create Poster",
      icon: <Plus size={20} />,
      color: "bg-blue-500/20 border-blue-400/40 text-blue-700",
      hoverColor: "hover:bg-blue-500/30 hover:border-blue-400/60",
      action: () => navigateTo("poster-editor"),
    },
    {
      id: "generate-card",
      label: "Generate Card",
      icon: <FileText size={20} />,
      color: "bg-green-500/20 border-green-400/40 text-green-700",
      hoverColor: "hover:bg-green-500/30 hover:border-green-400/60",
      action: () => navigateTo("cards"),
    },
    {
      id: "manage-templates",
      label: "Browse Templates",
      icon: <LayoutGrid size={20} />,
      color: "bg-purple-500/20 border-purple-400/40 text-purple-700",
      hoverColor: "hover:bg-purple-500/30 hover:border-purple-400/60",
      action: () => navigateTo("templates"),
    },
    {
      id: "upload-asset",
      label: "Upload Asset",
      icon: <Upload size={20} />,
      color: "bg-orange-500/20 border-orange-400/40 text-orange-700",
      hoverColor: "hover:bg-orange-500/30 hover:border-orange-400/60",
      action: () => navigateTo("poster-editor"),
    },
    {
      id: "design-tools",
      label: "Design Tools",
      icon: <Palette size={20} />,
      color: "bg-teal-500/20 border-teal-400/40 text-teal-700",
      hoverColor: "hover:bg-teal-500/30 hover:border-teal-400/60",
      action: () => navigateTo("logo"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
      color: "bg-gray-500/20 border-gray-400/40 text-gray-700",
      hoverColor: "hover:bg-gray-500/30 hover:border-gray-400/60",
      action: () => navigateTo("theme"),
    },
  ];

  return (
    <section className="mb-12">
      <CardBackground className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Welcome back,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-indigo-700">
                {displayName}
              </span>
            </motion.h1>

            <motion.p
              className="text-lg text-gray-600 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Ready to create something amazing? Choose from our professional
              tools and templates.
            </motion.p>

            <motion.div
              className="flex items-center gap-4 text-sm text-gray-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>All systems operational</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <span>Last login: Today</span>
            </motion.div>
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className={`
                  flex flex-col items-center justify-center p-4 rounded-xl border-2 
                  transition-all duration-300 group cursor-pointer
                  ${action.color} ${action.hoverColor}
                  hover:shadow-lg active:scale-[0.98]
                `}
              >
                <div className="mb-2 transition-transform duration-300 group-hover:scale-110">
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-center leading-tight">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </CardBackground>
    </section>
  );
}
