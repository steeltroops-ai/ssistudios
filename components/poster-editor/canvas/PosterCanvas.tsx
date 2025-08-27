"use client";

import { motion } from "framer-motion";
import { Edit } from "lucide-react";

export const PosterCanvas = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      delay: 0.3,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94], // Apple's spring curve
    }}
    className="flex-1 bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-black/[0.06] flex items-center justify-center overflow-hidden"
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="w-full max-w-2xl h-64 sm:h-80 md:h-96 bg-white/80 rounded-2xl shadow-md border border-black/[0.04] flex items-center justify-center backdrop-blur-sm mx-auto"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center"
        >
          <Edit className="w-10 h-10 text-gray-600" />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.3 }}
          className="text-xl font-semibold text-gray-800 mb-3 tracking-tight"
        >
          Canvas
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.3 }}
          className="text-gray-600 text-sm tracking-tight"
        >
          Start creating your poster
        </motion.p>
      </div>
    </motion.div>
  </motion.div>
);
