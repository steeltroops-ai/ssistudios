"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { PageBackground } from "@/components/shared/ThemeBackground";

export default function TemplatesContent() {
  return (
    <PageBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex font-space-grotesk overflow-hidden max-w-full"
        style={{ paddingTop: "2rem" }}
      >
        {/* Google Font Import */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />

        {/* Main Content */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
          <div className="w-full max-w-lg">
            {/* Professional, blueprint-style wireframe cat animation */}
            <div className="relative h-64 w-full mb-8">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64">
                <svg viewBox="0 0 250 200" className="w-full h-auto">
                  <defs>
                    {/* Filter for the glowing elements */}
                    <filter
                      id="wireframe-glow"
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Cat body wireframe */}
                  <motion.ellipse
                    cx="125"
                    cy="140"
                    rx="60"
                    ry="35"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    filter="url(#wireframe-glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, delay: 0.5 }}
                  />

                  {/* Cat head */}
                  <motion.circle
                    cx="125"
                    cy="80"
                    r="35"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    filter="url(#wireframe-glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, delay: 0.8 }}
                  />

                  {/* Cat ears */}
                  <motion.polygon
                    points="105,55 115,35 125,55"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    filter="url(#wireframe-glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                  />
                  <motion.polygon
                    points="125,55 135,35 145,55"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    filter="url(#wireframe-glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                  />

                  {/* Cat eyes */}
                  <motion.circle
                    cx="115"
                    cy="75"
                    r="3"
                    fill="#3b82f6"
                    filter="url(#wireframe-glow)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.8 }}
                  />
                  <motion.circle
                    cx="135"
                    cy="75"
                    r="3"
                    fill="#3b82f6"
                    filter="url(#wireframe-glow)"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.8 }}
                  />

                  {/* Cat tail */}
                  <motion.path
                    d="M 185 140 Q 210 120 220 100 Q 225 85 220 70"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    filter="url(#wireframe-glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, delay: 1.5 }}
                  />

                  {/* Floating geometric elements */}
                  <motion.rect
                    x="50"
                    y="50"
                    width="15"
                    height="15"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 0.7, rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.circle
                    cx="200"
                    cy="60"
                    r="8"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.7, scale: 1.2 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                </svg>
              </div>
            </div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.5 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                Templates Gallery
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Browse our collection of professional templates
              </p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 3 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <span>Coming Soon</span>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </motion.div>
    </PageBackground>
  );
}
