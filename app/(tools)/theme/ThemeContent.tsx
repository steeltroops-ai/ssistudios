"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme, Theme } from "@/lib/contexts/ThemeContext";
import { PageBackground } from "@/components/shared/ThemeBackground";

// Icon components
const SunIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-500">
    <circle cx="50" cy="50" r="20" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <line x1="50" y1="10" x2="50" y2="20" />
      <line x1="50" y1="80" x2="50" y2="90" />
      <line x1="10" y1="50" x2="20" y2="50" />
      <line x1="80" y1="50" x2="90" y2="50" />
      <line x1="21.21" y1="21.21" x2="28.28" y2="28.28" />
      <line x1="71.72" y1="71.72" x2="78.79" y2="78.79" />
      <line x1="21.21" y1="78.79" x2="28.28" y2="71.72" />
      <line x1="71.72" y1="28.28" x2="78.79" y2="21.21" />
    </g>
  </svg>
);

const FlowerIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-pink-500">
    <g fill="currentColor">
      <ellipse cx="50" cy="30" rx="8" ry="15" />
      <ellipse cx="50" cy="70" rx="8" ry="15" />
      <ellipse cx="30" cy="50" rx="15" ry="8" />
      <ellipse cx="70" cy="50" rx="15" ry="8" />
      <ellipse cx="35" cy="35" rx="10" ry="12" transform="rotate(-45 35 35)" />
      <ellipse cx="65" cy="35" rx="10" ry="12" transform="rotate(45 65 35)" />
      <ellipse cx="35" cy="65" rx="10" ry="12" transform="rotate(45 35 65)" />
      <ellipse cx="65" cy="65" rx="10" ry="12" transform="rotate(-45 65 65)" />
      <circle cx="50" cy="50" r="8" fill="#fbbf24" />
    </g>
  </svg>
);

export default function ThemeContent() {
  const { theme, setTheme } = useTheme();
  const [applying, setApplying] = useState(false);

  // Only light and flower themes
  const themes = [
    {
      name: "light",
      label: "Sunrise",
      icon: <SunIcon />,
      bgColor: "bg-white",
      textColor: "text-gray-800",
    },
    {
      name: "flower",
      label: "Blossom",
      icon: <FlowerIcon />,
      bgColor: "bg-pink-100",
      textColor: "text-gray-900",
    },
  ];

  const applyTheme = (newTheme: Theme) => {
    if (theme === newTheme) return;
    setApplying(true);
    setTheme(newTheme);
    setTimeout(() => setApplying(false), 500);
  };

  return (
    <PageBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center p-8 max-w-full overflow-hidden"
        style={{ paddingTop: "2rem" }}
      >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Choose Your Theme
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Select a theme that matches your style and enhances your creative
          workflow.
        </p>
      </motion.div>

      {/* Theme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl py-12">
        {themes.map((t, index) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={`relative flex flex-col items-center justify-center p-8 rounded-3xl shadow-2xl cursor-pointer transition-all duration-300
              ${
                theme === t.name
                  ? "ring-4 ring-blue-500 ring-offset-4 ring-offset-white scale-105"
                  : "hover:scale-105"
              }
              ${t.bgColor} ${t.textColor}`}
            onClick={() => applyTheme(t.name as Theme)}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center justify-center w-28 h-28 mb-4">
              {t.icon}
            </div>
            <h2 className="text-2xl font-bold mb-1">{t.label}</h2>
            <p className="text-sm font-medium opacity-70">
              {theme === t.name ? "Currently Active" : "Click to Apply"}
            </p>

            {/* Active indicator */}
            {theme === t.name && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Applying indicator */}
      {applying && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-800 font-medium">Applying theme...</span>
          </div>
        </motion.div>
      )}
      </motion.div>
    </PageBackground>
  );
}
