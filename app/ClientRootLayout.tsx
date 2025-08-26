"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { AuthProvider, useAuth } from "@/lib/contexts/AuthContext";
import {
  ThemeProvider,
  useTheme,
  CherryBlossomBackground,
} from "@/lib/contexts/ThemeContext";
import { NavigationProvider } from "@/lib/contexts/NavigationContext";
import MainContainer from "@/components/shared/MainContainer";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";

// --- Animated Hamburger Icon ---
type MotionLineProps = React.ComponentPropsWithoutRef<"line"> & {
  variants?: any;
  [key: string]: any;
};
const MotionLine = motion.line as React.FC<MotionLineProps>;

const AnimatedHamburgerIcon = ({
  isOpen,
  size = 20,
  strokeWidth = 2,
  className = "",
}: {
  isOpen: boolean;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) => {
  const commonLineAttributes = {
    vectorEffect: "non-scaling-stroke" as const,
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={isOpen ? "open" : "closed"}
      initial={false}
      variants={{ open: {}, closed: {} }}
    >
      <MotionLine
        x1="4"
        y1="6"
        x2="20"
        y2="6"
        variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 6 } }}
        {...commonLineAttributes}
      />
      <MotionLine
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
        {...commonLineAttributes}
      />
      <MotionLine
        x1="4"
        y1="18"
        x2="20"
        y2="18"
        variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -6 } }}
        {...commonLineAttributes}
      />
    </motion.svg>
  );
};

// --- App Layout ---
function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const forceActive = pathname === "/selector" ? "Dashboard" : undefined;

  const isEditorPage = pathname.startsWith("/editor");
  const isLoginPage = pathname === "/login";

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // Optimized background classes for better performance
  const themeBg =
    theme === "light"
      ? "bg-white text-gray-900"
      : theme === "flower"
      ? "bg-gradient-to-br from-pink-50 to-white text-gray-900"
      : "bg-black text-white";

  if (isEditorPage) return <>{children}</>;

  if (!isAuthenticated && !isLoginPage) return null;

  return (
    <>
      {/* Conditionally render CherryBlossomBackground only for flower theme */}
      {theme === "flower" && <CherryBlossomBackground />}
      {!isLoginPage ? (
        <NavigationProvider>
          <div className={`relative z-10 min-h-screen ${themeBg}`}>
            {/* Sidebar - Fixed positioning for proper layout control */}
            <Sidebar
              forceActive={forceActive}
              isOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />

            {/* Mobile Overlay */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={toggleSidebar}
              />
            )}

            {/* Main Content Container - Positioned adjacent to sidebar */}
            <div className="lg:ml-20 min-h-screen flex flex-col">
              <MainContainer>{children}</MainContainer>
            </div>
          </div>
        </NavigationProvider>
      ) : (
        <main className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 bg-white">
          {children}
        </main>
      )}
    </>
  );
}

// --- Main Client Layout ---
export default function ClientRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
