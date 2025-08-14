'use client'

import { Bell, Mail, User, Search } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'

// A reusable component for icon buttons to keep the code clean and consistent.
const IconWrapper = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <button
    type="button"
    aria-label={label}
    className="relative p-2 text-white/80 transition-all duration-200 rounded-full cursor-pointer hover:text-white hover:bg-white/10 hover:scale-110 active:scale-95"
  >
    {children}
  </button>
)

export default function DashboardHeader() {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  // This effect manages the expand/collapse state with a delay to prevent flickering.
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    if (isHovered) {
      setIsExpanded(true)
    } else {
      timeoutId = setTimeout(() => {
        if (headerRef.current && !headerRef.current.matches(':hover')) {
          setIsExpanded(false)
        }
      }, 300)
    }
    return () => clearTimeout(timeoutId)
  }, [isHovered])

  return (
    <>
      <header
        ref={headerRef}
        aria-label="Dashboard header"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={clsx(
          'relative mx-auto mt-6 flex items-center justify-center rounded-full backdrop-blur-xl overflow-hidden',
          'animate-gemini-flow',
          'border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.1)]',
          'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
          isHovered && 'shadow-[0_8px_24px_rgba(0,0,0,0.4)]'
        )}
        style={{
          // MODIFIED: Reduced size for a sleeker look.
          width: isExpanded ? 'clamp(300px, 50vw, 640px)' : 120,
          padding: '5px',
        }}
      >
        {/* FIX: Wrapper for all expanded content that fades out together. */}
        <div
          className={clsx(
            'flex items-center justify-between w-full transition-opacity duration-300',
            isExpanded ? 'opacity-100' : 'opacity-0'
          )}
        >
          {/* Search Section */}
          <div className="flex items-center flex-grow pl-2">
            <IconWrapper label="Search">
              <Search size={20} />
            </IconWrapper>
            <div
              className={clsx(
                'transition-all duration-300 ease-in-out',
                isExpanded ? 'w-full ml-2' : 'w-0 ml-0'
              )}
            >
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full bg-transparent text-white placeholder:text-white/60 text-sm pl-2 pr-4 py-2 outline-none border-none"
              />
            </div>
          </div>

          {/* Icons Section */}
          <div className="flex items-center gap-1 pr-2">
            <IconWrapper label="Notifications">
              <Bell size={20} />
            </IconWrapper>
            <IconWrapper label="Messages">
              <Mail size={20} />
            </IconWrapper>
            <div className="w-px h-6 bg-white/20 mx-1" />
            <IconWrapper label="User Account">
              <User size={20} />
            </IconWrapper>
          </div>
        </div>

        {/* Collapsed State View - Fades in when the expanded view fades out. */}
        <div
          className={clsx(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-5 text-white/80 transition-opacity duration-300',
            isExpanded ? 'opacity-0' : 'opacity-100',
            'pointer-events-none'
          )}
        >
          <Search size={20} />
          <Bell size={20} />
          <User size={20} />
        </div>
      </header>

      {/* Styles for the animated gradient background */}
      <style>{`
        @keyframes gemini-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gemini-flow {
          background-image: linear-gradient(
            -45deg,
            rgba(79, 61, 244, 0.8),
            rgba(122, 60, 241, 0.8),
            rgba(249, 53, 182, 0.7),
            rgba(0, 197, 197, 0.8),
            rgba(79, 61, 244, 0.8)
          );
          background-size: 400% 400%;
          animation: gemini-flow 15s ease infinite;
        }
      `}</style>
    </>
  )
}
