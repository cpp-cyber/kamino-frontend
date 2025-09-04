"use client"

import { useState } from "react"
import { cn, validateUsername, filterUsernameInput, UsernameValidationResult, validatePassword, filterPasswordInput, PasswordValidationResult } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/lib/api"
import Link from "next/link"

interface FormData {
  username: string
  password: string
  confirmPassword: string
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [formData, setFormData] = useState<FormData>({ 
    username: '', 
    password: '', 
    confirmPassword: '' 
  })
  const [usernameValidation, setUsernameValidation] = useState<UsernameValidationResult>({ isValid: true, errors: [] })
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult>({ isValid: true, errors: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // Handle username input changes with validation
  const handleUsernameChange = (value: string) => {
    const filtered = filterUsernameInput(value)
    setFormData((prev) => ({
      ...prev,
      username: filtered,
    }))
    setUsernameValidation(validateUsername(filtered))
  }

  // Handle password input changes with validation
  const handlePasswordChange = (value: string) => {
    const filtered = filterPasswordInput(value)
    setFormData((prev) => ({
      ...prev,
      password: filtered,
    }))
    setPasswordValidation(validatePassword(filtered))
  }

  // Handle other input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'password') {
      handlePasswordChange(value)
    } else if (name === 'confirmPassword') {
      const filtered = filterPasswordInput(value)
      setFormData((prev) => ({
        ...prev,
        [name]: filtered,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Validate form data
  const validateForm = (): string | null => {
    const usernameValidationResult = validateUsername(formData.username)
    if (!usernameValidationResult.isValid) {
      return usernameValidationResult.errors[0]
    }
    if (formData.username.length < 3) {
      return 'Username must be at least 3 characters long'
    }
    const passwordValidationResult = validatePassword(formData.password)
    if (!passwordValidationResult.isValid) {
      return passwordValidationResult.errors[0]
    }
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match'
    }
    return null
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    // Validate form
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      // Call the register API function
      await registerUser(formData.username, formData.password)
      
      setSuccess(true)
      setError('')
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      
    } catch (error) {
      console.error('Registration error:', error)
      
      if (error instanceof Error) {
        if (error.message.includes('409')) {
          setError('Username already exists.')
        } else if (error.message.includes('400')) {
          setError('Invalid registration data. Please check your inputs.')
        } else {
          setError('Registration failed. Please try again later.')
        }
      } else {
        setError('Registration failed. Please try again later.')
      }
    }
    
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-kamino-green/10">
            <svg className="h-6 w-6 text-kamino-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-kamino-green">Registration Successful!</h1>
          <p className="text-muted-foreground">
            Your account has been created successfully. Redirecting to login page...
          </p>
        </div>
      </div>
    )
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create Account</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            name="username"
            type="text" 
            value={formData.username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            placeholder="Enter your username"
            required 
            className={`focus:border-kamino-green focus:ring-kamino-green ${!usernameValidation.isValid ? "border-destructive" : ""}`}
          />
          {!usernameValidation.isValid && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {usernameValidation.errors[0]}
              </AlertDescription>
            </Alert>
          )}
          <div className="text-xs text-muted-foreground">
            Max 20 characters. Only letters and numbers allowed.
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            name="password"
            type="password" 
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required 
            className={`focus:border-kamino-green focus:ring-kamino-green ${!passwordValidation.isValid ? "border-destructive" : ""}`}
          />
          {!passwordValidation.isValid && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {passwordValidation.errors[0]}
              </AlertDescription>
            </Alert>
          )}
          <div className="text-xs text-muted-foreground">
            At least 8 characters, must contain at least one letter and one number.
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input 
            id="confirmPassword" 
            name="confirmPassword"
            type="password" 
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required 
            className="focus:border-kamino-green focus:ring-kamino-green"
          />
        </div>
        {error && (
          <div className="text-sm text-red-600 text-center rounded-md">
            {error}
          </div>
        )}
        <Button 
          type="submit" 
          className="w-full bg-kamino-green hover:bg-kamino-green/90 text-white transition-colors" 
          disabled={isLoading || !usernameValidation.isValid || !passwordValidation.isValid}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link 
            href="/login" 
            className="text-kamino-green hover:text-kamino-green/80 font-medium underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </form>
  )
}
