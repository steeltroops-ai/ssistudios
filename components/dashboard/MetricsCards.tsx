"use client";

import { motion } from "framer-motion";
import { 
  FolderOpen, 
  LayoutTemplate, 
  HardDrive, 
  Activity,
  TrendingUp,
  Users,
  Clock,
  Star
} from "lucide-react";
import { GlassBackground } from "@/components/shared/ThemeBackground";

interface MetricCard {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function MetricsCards() {
  const metrics: MetricCard[] = [
    {
      id: "projects",
      title: "Active Projects",
      value: "12",
      subtitle: "In progress",
      icon: <FolderOpen size={24} />,
      color: "text-blue-600",
      trend: {
        value: "+3 this week",
        isPositive: true,
      },
    },
    {
      id: "templates",
      title: "Templates Used",
      value: "45",
      subtitle: "This month",
      icon: <LayoutTemplate size={24} />,
      color: "text-green-600",
      trend: {
        value: "+12 from last month",
        isPositive: true,
      },
    },
    {
      id: "storage",
      title: "Storage Used",
      value: "2.3GB",
      subtitle: "of 10GB available",
      icon: <HardDrive size={24} />,
      color: "text-orange-600",
      trend: {
        value: "23% capacity",
        isPositive: true,
      },
    },
    {
      id: "activity",
      title: "Recent Activity",
      value: "8",
      subtitle: "Actions today",
      icon: <Activity size={24} />,
      color: "text-purple-600",
      trend: {
        value: "Very active",
        isPositive: true,
      },
    },
  ];

  const additionalStats = [
    {
      icon: <TrendingUp size={16} />,
      label: "Productivity",
      value: "+15%",
      color: "text-green-600",
    },
    {
      icon: <Users size={16} />,
      label: "Collaborations",
      value: "3",
      color: "text-blue-600",
    },
    {
      icon: <Clock size={16} />,
      label: "Avg. Session",
      value: "2.5h",
      color: "text-purple-600",
    },
    {
      icon: <Star size={16} />,
      label: "Favorites",
      value: "18",
      color: "text-yellow-600",
    },
  ];

  return (
    <section className="mb-12">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="group cursor-pointer"
          >
            <GlassBackground className="p-6 h-full transition-all duration-300 group-hover:shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gray-100/50 ${metric.color} transition-transform duration-300 group-hover:scale-110`}>
                  {metric.icon}
                </div>
                {metric.trend && (
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    metric.trend.isPositive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {metric.trend.value}
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-gray-700">
                  {metric.value}
                </h3>
                <p className="text-sm font-medium text-gray-700">
                  {metric.title}
                </p>
                <p className="text-xs text-gray-500">
                  {metric.subtitle}
                </p>
              </div>
            </GlassBackground>
          </motion.div>
        ))}
      </div>

      {/* Additional Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <GlassBackground className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {additionalStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 group cursor-pointer hover:bg-white/20 rounded-lg p-2 transition-all duration-300"
              >
                <div className={`${stat.color} transition-transform duration-300 group-hover:scale-110`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassBackground>
      </motion.div>
    </section>
  );
}
