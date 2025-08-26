"use client";

import { motion } from "framer-motion";
import { User, Settings, Shield, Bell } from "lucide-react";
import { PageBackground } from "@/components/shared/ThemeBackground";

export default function UserProfileContent() {
  return (
    <PageBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-8 max-w-full overflow-hidden"
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
            User Profile
          </h1>
          <p className="text-lg text-gray-600">
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Profile Cards */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Profile Information
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  defaultValue="puneet"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="puneet@ssistudios.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Account Settings
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Email Notifications</span>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Two-Factor Authentication</span>
                <input type="checkbox" className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Auto-save Projects</span>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Security</h2>
            </div>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Login History
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Active Sessions
              </button>
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Preferences
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>UTC-5 (Eastern)</option>
                  <option>UTC-8 (Pacific)</option>
                  <option>UTC+0 (GMT)</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </motion.div>
      </motion.div>
    </PageBackground>
  );
}
