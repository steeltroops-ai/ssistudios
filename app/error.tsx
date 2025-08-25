'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-bold text-white mb-4">Oops!</h1>
          <h2 className="text-3xl font-semibold text-gray-300 mb-6">Something went wrong</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 mr-4"
          >
            Try Again
          </button>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Go Home
          </a>
        </motion.div>
      </div>
    </div>
  )
}
