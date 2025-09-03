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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createGroups } from "@/lib/api"
import { parseGroupNamesFromText } from "@/lib/utils"
import { Users, UserPlus, Hash } from "lucide-react"

interface CreateGroupDialogProps {
  onGroupCreated?: () => void
  trigger?: React.ReactNode
}

export function CreateGroupDialog({ onGroupCreated, trigger }: CreateGroupDialogProps) {
  // Single group states
  const [groupName, setGroupName] = useState("")
  
  // Bulk group states
  const [groupsText, setGroupsText] = useState("")
  
  // Prefix group states
  const [prefix, setPrefix] = useState("")
  const [groupCount, setGroupCount] = useState("5")
  
  // Common states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("single")
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const handleSingleGroupSubmit = async () => {
    if (!groupName.trim()) {
      toast.error("Group name is required")
      return false
    }

    await createGroups([groupName.trim()])
    toast.success(`Group "${groupName.trim()}" has been created successfully`)
    setGroupName("")
    return true
  }

  const handleBulkGroupSubmit = async () => {
    if (!groupsText.trim()) {
      toast.error("Please enter group names")
      return false
    }

    const groups = parseGroupNamesFromText(groupsText)
    
    if (groups.length === 0) {
      toast.error("No valid group names found")
      return false
    }
    
    await createGroups(groups)
    toast.success(`${groups.length} group(s) have been created successfully`)
    setGroupsText("")
    return true
  }

  const handlePrefixGroupSubmit = async () => {
    if (!prefix.trim()) {
      toast.error("Prefix is required")
      return false
    }

    const count = parseInt(groupCount)
    if (isNaN(count) || count < 1 || count > 50) {
      toast.error("Please select a valid number of groups (1-50)")
      return false
    }

    const groups = Array.from({ length: count }, (_, i) => `${prefix.trim()}${i + 1}`)
    
    await createGroups(groups)
    toast.success(`${groups.length} group(s) have been created successfully with prefix "${prefix.trim()}"`)
    setPrefix("")
    setGroupCount("5")
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    try {
      let success = false
      
      if (activeTab === "single") {
        success = await handleSingleGroupSubmit()
      } else if (activeTab === "bulk") {
        success = await handleBulkGroupSubmit()
      } else if (activeTab === "prefix") {
        success = await handlePrefixGroupSubmit()
      }
      
      if (success) {
        closeButtonRef.current?.click()
        if (onGroupCreated) {
          onGroupCreated()
        }
      }
    } catch (error) {
      console.error('Failed to create group(s):', error)
      if (error instanceof Error) {
        toast.error(`Failed to create group(s): ${error.message}`)
      } else {
        toast.error('Failed to create group(s)')
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
            <Users className="size-4 mr-2" />
            Create Group
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          <DialogDescription>
            Create new groups to manage user permissions
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="single" className="flex items-center gap-2">
              <UserPlus className="size-4" />
              Single
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Users className="size-4" />
              Bulk
            </TabsTrigger>
            <TabsTrigger value="prefix" className="flex items-center gap-2">
              <Hash className="size-4" />
              Prefix
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <TabsContent value="single" className="space-y-4 mt-4">
              <div className="grid gap-3">
                <Label htmlFor="groupname-1">Group Name</Label>
                <Input 
                  id="groupname-1" 
                  name="groupname" 
                  placeholder="Enter group name" 
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  disabled={isSubmitting}
                  required={activeTab === "single"}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="bulk" className="space-y-4 mt-4">
              <div className="grid gap-3">
                <Label htmlFor="groups-text">Group Names</Label>
                <Textarea
                  id="groups-text"
                  name="groups-text"
                  placeholder="group"
                  value={groupsText}
                  onChange={(e) => setGroupsText(e.target.value)}
                  disabled={isSubmitting}
                  rows={8}
                  className="font-mono text-sm"
                  required={activeTab === "bulk"}
                />
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2"><strong>Format:</strong> One group name per line</p>
                  <p className="mb-1"><strong>Example:</strong></p>
                  <code className="block bg-muted p-2 rounded text-xs">
                    administrators<br/>
                    developers<br/>
                    users<br/>
                    moderators
                  </code>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="prefix" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="flex justify-center">
                  <div className="grid grid-cols-2 gap-3 w-65">
                    <div className="grid gap-3">
                      <Label htmlFor="prefix">Group Prefix</Label>
                      <Input 
                        id="prefix" 
                        name="prefix" 
                        placeholder="team" 
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value)}
                        disabled={isSubmitting}
                        required={activeTab === "prefix"}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="group-count">Number of Groups</Label>
                      <Select value={groupCount} onValueChange={setGroupCount} disabled={isSubmitting}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                        <SelectContent side="bottom">
                          {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2"><strong>Preview:</strong> Groups will be created with names like:</p>
                  <code className="block bg-muted p-2 rounded text-xs">
                    {prefix || 'prefix'}{1}<br/>
                    {prefix || 'prefix'}{2}<br/>
                    {prefix || 'prefix'}{3}<br/>
                    ...{parseInt(groupCount) > 3 ? ` (up to ${prefix || 'prefix'}${groupCount})` : ''}
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
                  (activeTab === "single" && !groupName.trim()) ||
                  (activeTab === "bulk" && !groupsText.trim()) ||
                  (activeTab === "prefix" && !prefix.trim())
                }
              >
                {isSubmitting ? "Creating..." : 
                 activeTab === "single" ? "Create Group" : 
                 activeTab === "bulk" ? "Create Groups" : 
                 `Create ${groupCount} Groups`}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
