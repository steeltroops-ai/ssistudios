"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LeftToolsPanel } from "../panels/LeftToolsPanel";
import { RightPropertiesPanel } from "../panels/RightPropertiesPanel";
import { PosterCanvas } from "../canvas/PosterCanvas";

interface ResponsiveEditorLayoutProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

// Apple-Inspired Responsive Editor Layout with Dynamic Panel Sizing
export const ResponsiveEditorLayout = ({
  selectedTool,
  onToolSelect,
}: ResponsiveEditorLayoutProps) => {
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  const [panelsCollapsed, setPanelsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
        setPanelsCollapsed(true);
      } else if (width < 1024) {
        setScreenSize("tablet");
        setPanelsCollapsed(false);
      } else {
        setScreenSize("desktop");
        setPanelsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dynamic panel sizing based on screen size
  const getPanelWidth = () => {
    switch (screenSize) {
      case "mobile":
        return "w-0"; // Hidden on mobile
      case "tablet":
        return "w-72"; // 288px on tablet
      case "desktop":
        return "w-72 lg:w-80"; // 288px on desktop, 320px on large screens
      default:
        return "w-72 lg:w-80";
    }
  };

  const getGapSize = () => {
    switch (screenSize) {
      case "mobile":
        return "gap-0";
      case "tablet":
        return "gap-4";
      case "desktop":
        return "gap-6";
      default:
        return "gap-6";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full overflow-hidden"
    >
      {/* Responsive Editor Layout - Fixed Panel Sizing */}
      <div className={`flex ${getGapSize()} h-full min-h-0 overflow-hidden`}>
        {/* Left Tools Panel - Responsive */}
        {!panelsCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={`${getPanelWidth()} flex-shrink-0 flex-grow-0`}
          >
            <LeftToolsPanel
              selectedTool={selectedTool}
              onToolSelect={onToolSelect}
            />
          </motion.div>
        )}

        {/* Canvas Area - Dynamic Sizing */}
        <motion.div
          layout
          transition={{
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="flex-1 min-w-0"
        >
          <PosterCanvas />
        </motion.div>

        {/* Right Properties Panel - Responsive */}
        {!panelsCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={`${getPanelWidth()} flex-shrink-0 flex-grow-0`}
          >
            <RightPropertiesPanel />
          </motion.div>
        )}
      </div>

      {/* Mobile Panel Toggle (if needed) */}
      {screenSize === "mobile" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPanelsCollapsed(!panelsCollapsed)}
            className="px-6 py-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-black/[0.08] text-gray-800 font-medium"
          >
            {panelsCollapsed ? "Show Panels" : "Hide Panels"}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};
