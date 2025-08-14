
// =========================================================================
// app/ClientRootLayout.tsx
// UPDATED: This is now much simpler.
'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import AuthBackground from '@/components/backgrounds/AuthBackground'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ReactNode, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// --- AnimatedHamburgerIcon (No changes needed here) ---
type MotionLineProps = React.ComponentPropsWithoutRef<'line'> & {
  variants?: any;
  [key: string]: any;
};
const MotionLine = motion.line as React.FC<MotionLineProps>

const AnimatedHamburgerIcon = ({
  isOpen,
  size = 20,
  strokeWidth = 2,
  className = ''
}: {
  isOpen: boolean
  size?: number
  strokeWidth?: number
  className?: string
}) => {
  const commonLineAttributes = {
    vectorEffect: 'non-scaling-stroke' as const,
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  }

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={isOpen ? 'open' : 'closed'}
      initial={false}
      variants={{ open: {}, closed: {} }}
    >
      <MotionLine x1="4" y1="6" x2="20" y2="6" variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 6 } }} {...commonLineAttributes} />
      <MotionLine x1="4" y1="12" x2="20" y2="12" variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }} {...commonLineAttributes} />
      <MotionLine x1="4" y1="18" x2="20" y2="18" variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -6 } }} {...commonLineAttributes} />
    </motion.svg>
  )
}

// --- AppLayout component ---
// This component now assumes it will only be rendered for authenticated users.
function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const forceActive = pathname === '/selector' ? 'Dashboard' : undefined;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  // If not authenticated, the AuthProvider will redirect.
  // We render the children for the login page, or the layout for authenticated pages.
  return (
    <>
      <AuthBackground />
      {isAuthenticated ? (
        <div className="flex relative z-10 min-h-screen">
          <Sidebar forceActive={forceActive} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-transparent transition-all duration-300 lg:ml-64 p-4 lg:p-8">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {pathname === '/dashboard' ? 'Dashboard' :
                  pathname.startsWith('/poster/new') ? 'Creative Studio' :
                    'App'}
              </h1>
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                aria-label="Toggle sidebar"
              >
                <AnimatedHamburgerIcon isOpen={isSidebarOpen} size={28} />
              </button>
            </div>
            {children}
          </main>
        </div>
      ) : (
        <main className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4">
          {children}
        </main>
      )}
    </>
  );
}

// The main layout component wraps everything in the AuthProvider
export default function ClientRootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppLayout>{children}</AppLayout>
    </AuthProvider>
  );
}