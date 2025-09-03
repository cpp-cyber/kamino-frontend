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
import { CreateUsersRequest } from "@/lib/types"
import { UserPlus, Users } from "lucide-react"

interface CreateUserDialogProps {
  onUserCreated?: () => void
  trigger?: React.ReactNode
}

export function CreateUserDialog({ onUserCreated, trigger }: CreateUserDialogProps) {
  // Single user states
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  
  // Bulk user states
  const [usersCsv, setUsersCsv] = useState("")
  
  // Common states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("single")
  const closeButtonRef = useRef<HTMLButtonElement>(null)

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
      
      users.push({ username, password })
    }
    
    return users
  }

  const handleSingleUserSubmit = async () => {
    if (!username.trim()) {
      toast.error("Username is required")
      return false
    }

    if (!password.trim()) {
      toast.error("Password is required")
      return false
    }

    await createUsers([{ username: username.trim(), password: password.trim() }])
    toast.success(`User "${username.trim()}" has been created successfully`)
    setUsername("")
    setPassword("")
    return true
  }

  const handleBulkUserSubmit = async () => {
    if (!usersCsv.trim()) {
      toast.error("Please enter user data")
      return false
    }

    const users = parseUsersFromCsv(usersCsv)
    
    if (users.length === 0) {
      toast.error("No valid users found")
      return false
    }
    
    await createUsers(users)
    toast.success(`${users.length} user(s) have been created successfully`)
    setUsersCsv("")
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
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                  required={activeTab === "single"}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password-1">Password</Label>
                <Input 
                  id="password-1" 
                  name="password" 
                  type="password"
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required={activeTab === "single"}
                />
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
                  onChange={(e) => setUsersCsv(e.target.value)}
                  disabled={isSubmitting}
                  rows={8}
                  className="font-mono text-sm"
                  required={activeTab === "bulk"}
                />
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2"><strong>Format:</strong> username,password (one per line)</p>
                  <p className="mb-1"><strong>Example:</strong></p>
                  <code className="block bg-muted p-2 rounded text-xs">
                    johndoe,password123<br/>
                    janesmith,securepass456<br/>
                    bobjones,mypassword789
                  </code>
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
                  (activeTab === "single" && (!username.trim() || !password.trim())) ||
                  (activeTab === "bulk" && !usersCsv.trim())
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
