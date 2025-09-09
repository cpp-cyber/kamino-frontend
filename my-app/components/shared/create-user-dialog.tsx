"use client"

import { useState, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createUsers } from "@/lib/api"
import { handleCreateUsers } from "@/lib/admin-operations"
import { CreateUsersRequest } from "@/lib/types"
import { validateUsername, validateUsernames, filterUsernameInput, UsernameValidationResult, validatePassword, filterPasswordInput, PasswordValidationResult } from "@/lib/utils"
import { UserPlus, Users, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CreateUserDialogProps {
  onUserCreated?: () => void
  trigger?: React.ReactNode
}

export function CreateUserDialog({ onUserCreated, trigger }: CreateUserDialogProps) {
  // Single user states
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [usernameValidation, setUsernameValidation] = useState<UsernameValidationResult>({ isValid: true, errors: [] })
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult>({ isValid: true, errors: [] })
  
  // Bulk user states
  const [usersCsv, setUsersCsv] = useState("")
  const [bulkValidation, setBulkValidation] = useState<{ username: string; validation: UsernameValidationResult }[]>([])
  
  // Common states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("single")
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Validation handlers
  const handleUsernameChange = (value: string) => {
    const filtered = filterUsernameInput(value)
    setUsername(filtered)
    setUsernameValidation(validateUsername(filtered))
  }

  const handlePasswordChange = (value: string) => {
    const filtered = filterPasswordInput(value)
    setPassword(filtered)
    setPasswordValidation(validatePassword(filtered))
  }

  const handleBulkUsersChange = (value: string) => {
    setUsersCsv(value)
    
    try {
      const users = parseUsersFromCsv(value)
      const usernames = users.map(u => u.username)
      setBulkValidation(validateUsernames(usernames))
    } catch {
      // If CSV parsing fails, clear validation
      setBulkValidation([])
    }
  }

  const parseUsersFromCsv = (csvText: string): CreateUsersRequest[] => {
    const lines = csvText.trim().split('\n')
    const users: CreateUsersRequest[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const parts = line.split(',').map(part => part.trim())
      if (parts.length !== 2) {
        throw new Error(`Line ${i + 1}: Invalid format. Expected "username,password"`)
      }
      
      const [username, password] = parts
      if (!username || !password) {
        throw new Error(`Line ${i + 1}: Username and password cannot be empty`)
      }

      // Validate password length
      if (password.length > 128) {
        throw new Error(`Line ${i + 1}: Password exceeds 128 character limit`)
      }

      // Validate password requirements
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.isValid) {
        throw new Error(`Line ${i + 1}: ${passwordValidation.errors[0]}`)
      }
      
      users.push({ username, password })
    }
    
    return users
  }

  const handleSingleUserSubmit = async () => {
    const usernameValidationResult = validateUsername(username)
    if (!usernameValidationResult.isValid) {
      toast.error(usernameValidationResult.errors[0])
      return false
    }

    const passwordValidationResult = validatePassword(password)
    if (!passwordValidationResult.isValid) {
      toast.error(passwordValidationResult.errors[0])
      return false
    }

    await handleCreateUsers(
      [{ username: username.trim(), password: password.trim() }],
      () => {
        setUsername("")
        setPassword("")
        setUsernameValidation({ isValid: true, errors: [] })
        setPasswordValidation({ isValid: true, errors: [] })
      }
    )
    return true
  }

  const handleBulkUserSubmit = async () => {
    if (!usersCsv.trim()) {
      toast.error("Please enter user data")
      return false
    }

    let users: CreateUsersRequest[]
    try {
      users = parseUsersFromCsv(usersCsv)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid CSV format")
      return false
    }

    if (users.length === 0) {
      toast.error("No valid users found")
      return false
    }

    // Validate all usernames
    const usernames = users.map(u => u.username)
    const validations = validateUsernames(usernames)
    const invalidUsernames = validations.filter(v => !v.validation.isValid)
    
    if (invalidUsernames.length > 0) {
      const firstError = invalidUsernames[0]
      toast.error(`Invalid username "${firstError.username}": ${firstError.validation.errors[0]}`)
      return false
    }
    
    await handleCreateUsers(
      users,
      () => {
        setUsersCsv("")
        setBulkValidation([])
      }
    )
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    try {
      let success = false
      
      if (activeTab === "single") {
        success = await handleSingleUserSubmit()
      } else {
        success = await handleBulkUserSubmit()
      }
      
      if (success) {
        closeButtonRef.current?.click()
        if (onUserCreated) {
          onUserCreated()
        }
      }
    } catch (error) {
      console.error('Failed to create user(s):', error)
      if (error instanceof Error) {
        toast.error(`Failed to create user(s): ${error.message}`)
      } else {
        toast.error('Failed to create user(s)')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <UserPlus className="size-4 mr-2" />
            Create User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Create new user accounts with username and password
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single" className="flex items-center gap-2">
              <UserPlus className="size-4" />
              Single 
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Users className="size-4" />
              Bulk
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <TabsContent value="single" className="space-y-4 mt-4">
              <div className="grid gap-3">
                <Label htmlFor="username-1">Username</Label>
                <Input 
                  id="username-1" 
                  name="username" 
                  placeholder="Enter username" 
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  disabled={isSubmitting}
                  required={activeTab === "single"}
                  className={!usernameValidation.isValid ? "border-destructive" : ""}
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
                <Label htmlFor="password-1">Password</Label>
                <Input 
                  id="password-1" 
                  name="password" 
                  type="password"
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  disabled={isSubmitting}
                  required={activeTab === "single"}
                  className={!passwordValidation.isValid ? "border-destructive" : ""}
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
                  At least one letter and one number required. Maximum 128 characters.
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="bulk" className="space-y-4 mt-4">
              <div className="grid gap-3">
                <Label htmlFor="users-csv">User Data (CSV Format)</Label>
                <Textarea
                  id="users-csv"
                  name="users-csv"
                  placeholder="username,password"
                  value={usersCsv}
                  onChange={(e) => handleBulkUsersChange(e.target.value)}
                  disabled={isSubmitting}
                  rows={8}
                  className={`font-mono text-sm ${bulkValidation.some(v => !v.validation.isValid) ? "border-destructive" : ""}`}
                  required={activeTab === "bulk"}
                />
                {bulkValidation.length > 0 && bulkValidation.some(v => !v.validation.isValid) && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <div className="space-y-1">
                        {bulkValidation
                          .filter(v => !v.validation.isValid)
                          .slice(0, 3) // Show only first 3 errors
                          .map((v, i) => (
                            <div key={i}>
                              <strong>{v.username}:</strong> {v.validation.errors[0]}
                            </div>
                          ))}
                        {bulkValidation.filter(v => !v.validation.isValid).length > 3 && (
                          <div className="text-xs">
                            ...and {bulkValidation.filter(v => !v.validation.isValid).length - 3} more errors
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                <div className="text-sm text-muted-foreground">
                  <p className="mb-1"><strong>Example:</strong></p>
                  <code className="block bg-muted p-2 rounded text-xs">
                    johndoe,password123<br/>
                    janesmith,securepass456<br/>
                    bobjones,mypassword789
                  </code>
                  <div className="text-xs mt-2">
                    Each username: max 20 characters, only letters and numbers allowed<br/>
                    Each password: max 128 characters, must contain at least one letter and one number
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button ref={closeButtonRef} variant="outline" type="button" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                type="submit" 
                disabled={
                  isSubmitting || 
                  (activeTab === "single" && (!username.trim() || !password.trim() || !usernameValidation.isValid || !passwordValidation.isValid)) ||
                  (activeTab === "bulk" && (!usersCsv.trim() || bulkValidation.some(v => !v.validation.isValid)))
                }
              >
                {isSubmitting ? "Creating..." : activeTab === "single" ? "Create User" : "Create Users"}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
