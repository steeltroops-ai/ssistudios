"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";

interface NotificationCenterProps {
  count: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Template Updated",
    message: "Your poster template has been successfully updated",
    time: "2 min ago",
    type: "success",
    read: false,
  },
  {
    id: "2",
    title: "New Feature Available",
    message: "Check out the new AI-powered design suggestions",
    time: "1 hour ago",
    type: "info",
    read: false,
  },
  {
    id: "3",
    title: "Export Complete",
    message: "Your poster has been exported successfully",
    time: "3 hours ago",
    type: "success",
    read: true,
  },
];

export default function NotificationCenter({ count }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        aria-label="Notifications"
      >
        <Bell size={18} />

        {/* Notification Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 rounded-full flex items-center justify-center text-xs font-medium text-white"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Notification Dropdown */}
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
              className="absolute top-full right-0 mt-2 w-80 bg-neutral-50/95 backdrop-blur-md border border-neutral-200 rounded-lg shadow-xl z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <h3 className="text-neutral-900 font-medium">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-neutral-600 hover:text-neutral-800 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-white/60">
                    No notifications
                  </div>
                ) : (
                  <div className="p-2">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${
                          notification.read
                            ? "bg-white/5 hover:bg-white/10"
                            : "bg-white/10 hover:bg-white/15"
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4
                                className={`text-sm font-medium ${
                                  notification.read
                                    ? "text-white/80"
                                    : "text-white"
                                }`}
                              >
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p
                              className={`text-xs mt-1 ${
                                notification.read
                                  ? "text-white/60"
                                  : "text-white/80"
                              }`}
                            >
                              {notification.message}
                            </p>
                            <p className="text-xs text-white/50 mt-1">
                              {notification.time}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="ml-2 p-1 text-white/40 hover:text-white/60 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
