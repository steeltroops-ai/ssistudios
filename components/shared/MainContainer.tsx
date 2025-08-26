"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

// Simple MainContainer that renders the page content
// The actual routing is handled by Next.js app router
export default function MainContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <motion.main
      key={pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 min-h-screen w-full"
    >
      {/* The content is rendered by the page components in the app directory */}
      <div className="w-full h-full">{children}</div>
    </motion.main>
  );
}
