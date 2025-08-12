"use client"

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react'

interface AuthState {
  authenticated: boolean | null
  username?: string
  isAdmin?: boolean
  loading: boolean
}

interface AuthContextType {
  authState: AuthState
  checkSession: () => Promise<{ authenticated: boolean; username?: string; isAdmin?: boolean } | null>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Cache for session requests to prevent duplicate calls
let sessionPromise: Promise<any> | null = null
let sessionCache: { data: any; timestamp: number } | null = null
const CACHE_DURATION = 30000 // 30 seconds cache

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    authenticated: null,
    loading: true
  })

  const checkSession = useCallback(async () => {
    // Return cached result if available and fresh
    if (sessionCache && Date.now() - sessionCache.timestamp < CACHE_DURATION) {
      return sessionCache.data
    }

    // Return existing promise if one is already in flight
    if (sessionPromise) {
      return sessionPromise
    }

    sessionPromise = (async () => {
      try {
        const response = await fetch('/api/session', { credentials: 'include' })
        if (response.ok) {
          const data = await response.json()
          const result = {
            authenticated: data.authenticated || false,
            username: data.username,
            isAdmin: data.isAdmin || false
          }
          
          // Cache the result
          sessionCache = { data: result, timestamp: Date.now() }
          
          // Update auth state
          setAuthState({
            authenticated: result.authenticated,
            username: result.username,
            isAdmin: result.isAdmin,
            loading: false
          })
          
          return result
        } else {
          const result = null
          sessionCache = { data: result, timestamp: Date.now() }
          setAuthState({
            authenticated: false,
            loading: false
          })
          return result
        }
      } catch (error) {
        console.error('Session check failed:', error)
        const result = null
        sessionCache = { data: result, timestamp: Date.now() }
        setAuthState({
          authenticated: false,
          loading: false
        })
        return result
      } finally {
        sessionPromise = null
      }
    })()

    return sessionPromise
  }, [])

  const refreshAuth = useCallback(async () => {
    // Clear cache to force fresh request
    sessionCache = null
    sessionPromise = null
    setAuthState(prev => ({ ...prev, loading: true }))
    await checkSession()
  }, [checkSession])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' })
      // Clear cache and update state
      sessionCache = null
      sessionPromise = null
      setAuthState({
        authenticated: false,
        loading: false
      })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [])

  // Initialize auth state on mount
  useEffect(() => {
    checkSession()
  }, [checkSession])

  return (
    <AuthContext.Provider value={{ authState, checkSession, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
