// src/app/ClientRootLayout.tsx
'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar' // Correctly import your existing Sidebar component
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ReactNode, useState, useEffect } from 'react' // Import useState, useEffect
import { motion } from 'framer-motion' // For animations
import { HiOutlineMenu, HiX } from 'react-icons/hi' // Used here for the global mobile button

// --- AnimatedHamburgerIcon (defined directly in ClientRootLayout) ---
// FIXED: Simpler type definition for MotionLineProps to resolve x1/y1 errors
type MotionLineProps = React.ComponentPropsWithoutRef<'line'> & {
  variants?: any; // Add variants if you pass them directly for motion components
  [key: string]: any; // Allow any other props that line elements might take
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
      variants={{
        open: {},
        closed: {}
      }}
    >
      <MotionLine
        x1="4"
        y1="6"
        x2="20"
        y2="6"
        variants={{
          closed: { rotate: 0, y: 0 },
          open: { rotate: 45, y: 6 }
        }}
        {...commonLineAttributes}
      />
      <MotionLine
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 }
        }}
        {...commonLineAttributes}
      />
      <MotionLine
        x1="4"
        y1="18"
        x2="20"
        y2="18"
        variants={{
          closed: { rotate: 0, y: 0 },
          open: { rotate: -45, y: -6 }
        }}
        {...commonLineAttributes}
      />
    </motion.svg>
  )
}

// --- AppLayout component ---
function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Centralized state for sidebar toggle

  // Logic to force the active state for specific pages.
  const forceActive = pathname === '/selector' ? 'Dashboard' : undefined

  // Function to toggle sidebar visibility, shared across the app
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Effect to manage body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])


  if (!isAuthenticated && pathname !== '/login') {
    return null // AuthProvider handles the redirect
  }

  return (
    <>
      {pathname !== '/login' ? (
        <div className="flex relative z-10 min-h-screen">
          <Sidebar forceActive={forceActive} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          
          <main
            className={`flex-1 overflow-y-auto bg-white transition-all duration-300 lg:ml-64 p-4 lg:p-8`}
          >
            {/*
              GLOBAL MOBILE HEADER WITH HAMBURGER BUTTON:
              This header is now part of the main layout, ensuring only ONE mobile menu button for the ENTIRE APP.
              It will display relevant titles based on the current path.
              It's hidden on large screens (`lg:hidden`).
            */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {/* Dynamic title based on current path for mobile header */}
                {pathname === '/dashboard' ? 'Dashboard' : 
                  pathname.startsWith('/poster/new') ? 'Creative Studio' :
                  pathname.startsWith('/templates') ? 'Templates' :
                  pathname.startsWith('/settings') ? 'Settings' :
                  'App'} {/* Default title */}
              </h1>
              <button
                  onClick={toggleSidebar}
                  className="p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                  aria-label="Toggle sidebar"
              >
                  <AnimatedHamburgerIcon isOpen={isSidebarOpen} size={28} />
              </button>
            </div>

            {children} {/* This is where your page components (DashboardPage, PosterWithLogoEditor) will be rendered */}
          </main>
        </div>
      ) : (
        <main className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 bg-white">
          {children}
        </main>
      )}
    </>
  )
}

// The main layout component wraps everything in the AuthProvider
export default function ClientRootLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppLayout>{children}</AppLayout> {/* AppLayout now contains all sidebar logic */}
    </AuthProvider>
  )
}
