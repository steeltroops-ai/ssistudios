"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ThemeProvider, useTheme, CherryBlossomBackground, Theme } from "@/contexts/ThemeContext";

// Icons
const SunIcon = () => <svg>...</svg>;
const MoonIcon = () => <svg>...</svg>;
const FlowerIcon = () => <svg>...</svg>;
const CheckIcon = () => <svg>...</svg>;

const ThemePageComponent = () => {
  const { theme, setTheme } = useTheme();
  const [applying, setApplying] = useState(false);

  const themes = [
    { name: "light", label: "Light", icon: <SunIcon />, bgColor: "bg-white", textColor: "text-gray-900" },
    { name: "dark", label: "Dark", icon: <MoonIcon />, bgColor: "bg-gray-900", textColor: "text-white" },
    { name: "flower", label: "Flower", icon: <FlowerIcon />, bgColor: "bg-pink-100", textColor: "text-gray-900" },
  ];

  const applyTheme = (newTheme: Theme) => {
    if (theme === newTheme) return;
    setApplying(true);
    setTimeout(() => {
      setTheme(newTheme);
      setApplying(false);
    }, 1200);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
      {applying && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div className="w-20 h-20 border-4 border-white rounded-full border-t-transparent animate-spin" />
        </motion.div>
      )}

      <div className="text-center max-w-2xl py-8">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Customize Your Experience</h1>
        <p className="text-lg text-gray-600 font-medium">Select a theme that best fits your style.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl py-12">
        {themes.map((t) => (
          <motion.div
            key={t.name}
            className={`relative flex flex-col items-center justify-center p-8 rounded-2xl shadow-xl cursor-pointer transform hover:-translate-y-2 ${t.bgColor} ${t.textColor} border-4 border-transparent ${
              theme === t.name ? "ring-4 ring-blue-500 ring-offset-4 ring-offset-white" : ""
            }`}
            onClick={() => applyTheme(t.name as Theme)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center justify-center w-24 h-24 mb-4">{t.icon}</div>
            <h2 className="text-xl font-bold mb-1">{t.label}</h2>
            <p className="text-sm font-medium opacity-80">{theme === t.name ? "Currently Active" : "Click to Apply"}</p>
            {theme === t.name && (
              <motion.div className="absolute top-4 right-4 text-blue-500" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <CheckIcon />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// **Only export default page component**
export default function Page() {
  return (
    <ThemeProvider>
      <CherryBlossomBackground />
      <ThemePageComponent />
    </ThemeProvider>
  );
}
