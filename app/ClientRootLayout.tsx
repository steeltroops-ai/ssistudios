// src/app/ClientRootLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";

function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
  }, [isSidebarOpen]);

  const themeBg = theme === "light"
    ? "bg-white"
    : theme === "dark"
    ? "bg-gray-900"
    : "bg-gradient-to-b from-pink-50 to-purple-100 relative overflow-hidden";

  if (pathname.startsWith("/editor")) return <>{children}</>;

  if (!isAuthenticated && pathname !== "/login") return null;

  return (
    <div className="flex relative z-10 min-h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 p-4 lg:p-8 ${themeBg}`}
      >
        {theme === "flower" && <FlowerAnimation />}
        {children}
      </main>
    </div>
  );
}

export default function ClientRootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppLayout>{children}</AppLayout>
      </ThemeProvider>
    </AuthProvider>
  );
}

// 🌸 Flower animation
const FlowerAnimation = () => {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: Math.random() * window.innerWidth }}
          animate={{ y: window.innerHeight + 50 }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute text-pink-400 text-2xl"
          style={{ left: Math.random() * window.innerWidth }}
        >
          🌸
        </motion.div>
      ))}
    </div>
  );
};
