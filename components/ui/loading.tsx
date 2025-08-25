'use client'

import { motion } from 'framer-motion'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'pulse'
  text?: string
  fullScreen?: boolean
}

export default function Loading({ 
  size = 'md', 
  variant = 'spinner', 
  text,
  fullScreen = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center'
    : 'flex items-center justify-center p-4'

  const renderSpinner = () => (
    <div className={`${sizeClasses[size]} border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin`} />
  )

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} bg-blue-600 rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  )

  const renderPulse = () => (
    <motion.div
      className={`${sizeClasses[size]} bg-blue-600 rounded-full`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 1,
        repeat: Infinity
      }}
    />
  )

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots()
      case 'pulse':
        return renderPulse()
      default:
        return renderSpinner()
    }
  }

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {renderLoader()}
        {text && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

// Specialized loading components
export function PageLoading({ text = 'Loading...' }: { text?: string }) {
  return <Loading variant="spinner" size="lg" text={text} fullScreen />
}

export function ButtonLoading({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <Loading variant="spinner" size={size} />
}

export function InlineLoading({ text }: { text?: string }) {
  return <Loading variant="dots" size="sm" text={text} />
}
