"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

// --- Types ---
export type Theme = "light" | "dark" | "flower";
export type ThemeContextType = { theme: Theme; setTheme: (theme: Theme) => void };

// --- Context ---
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

// --- Provider ---
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("light");

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) setThemeState(savedTheme);
  }, []);

  // Apply class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.className = "";
    root.classList.add(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
      {/* Cherry Blossom petals rendered globally */}
      <CherryBlossomBackground />
    </ThemeContext.Provider>
  );
};

// --- Cherry Blossom Background ---
export const CherryBlossomBackground = () => {
  const { theme } = useTheme();
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Petals are visible on all themes
  const petalColor = theme === "dark" ? "bg-pink-300" : "bg-pink-500";

  // Light pink gradient background for flower theme
  const bgStyle =
    theme === "flower"
      ? { background: "linear-gradient(to bottom, #fff0f5, #ffe4e1)" } // soft pink gradient
      : {};

  const petals = Array.from({ length: 300 }).map((_, i) => {
    const petalSize = Math.random() * 6 + 4;
    const startX = Math.random() * size.width;
    const duration = Math.random() * 6 + 6;
    const delay = Math.random() * 5;
    const rotate = Math.random() * 360;

    return (
      <motion.div
        key={i}
        className={`absolute ${petalColor} rounded-full shadow-md`}
        style={{ width: petalSize, height: petalSize, top: -20, left: startX }}
        animate={{
          y: [0, size.height + 20],
          x: [startX, startX + (Math.random() * 120 - 60)],
          rotate: [0, rotate + 360],
          opacity: [0.9, 0.5, 0],
        }}
        transition={{ duration, repeat: Infinity, repeatType: "loop", ease: "linear", delay }}
      />
    );
  });

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={bgStyle}
    >
      {petals}
    </div>
  );
};
