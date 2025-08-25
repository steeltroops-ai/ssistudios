"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

// Types
export type Theme = "light" | "dark" | "flower";
export type ThemeContextType = { theme: Theme; setTheme: (theme: Theme) => void };

// Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

// Provider
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) setThemeState(savedTheme);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.className = "";
    document.documentElement.classList.add(newTheme);
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

// Cherry Blossom Background
export const CherryBlossomBackground = () => {
  const { theme } = useTheme();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (theme !== "flower") return null;

  const petals = Array.from({ length: 300 }).map((_, i) => {
    const size = Math.random() * 6 + 4;
    const startX = Math.random() * width;
    const duration = Math.random() * 6 + 6;
    const delay = Math.random() * 5;
    const rotate = Math.random() * 360;

    return (
      <motion.div
        key={i}
        className="absolute bg-pink-400 rounded-full shadow-md"
        style={{ width: size, height: size, top: -20, left: startX }}
        animate={{
          y: [0, height + 20],
          x: [startX, startX + (Math.random() * 120 - 60)],
          rotate: [0, rotate + 360],
          opacity: [0.9, 0.5, 0],
        }}
        transition={{ duration, repeat: Infinity, repeatType: "loop", ease: "linear", delay }}
      />
    );
  });

  return <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">{petals}</div>;
};
