"use client"

import React, { useState, useEffect } from 'react'
import { Group } from '@/lib/types'
import { getGroups } from '@/lib/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface GroupSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: (groupName: string) => void
  selectedUsersCount: number
}

export function GroupSelectionDialog({ 
  open, 
  onOpenChange, 
  title,
  description,
  onConfirm,
  selectedUsersCount
}: GroupSelectionDialogProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>("")
  const [availableGroups, setAvailableGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(false)

  // Load available groups when dialog opens
  useEffect(() => {
    if (open) {
      loadGroups()
      setSelectedGroup("") // Reset selection
    }
  }, [open])

  const loadGroups = async () => {
    try {
      setLoading(true)
      const response = await getGroups()
      
      // Filter out protected groups for both add and remove operations
      const filteredGroups = response.groups.filter(group => {
        const lowerName = group.name.toLowerCase()
        return !lowerName.includes('kamino') && !lowerName.includes('admin')
      })
      
      setAvailableGroups(filteredGroups)
    } catch (error) {
      console.error('Failed to load groups:', error)
      toast.error('Failed to load available groups')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    if (!selectedGroup) {
      toast.error('Please select a group')
      return
    }
    
    onConfirm(selectedGroup)
    onOpenChange(false)
    setSelectedGroup("")
  }

  const handleCancel = () => {
    onOpenChange(false)
    setSelectedGroup("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
            <br />
            <span className="font-medium">Selected users: {selectedUsersCount}</span>
            <br />
            <span className="text-xs text-muted-foreground">
              Protected groups containing &quot;kamino&quot; or &quot;admin&quot; are not shown.
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner message="Loading groups..." />
            </div>
          ) : (
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {availableGroups.map((group) => (
                  <SelectItem key={group.name} value={group.name}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedGroup || loading}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
