"use client"

import { useState, useRef } from "react"
import { toast } from "sonner"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GetGroupsResponse } from "@/lib/types"
import { IconUsersGroup } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { createGroup } from "@/lib/api"

interface HeaderStatsProps {
  groupsData: GetGroupsResponse
  onGroupCreated?: () => void
}

export function HeaderStats({ groupsData, onGroupCreated }: HeaderStatsProps) {
  const [groupName, setGroupName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!groupName.trim()) {
      toast.error("Group name is required")
      return
    }

    setIsCreating(true)
    try {
      await createGroup(groupName.trim())
      toast.success(`Group "${groupName.trim()}" has been created successfully`)
      setGroupName("")
      // Close dialog using the ref
      closeButtonRef.current?.click()
      onGroupCreated?.()
    } catch (error) {
      toast.error(`Failed to create group: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid-cols-2 pb-2">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Groups</CardDescription>
            <CardAction>
              <IconUsersGroup/>
            </CardAction>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {groupsData.count}
            </CardTitle>
          </CardHeader>
        </Card>

        <Dialog>
          <DialogTrigger asChild>
            {/* Gradient Button with Kamino Colors */}
            <Button 
              className="h-full w-full bg-gradient-to-r from-kamino-green to-kamino-yellow font-medium hover:brightness-90 cursor-pointer shadow !text-white rounded-xl"
              type="button"
              >
              <Plus />
              Create Groups
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
              <DialogHeader>
                <DialogTitle>Create Groups</DialogTitle>
                <DialogDescription>
                  Create a new group to manage user permissions
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Input 
                    id="name-1" 
                    name="name" 
                    placeholder="Group Name" 
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    disabled={isCreating}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button ref={closeButtonRef} variant="outline" type="button" disabled={isCreating}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isCreating || !groupName.trim()}>
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
