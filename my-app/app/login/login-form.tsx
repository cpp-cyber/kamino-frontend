"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface FormData {
  username: string
  password: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [formData, setFormData] = useState<FormData>({ username: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { refreshAuth } = useAuth()

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission - based on your working LoginPage.tsx
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.username === '' || formData.password === '') {
      setError('Username and password are required')
      setIsLoading(false)
      return
    }

    try {
      // Send request to backend for authentication
      const response = await fetch('/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for sending/receiving cookies
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      })

      // Handle the response based on the status
      if (response.ok) {
        setError('')
        // Refresh auth context to pick up the new session
        await refreshAuth()
        // Redirect immediately after successful login
        router.push('/')
      } else if (response.status === 401) {
        setError('Invalid username or password')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Server error. Please try again later.')
    }
    
    setIsLoading(false)
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            name="username"
            type="text" 
            value={formData.username}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            name="password"
            type="password" 
            value={formData.password}
            onChange={handleChange}
            required 
          />
        </div>
        {error && (
          <div className="text-sm text-red-600 text-center">
            {error}
          </div>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
        {/* <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link 
            href="/register" 
            className="text-kamino-green hover:text-kamino-green/80 font-medium underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </div> */}
      </div>
    </form>
  )
}
