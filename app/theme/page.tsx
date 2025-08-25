"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Icon SVGs ---
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" /><path d="M12 20v2" />
    <path d="M4.93 4.93l1.41 1.41" /><path d="M17.66 17.66l1.41 1.41" />
    <path d="M2 12h2" /><path d="M20 12h2" />
    <path d="M4.93 19.07l1.41-1.41" /><path d="M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21.5a9.5 9.5 0 0 1-9.5-9.5 9.5 9.5 0 0 1 9.5-9.5z" />
  </svg>
);

const FlowerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 7.5A4.5 4.5 0 0 1 7.5 12 4.5 4.5 0 0 1 12 16.5 4.5 4.5 0 0 1 16.5 12 4.5 4.5 0 0 1 12 7.5z" />
    <path d="M12 2v3" /><path d="M12 19v3" />
    <path d="M22 12h-3" /><path d="M5 12H2" />
    <path d="M19.07 4.93l-2.12 2.12" /><path d="M6.34 17.66L4.22 19.78" />
    <path d="M17.66 17.66l2.12 2.12" /><path d="M7.5 7.5l-2.12-2.12" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="M9 11l3 3.5L22 4" />
  </svg>
);

// --- Theme Context ---
type Theme = "light" | "dark" | "flower";
type ThemeContextType = { theme: Theme; setTheme: (theme: Theme) => void };

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

// --- Global Theme Provider with localStorage ---
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

// --- Full-Page Cherry Blossom Animation ---
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

// --- Theme Selection Page ---
export const ThemePage = () => {
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
      {/* Applying Overlay */}
      {applying && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div className="w-20 h-20 border-4 border-white rounded-full border-t-transparent animate-spin" />
        </motion.div>
      )}

      <div className="text-center max-w-2xl py-8">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Customize Your Experience</h1>
        <p className="text-lg text-gray-600 font-medium">
          Select a theme that best fits your style. Your choice will be applied smoothly across all pages.
        </p>
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

// --- App Wrapper ---
// Wrap your entire Next.js layout (_app.tsx or app/layout.tsx) with this to make theme global
export default function App({ children }: { children?: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen overflow-hidden bg-transparent">
        <CherryBlossomBackground />
        {children || <ThemePage />}
      </div>
    </ThemeProvider>
  );
}
