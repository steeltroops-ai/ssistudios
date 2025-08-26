"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useNavigation } from "@/lib/contexts/NavigationContext";

interface UserMenuProps {
  user: any;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const { navigateTo } = useNavigation();

  const handleProfileClick = () => {
    navigateTo("userprofile");
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    navigateTo("theme");
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        aria-label="User menu"
      >
        <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
          <User size={16} className="text-neutral-600" />
        </div>
        <span className="text-sm font-medium hidden sm:block">
          {user?.username || "User"}
        </span>
      </button>

      {/* User Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                duration: 0.2,
              }}
              className="absolute top-full right-0 mt-2 w-56 bg-neutral-50/95 backdrop-blur-md border border-neutral-200 rounded-lg shadow-xl z-50"
            >
              {/* User Info */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">
                      {user?.username || "User"}
                    </div>
                    <div className="text-white/60 text-xs">
                      {user?.email || "user@ssistudios.com"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 text-left"
                >
                  <UserCircle size={16} />
                  <span className="text-sm">Profile</span>
                </button>

                <button
                  onClick={handleSettingsClick}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 text-left"
                >
                  <Settings size={16} />
                  <span className="text-sm">Settings</span>
                </button>

                <div className="border-t border-white/10 my-2" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 text-left"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
