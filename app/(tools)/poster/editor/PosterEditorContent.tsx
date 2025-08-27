"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageBackground } from "@/components/shared/ThemeBackground";
import { EditorHeader } from "@/components/poster-editor/header/EditorHeader";
import { ResponsiveEditorLayout } from "@/components/poster-editor/layout/ResponsiveEditorLayout";

export default function PosterEditorContent() {
  const [selectedTool, setSelectedTool] = useState("select");

  return (
    <PageBackground className="h-screen overflow-hidden">
      {/* Full-Screen Layout - No Scrollbars */}
      <div className="flex flex-col h-full">
        {/* Apple-Inspired Header - Full Width */}
        <EditorHeader />

        {/* Main Editor Content - Dynamic Height */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="flex-1 px-4 sm:px-6 pb-4 sm:pb-6 min-h-0 overflow-hidden"
        >
          <ResponsiveEditorLayout
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
          />
        </motion.div>
      </div>
    </PageBackground>
  );
}
