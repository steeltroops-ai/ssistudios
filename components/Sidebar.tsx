'use client'

import { useState, useEffect } from 'react'
import Logo from './Logo'
import { useAuth } from '@/contexts/AuthContext' // Assuming this path is correct now
import { motion, AnimatePresence } from 'framer-motion' // Import motion and AnimatePresence

// --- SVG Icon Components (unchanged) ---
function HomeIcon({ size = 18, className = "" }: { size?: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );
}

function PlusCircleIcon({ size = 18, className = "" }: { size?: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  );
}

function TemplateIcon({ size = 18, className = "" }: { size?: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  );
}

function CogIcon({ size = 18, className = "" }: { size?: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 = 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  );
}

function ChevronDownIcon({ size = 16, className = "" }: { size?: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}

function ChevronRightIcon({ size = 16, className = "" }: { size?: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}

function LogoutIcon({ size = 16, className = "" }: { size?: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  );
}

function MenuAlt3Icon({ size = 20, className = "" }: { size?: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" y1="12" x2="20" y2="12"></line>
      <line x1="4" y1="6" x2="20" y2="6"></line>
      <line x1="4" y1="18" x2="20" y2="18"></line>
    </svg>
  );
}

function XIcon({ size = 20, className = "" }: { size?: number, className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
// --- END: SVG Icon Components (unchanged) ---

type MenuItem = {
  name: string
  icon: React.ComponentType<{ size?: number; className?: string; }>
  path?: string
  children?: { name: string; path: string }[]
}

const menu: MenuItem[] = [
  { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  {
    name: 'New Poster',
    icon: PlusCircleIcon,
    children: [
      { name: 'Single Logo Editor', path: '/poster/new/single-logo/editor' },
      { name: 'Multiple Logos Editor', path: '/poster/new/multiple-logo/editor' },
    ],
  },
  { name: 'Templates', icon: TemplateIcon, path: '/templates' },
  {
    name: 'Settings',
    icon: CogIcon,
    children: [
      { name: 'Team', path: '/settings/team' },
      { name: 'Access', path: '/settings/access' },
    ],
  },
]

type SidebarProps = {
  forceActive?: string;
  isOpen: boolean; // Prop to control mobile sidebar visibility
  toggleSidebar: () => void; // Prop to toggle mobile sidebar
}

export default function Sidebar({ forceActive, isOpen, toggleSidebar }: SidebarProps) {
  const { logout } = useAuth();
  const [pathname, setPathname] = useState('');
  const [expanded, setExpanded] = useState<string[]>([])

  // This useEffect manages body scroll when mobile sidebar is open/closed
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup function to reset overflow when component unmounts or isOpen changes
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const expandedParents = menu
      .filter(
        (item) =>
          item.children &&
          item.children.some((child) => pathname.startsWith(child.path))
      )
      .map((item) => item.name)

    setExpanded(expandedParents)
  }, [pathname])

  const toggle = (name: string) => {
    setExpanded((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }
  
  const navigate = (path: string) => {
      if(typeof window !== 'undefined') {
          window.location.href = path;
      }
  }

  const isParentActive = (item: MenuItem) => {
    if (forceActive) return item.name === forceActive
    if (item.path && pathname.startsWith(item.path)) return true
    if (item.children) return item.children.some((c) => pathname.startsWith(c.path))
    return false
  }

  const isChildActive = (path: string) => pathname.startsWith(path)

  const handleLogout = () => {
    logout();
  }

  const isEditingEnvironment =
    pathname.includes('/poster/new/single-logo/editor') ||
    pathname.includes('/poster/new/multiple-logo/editor')

  const SidebarContent = (
    // This 'aside' element is the actual sidebar content.
    // Its width defines the 'ml-64' used in parent components.
    <aside className="w-64 h-screen bg-[#0b0b0b]/80 text-white flex flex-col justify-between backdrop-blur-lg font-nunito border-r-2 border-white/20">
      <div>
        <div className="p-5 h-[72px] border-b border-gray-800/50 sticky top-0 z-20 bg-transparent flex items-center justify-between">
          <Logo />
        </div>
        <nav className="px-4 py-4 overflow-y-auto max-h-[calc(100vh-140px)]">
          {menu.map((item) => {
            const Icon = item.icon
            const isOpenMenuItem = expanded.includes(item.name)
            const active = isParentActive(item)
            const muted = false
            
            const isForcedActive = forceActive === item.name;

            return (
              <div key={item.name} className="mb-1.5">
                <button
                  onClick={() => {
                    if (muted) return;
                    if (isForcedActive) return;

                    if (item.children) {
                      toggle(item.name)
                    } else {
                      if (item.path && item.path !== pathname) {
                        navigate(item.path)
                        toggleSidebar() // Close mobile sidebar on navigation
                      }
                    }
                  }}
                  className={`group flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
                    muted
                      ? 'text-gray-500 cursor-not-allowed'
                      : active
                      ? 'bg-white/5 text-white font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  } ${!muted && (isForcedActive ? 'cursor-default' : 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer')}`}
                  type="button"
                  disabled={muted}
                >
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1.5 bg-white rounded-r-full transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}></div>
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  {item.children &&
                    (isOpenMenuItem ? (
                      <ChevronDownIcon
                        size={16}
                        className={muted ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-300'}
                      />
                    ) : (
                      <ChevronRightIcon
                        size={16}
                        className={muted ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-300'}
                      />
                    ))}
                </button>

                {item.children && (
                  <div
                    className={`ml-5 border-l border-gray-700 pl-4 overflow-hidden transition-all duration-300 ease-in-out mt-2 ${
                      isOpenMenuItem ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {item.children.map((child) => {
                      const childIsActive = isChildActive(child.path)
                      const childMuted = isEditingEnvironment && !childIsActive

                      return (
                        <button
                          key={child.path}
                          onClick={() => {
                            if (childMuted) return;
                            if (child.path !== pathname) {
                              navigate(child.path)
                              toggleSidebar() // Close mobile sidebar on navigation
                            }
                          }}
                          className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-200 mb-1 ${
                            childMuted
                              ? 'text-gray-600 cursor-not-allowed'
                              : childIsActive
                              ? 'text-white font-medium'
                              : 'text-gray-400 hover:text-white'
                          } ${!childMuted && 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'}`}
                          type="button"
                          disabled={childMuted}
                        >
                          {child.name}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}

          {isEditingEnvironment && (
            <div className="relative group flex items-center justify-between w-full px-3 py-2.5 rounded-lg bg-white/5 text-white font-semibold mt-2">
               <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1.5 bg-white rounded-r-full"></div>
              <span className="text-sm">Editing Environment</span>
            </div>
          )}
        </nav>
      </div>

      <div className="flex-shrink-0 p-4 border-t border-gray-800/50 bg-transparent w-full">
        <div className="text-gray-500 text-xs mb-3 text-center select-none">
          SSI STUDIOS v.1.08.25
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-400 transition-colors w-full py-2 rounded-lg hover:bg-red-500/10 cursor-pointer"
          type="button"
        >
          <LogoutIcon size={16} />
          Logout
        </button>
      </div>
    </aside>
  )

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
      
      {/* Mobile hamburger button */}
      {/* Added Framer Motion for entrance animation */}
<motion.div 
  className="lg:hidden fixed top-4 right-4 z-50"
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
>
  <button
    onClick={toggleSidebar}
    className="w-10 h-10 flex items-center justify-center bg-[#111214]/80 rounded-full border border-gray-800/50 text-white hover:bg-[#1a1b1f] transition backdrop-blur-md shadow-md"
    type="button"
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    {isOpen ? <XIcon size={24} /> : <MenuAlt3Icon size={24} />}
  </button>
</motion.div>


      {/* Desktop Sidebar (visible on lg screens and up) */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen z-30"> 
        {SidebarContent}
      </div>

      {/* Mobile Sidebar Container (for animation and overlay) */}
      <AnimatePresence> {/* Required for exit animations */}
        {isOpen && ( // Render only when open for exit animation
          <motion.div
            initial={{ opacity: 0 }} // Start overlay faded
            animate={{ opacity: 1 }} // Fade in
            exit={{ opacity: 0 }}   // Fade out
            transition={{ duration: 0.3 }} // Smooth fade for overlay
            className="fixed inset-0 z-40 lg:hidden" // Removed 'visible'/'invisible' as Framer Motion handles it
            aria-hidden={!isOpen}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60" 
              onClick={toggleSidebar}
              aria-label="Close sidebar overlay"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: '-100%' }} // Start completely off-screen to the left
              animate={{ x: '0%' }}    // Slide in
              exit={{ x: '-100%' }}    // Slide out
              transition={{ 
                type: "spring", // Use a spring animation for a natural bounce
                stiffness: 200, 
                damping: 25 
              }}
              className="relative w-64 h-full" // Removed 'transform transition-transform' as Framer Motion handles it
            >
              {SidebarContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style>{`
        .font-nunito {
          font-family: 'Nunito', sans-serif;
        }
      `}</style>
    </>
  )
}