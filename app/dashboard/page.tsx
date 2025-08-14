'use client'

import { useEffect, useState } from 'react'
import PosterCard from '@/components/dashboard/PosterCard'
import Header from '@/components/dashboard/Header'
import Sidebar from '@/components/Sidebar' // Import the Sidebar component

export default function DashboardPage() {
  const [cardTitle, setCardTitle] = useState('Welcome to SSI Studio')
  const [quotes, setQuotes] = useState([
    'Design is intelligence made visible.',
    'Good design is obvious. Great design is transparent.',
    'Simplicity is the ultimate sophistication.',
    'Creativity takes courage.',
    'Design adds value faster than it adds costs.',
  ])

  const [quoteIndex, setQuoteIndex] = useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // State for sidebar toggle

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [quotes.length])

  function updateCardContent(newTitle: string, newQuotes: string[]) {
    setCardTitle(newTitle)
    setQuotes(newQuotes)
    setQuoteIndex(0)
  }

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex"> {/* Use flexbox for layout */}
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <main
        className={`flex-1 min-h-screen px-4 sm:px-6 lg:px-12 xl:px-20 transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Header - You might want to move the Header into the main content area if it's not part of the sidebar */}
        <div className="my-4 cursor-pointer">
          <Header />
        </div>

        {/* Enhanced rectangular card with the new background */}
        <header className="mb-6 sm:mb-8 lg:mb-12">
          <div className="relative overflow-hidden rounded-3xl p-px shadow-2xl shadow-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-teal-400 to-indigo-600 animate-gradient-slow rounded-3xl"></div>
            <div className="relative bg-gray-900/80 rounded-[23px] py-4 px-5 sm:py-6 sm:px-8 backdrop-blur-xl">
              <div className="relative z-10 flex flex-col gap-1.5">
                <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-white drop-shadow-lg font-sans">
                  {cardTitle}
                </h1>
                <div className="relative h-6 overflow-hidden">
                  <p
                    key={quoteIndex}
                    className="absolute left-0 top-0 w-full text-xs sm:text-sm md:text-base font-medium text-white/85 drop-shadow transition-opacity duration-800 ease-in-out"
                    style={{ animation: 'fadeSlide 3s ease-in-out forwards' }}
                  >
                    {quotes[quoteIndex]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Poster cards */}
        <section className="mt-8 sm:mt-12 lg:mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
            <PosterCard
              title="Poster 1"
              imageSrc="/posters/poster1.jpg"
              onClickPath="/selector"
            />
          </div>
        </section>

        {/* Styles */}
        <style jsx>{`
          @keyframes fadeSlide {
            0% {
              opacity: 0;
              transform: translateY(12px);
            }
            15% {
              opacity: 1;
              transform: translateY(0);
            }
            85% {
              opacity: 1;
              transform: translateY(0);
            }
            100% {
              opacity: 0;
              transform: translateY(-12px);
            }
          }
          @keyframes gradient-slow {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .animate-gradient-slow {
            animation: gradient-slow 8s ease infinite;
            background-size: 300% 300%;
          }
          @keyframes pan-bg {
            from {
              background-position: 0% 0%;
            }
            to {
              background-position: 200% 200%;
            }
          }
          .animate-pan-bg {
            animation: pan-bg 60s linear infinite;
          }
          @keyframes gradient-vertical {
            0% {
              background-position: 0% 0%;
            }
            50% {
              background-position: 100% 100%;
            }
            100% {
              background-position: 0% 0%;
            }
          }
          .animate-gradient-vertical {
            animation: gradient-vertical 12s ease infinite;
          }
          @keyframes flashOverlay {
            0%,
            100% {
              opacity: 0.05;
            }
            50% {
              opacity: 0.15;
            }
          }
          .animate-flashOverlay {
            animation: flashOverlay 2s ease-in-out infinite;
          }
        `}</style>
      </main>
    </div>
  )
}