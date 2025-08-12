"use client"

import React from 'react'
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User } from "@/lib/types"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface UsersTableColumnsProps {
  users: User[]
  onDelete: (user: User, event: React.MouseEvent) => void
}

export function UsersTableColumns({
  users,
  onDelete
}: UsersTableColumnsProps) {
  const formatDateTime = (dateString: string) => {
    try {
      // Parse UTC timestamp and convert to local time
      const date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z')
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      })
    } catch {
      return dateString // Return original string if parsing fails
    }
  }

  const formatRelativeTime = (dateString: string) => {
    try {
      // Parse UTC timestamp and convert to local time
      const date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z')
      const now = new Date()
      const diffInMs = now.getTime() - date.getTime()
      
      // Convert to different time units
      const seconds = Math.floor(diffInMs / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      const weeks = Math.floor(days / 7)
      const months = Math.floor(days / 30)
      const years = Math.floor(days / 365)
      
      if (years > 0) {
        return years === 1 ? '1 year ago' : `${years} years ago`
      } else if (months > 0) {
        return months === 1 ? '1 month ago' : `${months} months ago`
      } else if (weeks > 0) {
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
      } else if (days > 0) {
        return days === 1 ? '1 day ago' : `${days} days ago`
      } else if (hours > 0) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`
      } else if (minutes > 0) {
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`
      } else {
        return seconds <= 30 ? 'Just now' : `${seconds} seconds ago`
      }
    } catch {
      return dateString // Return original string if parsing fails
    }
  }

  return (
    <Table>
      <TableHeader className="bg-muted text-muted-foreground">
        <TableRow>
          <TableHead className="min-w-[200px] px-4">Username</TableHead>
          <TableHead className="min-w-[120px]">Groups</TableHead>
          <TableHead className="min-w-[120px]">Created</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 && (
          <TableRow key="empty-state">
            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
              No users found.
            </TableCell>
          </TableRow>
        )}
        {users.map((user) => (
          <TableRow key={user.username} className="hover:bg-muted/50">
            <TableCell className="font-medium px-4">
              <span>{user.username}</span>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {user.groups.length > 0 ? (
                  user.groups.map((group) => (
                    <Badge key={group} variant="secondary" className="text-xs">
                      {group}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">No groups</span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              <Tooltip>
                <TooltipTrigger>
                  {user.createdDate ? formatRelativeTime(user.createdDate) : "Never"}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{user.createdDate ? formatDateTime(user.createdDate) : "Never"}</p>
                </TooltipContent>
              </Tooltip>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => onDelete(user, e)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={user.isAdmin}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete user {user.username}</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

