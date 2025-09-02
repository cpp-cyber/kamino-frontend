"use client"

import { useState, useRef } from "react"
import { toast } from "sonner"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GetUsersResponse } from "@/lib/types"
import { User, Shield, UserRoundX, Plus } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { createUser } from "@/lib/api"

interface HeaderStatsProps {
  usersData: GetUsersResponse
  onUserCreated?: () => void
}


export function HeaderStats({ usersData, onUserCreated }: HeaderStatsProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim()) {
      toast.error("Username is required")
      return
    }

    if (!password.trim()) {
      toast.error("Password is required")
      return
    }

    try {
      await createUser(username.trim(), password.trim())
      toast.success(`User "${username.trim()}" has been created successfully`)
      setUsername("")
      setPassword("")
      // Close dialog using the ref
      closeButtonRef.current?.click()
      onUserCreated?.()
    } catch (error) {
      toast.error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:grid-cols-4 grid-cols-2 pb-2">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Users</CardDescription>
            <CardAction>
              <User/>
            </CardAction>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {usersData.count}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Admin Users</CardDescription>
            <CardAction>
              <Shield/>
            </CardAction>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {usersData.admin_count}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Disabled Users</CardDescription>
            <CardAction>
              <UserRoundX/>
            </CardAction>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {usersData.disabled_count}
            </CardTitle>
          </CardHeader>
        </Card>
        

        <Dialog>
          <DialogTrigger asChild>
            <Button 
            className="h-full w-full min-h-[100px] bg-gradient-to-r from-kamino-green to-kamino-yellow font-medium hover:brightness-90 cursor-pointer shadow !text-white rounded-xl"
            type="button"
            >
            <Plus />
            Create Users
          </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
              <DialogHeader>
                <DialogTitle>Create User</DialogTitle>
                <DialogDescription>
                  Create a new user account with username and password
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="username-1">Username</Label>
                  <Input 
                    id="username-1" 
                    name="username" 
                    placeholder="Enter username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
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
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button ref={closeButtonRef} variant="outline" type="button">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={!username.trim() || !password.trim()}>
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
