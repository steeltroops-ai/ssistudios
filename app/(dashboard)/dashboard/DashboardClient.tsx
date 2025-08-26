"use client";

import { motion } from "framer-motion";

// New Dashboard Components
import DashboardHero from "@/components/dashboard/DashboardHero";
import MetricsCards from "@/components/dashboard/MetricsCards";
import RecentProjects from "@/components/dashboard/RecentProjects";
import TemplateCategories from "@/components/dashboard/TemplateCategories";
import ToolsAssets from "@/components/dashboard/ToolsAssets";
import DashboardHeader from "@/app/(dashboard)/dashboard/Header";

// Legacy Components
import Footer from "./Footer";

export default function DashboardClient() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 min-h-screen text-gray-900"
    >
      <DashboardHeader />

      {/* Full-width Dashboard Layout */}
      <div className="px-6 py-8 space-y-8">
        {/* Hero Section */}
        <DashboardHero />

        {/* Metrics Cards */}
        <MetricsCards />

        {/* Recent Projects */}
        <RecentProjects />

        {/* Template Categories */}
        <TemplateCategories />

        {/* Tools & Assets */}
        <ToolsAssets />
      </div>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
}
