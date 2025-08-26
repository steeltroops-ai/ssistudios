"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import {
  Home,
  FileText,
  Layers,
  Palette,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Layout,
  Edit3,
  Image,
  CreditCard,
  FolderOpen,
} from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";

// --- Menu Data ---
type MenuItem = {
  name: string;
  icon: React.ElementType;
  path?: string;
  children?: { name: string; path?: string }[];
  onClick?: () => void;
  mobileOnly?: boolean;
};

// Streamlined navigation following Linear/Notion patterns
const menu: MenuItem[] = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
  { name: "Templates", icon: FileText, path: "/templates" },
  {
    name: "Design Tools",
    icon: Layout,
    children: [
      {
        name: "Poster Editor",
        path: "/poster/editor",
      },
      { name: "Logo Gallery", path: "/logo" },
    ],
  },
  {
    name: "Editor Tools",
    icon: Edit3,
    children: [
      { name: "Canvas Tools", path: "/tools/canvas" },
      { name: "Text Editor", path: "/tools/text" },
    ],
  },
  {
    name: "Content",
    icon: Layers,
    children: [
      { name: "Posters", path: "/content/posters" },
      { name: "Cards", path: "/content/cards" },
    ],
  },
  {
    name: "Assets",
    icon: FolderOpen,
    children: [
      { name: "Media Library", path: "/assets/media" },
      { name: "Fonts", path: "/assets/fonts" },
    ],
  },
  {
    name: "Settings",
    icon: Settings,
    children: [
      { name: "Theme", path: "/theme" },
      { name: "Profile", path: "/userprofile" },
    ],
  },
];

// --- Sidebar Component ---
type SidebarProps = {
  forceActive?: string;
  isOpen: boolean;
  toggleSidebar: () => void;
};

