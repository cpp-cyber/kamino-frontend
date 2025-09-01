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
import { formatRelativeTime } from '@/lib/utils'

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

  return (
    <Table>
      <TableHeader className="bg-muted text-muted-foreground">
        <TableRow>
          <TableHead className="min-w-[200px] px-4">Username</TableHead>
          <TableHead className="min-w-[120px]">Groups</TableHead>
          <TableHead className="min-w-[120px]">Created</TableHead>
          <TableHead className="min-w-[120px]">Status</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 && (
          <TableRow key="empty-state">
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              No users found.
            </TableCell>
          </TableRow>
        )}
        {users.map((user) => (
          <TableRow key={user.name} className="hover:bg-muted/50">
            <TableCell className="font-medium px-4">
              <span>{user.name}</span>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {user.groups.length > 0 ? (
                  user.groups.map((group) => (
                    <Badge key={group.name} variant="secondary" className="text-xs">
                      {group.name}
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
                  {user.created_at ? formatRelativeTime(user.created_at) : "Never"}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{user.created_at ? formatDateTime(user.created_at) : "Never"}</p>
                </TooltipContent>
              </Tooltip>
            </TableCell>
            <TableCell>
              <Badge 
                variant={user.enabled ? "secondary" : "destructive"}
                className={user.enabled ? "bg-green-600 text-white dark:bg-green-700" : ""}
              >
                {user.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => onDelete(user, e)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={user.is_admin}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete user {user.name}</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

