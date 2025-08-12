"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface AuthGuardProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export function AuthGuard({ children, adminOnly = false }: AuthGuardProps) {
  const [redirectTo, setRedirectTo] = useState<string | null>(null)
  const router = useRouter()
  const { authState } = useAuth()

  useEffect(() => {
    if (authState.loading) return

    if (!authState.authenticated) {
      setRedirectTo('/login')
      return
    }

    // Check admin access
    if (adminOnly && !authState.isAdmin) {
      setRedirectTo('/login')
      return
    }

    setRedirectTo(null)
  }, [authState, adminOnly])

  useEffect(() => {
    if (redirectTo) {
      router.push(redirectTo)
    }
  }, [redirectTo, router])

  if (authState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (adminOnly && !authState.isAdmin) {
    return null // Will redirect in useEffect
  }

  if (!authState.authenticated) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}
