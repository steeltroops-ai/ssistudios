"use client";

import { motion } from "framer-motion";
import { PageBackground } from "@/components/shared/ThemeBackground";

// New Dashboard Components
import DashboardHero from "@/components/dashboard/DashboardHero";
import MetricsCards from "@/components/dashboard/MetricsCards";
import RecentProjects from "@/components/dashboard/RecentProjects";
import TemplateCategories from "@/components/dashboard/TemplateCategories";
import ToolsAssets from "@/components/dashboard/ToolsAssets";
import DashboardHeader from "@/app/(dashboard)/dashboard/Header";

// Legacy Components (keeping Footer and UsernameHeader)
import Footer from "./Footer";

export default function DashboardClient() {
  return (
    <PageBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full min-h-screen transition-all duration-300 text-gray-900"
      >
        {/* Header*/}
        <DashboardHeader />
        {/* Modern Dashboard Layout */}
        <div className="w-full px-6 py-8 space-y-8">
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
    </PageBackground>
  );
}