export default function Sidebar({
  forceActive,
  isOpen,
  toggleSidebar,
}: SidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  useEffect(() => {
    // Automatically expand the parent of the active page
    const expandedParents = menu
      .filter(
        (item) =>
          item.children &&
          item.children.some(
            (child) => child.path && pathname.startsWith(child.path)
          )
      )
      .map((item) => item.name);
    setExpanded(expandedParents);
  }, [pathname]);

  const toggle = (name: string) =>
    setExpanded((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );

  // Close all dropdowns when sidebar collapses
  useEffect(() => {
    if (!isOpen && !isHovered) {
      setExpanded([]);
    }
  }, [isOpen, isHovered]);

  const isParentActive = (item: MenuItem) => {
    if (forceActive) return item.name === forceActive;
    if (item.path && pathname.startsWith(item.path)) return true;
    if (item.children)
      return item.children.some((c) => c.path && pathname.startsWith(c.path));
    return false;
  };

  const isChildActive = (path?: string) => path && pathname.startsWith(path);

  const handleLogout = () => logout();

  // Keyboard navigation handler
  const handleKeyDown = (
    event: React.KeyboardEvent,
    item: MenuItem,
    index: number
  ) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (item.name === "Logout") {
          handleLogout();
        } else if (item.children) {
          toggle(item.name);
        } else if (item.path && item.path !== pathname) {
          router.push(item.path);
          if (isOpen) toggleSidebar();
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % menu.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + menu.length) % menu.length);
        break;
      case "Escape":
        if (isOpen) {
          toggleSidebar();
        }
        break;
    }
  };

  const renderSidebarContent = (
    isMobile: boolean,
    isDesktopHovered = false
  ) => (
    <aside
      className={`h-screen glass-sidebar text-white flex flex-col font-nunito border-r border-white/10 shadow-2xl sidebar-expand relative
        ${isMobile ? "w-[85%] max-w-sm" : isDesktopHovered ? "w-64" : "w-20"}
      `}
    >
      <div className="p-4 h-16 border-b border-white/10 flex items-center justify-center overflow-hidden relative">
        {/* Full Logo - Visible when expanded */}
        <div
          className={`transition-opacity duration-300 ${
            isMobile || isDesktopHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Logo />
        </div>

        {/* Collapsed Logo - Visible when collapsed with glow effect */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 group cursor-pointer ${
            !isMobile && !isDesktopHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative">
            <div className="text-2xl font-bold text-white/90 transition-all duration-300 group-hover:text-white group-hover:scale-110 select-none">
              SSI
            </div>
            {/* Glow effect matching sidebar buttons */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-pulse rounded-lg" />
              <div
                className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-transparent to-cyan-400/20 animate-pulse rounded-lg"
                style={{ animationDelay: "0.5s" }}
              />
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 overflow-y-auto scrollbar-hidden hover:scrollbar-visible">
        {menu.map((item, index) => {
          if (item.mobileOnly && !isMobile) return null;

          const Icon = item.icon;
          const isOpenMenuItem = expanded.includes(item.name);
          const active = isParentActive(item);
          const isFocused = focusedIndex === index;

          return (
            <div key={item.name} className="mb-2">
              <button
                id={`menu-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => {
                  if (item.name === "Logout") {
                    handleLogout();
                    return;
                  }
                  if (item.children) {
                    toggle(item.name);
                  } else if (item.path && item.path !== pathname) {
                    router.push(item.path);
                    if (isOpen) toggleSidebar();
                  }
                }}
                className={`group flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all duration-200 relative z-10 menu-item-physics
                  ${
                    active
                      ? "text-white font-medium menu-item-active"
                      : "text-gray-300 hover:text-white menu-item-glass"
                  }
                  ${
                    item.name === "Logout"
                      ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      : "hover:bg-white/5 cursor-pointer"
                  }
                  ${
                    isFocused
                      ? "ring-2 ring-white/30 ring-offset-2 ring-offset-transparent"
                      : ""
                  }
                `}
                type="button"
                aria-expanded={item.children ? isOpenMenuItem : undefined}
                aria-haspopup={item.children ? "true" : undefined}
                aria-label={item.children ? `${item.name} menu` : item.name}
                onKeyDown={(e) => handleKeyDown(e, item, index)}
                tabIndex={0}
              >
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full transition-all duration-300 ${
                    active ? "opacity-100 active-indicator" : "opacity-0"
                  }`}
                />
                <div className="flex items-center gap-3 overflow-hidden">
                  <Icon
                    size={18}
                    className={`transition-colors flex-shrink-0 ${
                      active
                        ? "text-white icon-float"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  />
                  <span
                    className={`text-sm whitespace-nowrap transition-opacity duration-200 ${
                      isMobile || isDesktopHovered ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
                {item.children &&
                  (isMobile || isDesktopHovered ? (
                    isOpenMenuItem ? (
                      <ChevronDown
                        size={16}
                        className="text-gray-500 group-hover:text-gray-300 transition-transform duration-200 flex-shrink-0 rotate-180"
                      />
                    ) : (
                      <ChevronRight
                        size={16}
                        className="text-gray-500 group-hover:text-gray-300 transition-transform duration-200 flex-shrink-0"
                      />
                    )
                  ) : null)}
              </button>

              {item.children && (
                <motion.div
                  initial={false}
                  animate={{
                    height: isOpenMenuItem ? "auto" : 0,
                    opacity: isOpenMenuItem ? 1 : 0,
                    marginTop: isOpenMenuItem ? 8 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    mass: 0.8,
                    duration: 0.25,
                  }}
                  className="ml-4 border-l border-white/20 pl-3 overflow-hidden"
                  role="region"
                  aria-labelledby={`menu-${item.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {item.children.map((child, childIndex) => {
                    const childIsActive = isChildActive(child.path);
                    return (
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                          opacity: isOpenMenuItem ? 1 : 0,
                          x: isOpenMenuItem ? 0 : -10,
                        }}
                        transition={{
                          delay: isOpenMenuItem ? childIndex * 0.05 : 0,
                          duration: 0.2,
                          ease: "easeOut",
                        }}
                        key={child.path}
                        onClick={() => {
                          if (child.path && child.path !== pathname) {
                            router.push(child.path);
                            if (isOpen) toggleSidebar();
                          }
                        }}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 mb-1
                          ${
                            childIsActive
                              ? "text-white font-medium menu-item-active"
                              : "text-gray-300 hover:text-white menu-item-glass"
                          }
                          hover:bg-white/5 active:scale-[0.98] cursor-pointer
                        `}
                        type="button"
                      >
                        {child.name}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Enhanced Footer - Desktop */}
      <div
        className={`p-4 border-t border-white/10 w-full mt-auto hidden lg:block transition-all duration-300 ${
          isDesktopHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-gray-400 text-xs text-center select-none mb-3 font-medium">
          SSI STUDIOS v.1.08.25
        </div>
        <button
          onClick={handleLogout}
          className="relative flex items-center justify-center gap-2 text-sm text-white/90 hover:text-white transition-all duration-200 w-full py-2.5 rounded-lg cursor-pointer group overflow-hidden menu-item-glass"
          type="button"
          aria-label="Sign out of your account"
        >
          <div className="relative z-10 flex items-center gap-2">
            <LogOut size={16} />
            <span className="font-medium">Sign Out</span>
          </div>
          {/* Red/Orange gradient glow effect for logout */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/30 to-transparent animate-pulse rounded-lg" />
            <div
              className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-transparent to-red-500/20 animate-pulse rounded-lg"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        </button>
      </div>

      {/* Enhanced Footer - Mobile */}
      {isMobile && (
        <div className="p-4 border-t border-white/10 w-full mt-auto">
          <div className="text-gray-400 text-xs text-center select-none mb-3 font-medium">
            SSI STUDIOS v.1.08.25
          </div>
          <button
            onClick={() => {
              handleLogout();
              toggleSidebar();
            }}
            className="relative flex items-center justify-center gap-2 text-sm text-white/90 hover:text-white transition-all duration-200 w-full py-2.5 rounded-lg cursor-pointer group overflow-hidden menu-item-glass"
            type="button"
            aria-label="Sign out of your account"
          >
            <div className="relative z-10 flex items-center gap-2">
              <LogOut size={16} />
              <span className="font-medium">Sign Out</span>
            </div>
            {/* Red/Orange gradient glow effect for logout */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/30 to-transparent animate-pulse rounded-lg" />
              <div
                className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-transparent to-red-500/20 animate-pulse rounded-lg"
                style={{ animationDelay: "0.5s" }}
              />
            </div>
          </button>
        </div>
      )}
    </aside>
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Desktop Sidebar */}
      <div
        className="hidden lg:block fixed top-0 left-0 h-screen z-30"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {renderSidebarContent(false, isHovered)}
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
            aria-hidden={!isOpen}
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={toggleSidebar}
              aria-label="Close sidebar overlay"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 250, damping: 35 }}
              className="relative w-[85%] max-w-sm h-full"
            >
              {renderSidebarContent(true)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .font-nunito {
          font-family: 'Nunito', sans-serif;
        }
        .shadow-glow {
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
        }

        /* Custom scrollbar styles for invisible scrollbars */
        .scrollbar-hidden {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }

        .scrollbar-hidden::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }

        /* Show scrollbar on hover for better UX */
        .hover\\:scrollbar-visible:hover {
          scrollbar-width: thin; /* Firefox */
          -ms-overflow-style: auto; /* IE and Edge */
        }

        .hover\\:scrollbar-visible:hover::-webkit-scrollbar {
          display: block;
          width: 4px;
        }

        .hover\\:scrollbar-visible:hover::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }

        .hover\\:scrollbar-visible:hover::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          transition: background-color 0.2s ease;
        }

        .hover\\:scrollbar-visible:hover::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Smooth scrolling behavior */
        .scrollbar-hidden {
          scroll-behavior: smooth;
        }

        /* Advanced Glassmorphism Sidebar */
        .glass-sidebar {
          background: linear-gradient(
            135deg,
            oklch(0.12 0.02 240) 0%,
            oklch(0.10 0.03 240) 50%,
            oklch(0.08 0.02 240) 100%
          );
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-right: 1px solid oklch(0.2 0.01 240 / 0.3);
          box-shadow:
            0 8px 32px oklch(0.05 0.02 240 / 0.4),
            inset 0 1px 0 oklch(0.9 0.02 240 / 0.1);
          position: relative;
          overflow: hidden;
        }

        .glass-sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            oklch(0.9 0.02 240 / 0.05) 0%,
            transparent 50%,
            oklch(0.9 0.02 240 / 0.02) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* Enhanced menu item styles with OKLCH */
        .menu-item-glass {
          background: oklch(0.15 0.02 240 / 0.3);
          backdrop-filter: blur(8px);
          border: 1px solid oklch(0.9 0.02 240 / 0.1);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .menu-item-glass:hover {
          background: oklch(0.18 0.03 240 / 0.4);
          border-color: oklch(0.9 0.02 240 / 0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px oklch(0.05 0.02 240 / 0.3);
        }

        .menu-item-active {
          background: oklch(0.2 0.04 240 / 0.5);
          border-color: oklch(0.9 0.02 240 / 0.3);
          color: oklch(0.95 0.02 240);
          box-shadow:
            0 4px 12px oklch(0.05 0.02 240 / 0.4),
            inset 0 1px 0 oklch(0.9 0.02 240 / 0.2);
        }

        /* Active indicator with glow */
        .active-indicator {
          background: linear-gradient(
            180deg,
            oklch(0.9 0.02 240) 0%,
            oklch(0.8 0.04 240) 100%
          );
          box-shadow:
            0 0 8px oklch(0.9 0.02 240 / 0.6),
            0 0 16px oklch(0.9 0.02 240 / 0.3);
        }

        /* Physics-based micro-interactions */
        .menu-item-physics {
          transform-origin: center;
          will-change: transform;
        }

        .menu-item-physics:hover {
          animation: menuItemHover 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .menu-item-physics:active {
          animation: menuItemPress 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes menuItemHover {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-1px) scale(1.02); }
          100% { transform: translateY(-1px) scale(1.01); }
        }

        @keyframes menuItemPress {
          0% { transform: translateY(-1px) scale(1.01); }
          50% { transform: translateY(0) scale(0.98); }
          100% { transform: translateY(0) scale(1); }
        }

        /* Floating animation for icons */
        .icon-float {
          animation: iconFloat 3s ease-in-out infinite;
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }

        /* Smooth expand animation */
        .sidebar-expand {
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .menu-item-physics:hover,
          .menu-item-physics:active,
          .icon-float,
          .sidebar-expand {
            animation: none;
            transition: none;
          }
        }

        /* Focus styles for accessibility */
        .menu-item-focus {
          outline: 2px solid oklch(0.9 0.02 240);
          outline-offset: 2px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .glass-sidebar {
            background: #000;
            border-color: #fff;
          }

          .menu-item-glass {
            background: #111;
            border-color: #fff;
          }

          .menu-item-active {
            background: #333;
            color: #fff;
          }
        }
      `}</style>
    </>
  );
}
