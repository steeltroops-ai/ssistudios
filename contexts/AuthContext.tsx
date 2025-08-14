'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'

// 1. Define the shape of the context's value
interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  login: () => void
  logout: () => void
}

// 2. Create the context with a default value of null
const AuthContext = createContext<AuthContextType | null>(null)

// 3. Create the AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()
  const pathname = usePathname()

  // This effect runs once on mount to check the initial auth state
  useEffect(() => {
    try {
      const loggedIn = localStorage.getItem('ssi-authenticated') === 'true'
      setIsAuthenticated(loggedIn)
    } catch (error) {
      console.error('Could not access localStorage:', error)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [])

  // This effect handles redirection based on auth state changes
  useEffect(() => {
    // Wait until the initial loading is done
    if (!loading) {
      if (!isAuthenticated && pathname !== '/login') {
        router.replace('/login')
      } else if (isAuthenticated && pathname === '/login') {
        router.replace('/')
      }
    }
  }, [isAuthenticated, loading, pathname, router])

  const login = () => {
    localStorage.setItem('ssi-authenticated', 'true')
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('ssi-authenticated')
    setIsAuthenticated(false)
    // The useEffect above will handle the redirect to '/login'
  }

  // The value that will be available to all children
  const value: AuthContextType = {
    isAuthenticated,
    loading,
    login,
    logout,
  }

  // While loading, you can return a spinner or null
  if (loading) {
    return null
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 4. Create a custom hook for easy access to the context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
