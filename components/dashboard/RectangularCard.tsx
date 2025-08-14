'use client'

import { useEffect, useState } from 'react'

export default function RectangularCard() {
  const [cardTitle, setCardTitle] = useState('Welcome to SSI Studio')
  const [quotes, setQuotes] = useState([
    'Design is intelligence made visible.',
    'Good design is obvious. Great design is transparent.',
    'Simplicity is the ultimate sophistication.',
    'Creativity takes courage.',
    'Design adds value faster than it adds costs.',
  ])

  const [quoteIndex, setQuoteIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [quotes.length])

  return (
    <header className="mb-4">
      {/* IMPROVEMENT: Updated background to a brown, white, and black blurry flow */}
      <div className="relative overflow-hidden rounded-3xl py-3 px-10 shadow-xl border border-gray-700">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4d3a32] via-[#f0ebe8] to-[#1c1c1c] bg-[length:300%_300%] animate-gradient-vertical opacity-80 blur-xl pointer-events-none"></div>
        {/* Overlay for smooth flash */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-white/8 animate-flashOverlay rounded-3xl" />
        </div>
        {/* Frosted glass overlay */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-md rounded-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-1.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md font-sans">
            {cardTitle}
          </h1>
          <div className="relative h-5 overflow-hidden">
            <p
              key={quoteIndex}
              className="absolute left-0 top-0 w-full text-base font-medium text-white/85 drop-shadow transition-opacity duration-800 ease-in-out"
              style={{
                animation: 'fadeSlide 3s ease-in-out forwards',
              }}
            >
              {quotes[quoteIndex]}
            </p>
          </div>
        </div>
      </div>

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
          background-size: 300% 300%;
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
    </header>
  )
}
