'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

interface PosterCardProps {
  title: string
  imageSrc: string
  onClickPath: string
  uploadDate?: string
}

export default function PosterCard({ title, imageSrc, onClickPath, uploadDate }: PosterCardProps) {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    if (!uploadDate) {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
      setCurrentDate(now.toLocaleDateString(undefined, options))
    }
  }, [uploadDate])

  const displayDate = uploadDate || currentDate

  const handleClick = useCallback(() => {
    router.push(onClickPath)
  }, [onClickPath, router])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        router.push(onClickPath)
      }
    },
    [onClickPath, router]
  )

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="
        group relative rounded-xl overflow-hidden
        border border-gray-700 bg-gray-900
        shadow-md
        cursor-pointer
        transition
        duration-500
        ease-[cubic-bezier(0.4,0,0.2,1)]
        focus-visible:outline
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-blue-500
        hover:border-blue-500
        hover:shadow-[0_0_12px_2px_rgba(59,106,223,0.6)]

        w-full max-w-xs mx-auto
        sm:max-w-sm
        md:max-w-md
      "
      tabIndex={0}
      role="button"
      aria-label={`Open ${title}`}
    >
      {/* Upload date tag - top center, visible only on hover */}
      {displayDate && (
        <div
          className="
            absolute top-3 left-1/2 z-20 rounded-full bg-black bg-opacity-60 px-4 py-1 text-xs font-semibold text-white backdrop-blur-sm
            select-none pointer-events-none
            opacity-0 group-hover:opacity-100
            -translate-x-1/2
            transition-opacity duration-500 ease-in-out
            whitespace-nowrap
          "
        >
          Uploaded on {displayDate}
        </div>
      )}

      {/* Image container */}
      <div className="overflow-hidden rounded-xl">
        <img
          src={imageSrc}
          alt={title}
          className="
            w-full object-cover
            h-48
            sm:h-56
            md:h-64
            transition-transform duration-700 ease-in-out
            scale-100
          "
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* Overlay gradient */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t from-black/80 via-black/30 to-transparent
          opacity-70
          pointer-events-none
        "
      />

      {/* Animated text container */}
      <div
        className="
          absolute bottom-0 left-0 right-0 p-6 z-10
          opacity-0
          group-hover:opacity-100
          transform translate-y-6
          group-hover:translate-y-0
          transition-all duration-500 ease-in-out
          bg-gradient-to-t from-black/90 via-transparent
        "
      >
        <h3 className="text-2xl font-bold text-white drop-shadow-lg tracking-wide leading-tight font-sans">
          {title}
        </h3>
        <p className="mt-2 text-sm text-white tracking-wide font-medium font-sans select-none">
          Customize your design here
        </p>
      </div>
    </div>
  )
}
