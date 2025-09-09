import React from 'react'
import { MoreVertical, UserPlus, UserMinus, UserX, Trash2, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SortingIcon } from "@/components/table-components"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { formatRelativeTime, formatDateTime } from "@/lib/utils"
import { SortingState } from "@tanstack/react-table"

interface UsersTableCoreProps {
  users: User[]
  searchTerm: string
  onUserAction: (user: User, action: 'enable' | 'disable' | 'editGroups' | 'delete') => void
  selectedUsers: Set<string>
  onSelectionChange: (selectedUsers: Set<string>) => void
  selectedUsersForGroupOpsCount: number
  selectedNonAdminUsersCount: number
  onBulkAddToGroup: () => void
  onBulkRemoveFromGroup: () => void
  onBulkDisable: () => void
  onBulkDelete: () => void
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
}

export function UsersTableCore({
  users,
  searchTerm,
  onUserAction,
  selectedUsers,
  onSelectionChange,
  selectedUsersForGroupOpsCount,
  selectedNonAdminUsersCount,
  onBulkAddToGroup,
  onBulkRemoveFromGroup,
  onBulkDisable,
  onBulkDelete,
  sorting,
  onSortingChange
}: UsersTableCoreProps) {
  const isAllSelected = users.length > 0 && selectedUsers.size === users.length
  const isSomeSelected = selectedUsers.size > 0 && selectedUsers.size < users.length
  // Selection handlers
  const handleSelectUser = React.useCallback((userName: string, checked: boolean) => {
    const newSelectedUsers = new Set(selectedUsers)
    if (checked) {
      newSelectedUsers.add(userName)
    } else {
      newSelectedUsers.delete(userName)
    }
    onSelectionChange(newSelectedUsers)
  }, [selectedUsers, onSelectionChange])

  const handleSelectAll = React.useCallback(() => {
    if (isAllSelected) {
      // If all are selected, deselect all
      onSelectionChange(new Set())
    } else {
      // If none or some are selected, select all
      onSelectionChange(new Set(users.map(user => user.name)))
    }
  }, [isAllSelected, users, onSelectionChange])

  const handleSortingChange = (columnId: string) => {
    const currentSort = sorting.find(s => s.id === columnId)
    if (!currentSort) {
      // Not currently sorted, sort ascending
      onSortingChange([{ id: columnId, desc: false }])
    } else if (!currentSort.desc) {
      // Currently sorted ascending, sort descending
      onSortingChange([{ id: columnId, desc: true }])
    } else {
      // Currently sorted descending, remove sort
      onSortingChange([])
    }
  }

  const getSortDirection = (columnId: string): false | "asc" | "desc" => {
    const currentSort = sorting.find(s => s.id === columnId)
    if (!currentSort) return false
    return currentSort.desc ? 'desc' : 'asc'
  }

  return (
    <Table>
      <TableHeader className="bg-muted text-muted-foreground">
        <TableRow>
          <TableHead className="w-[45px] p-4">
            <Checkbox
              checked={isSomeSelected ? "indeterminate" : isAllSelected}
              onCheckedChange={handleSelectAll}
              aria-label="Select all users"
            />
          </TableHead>
          <TableHead className="min-w-[200px]">
            <div className="flex items-center justify-between pr-2 group">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSortingChange('name')}
                className="-ml-3 flex-1 justify-start hover:bg-muted transition-colors"
              >
                <span className="font-medium">Username</span>
              </Button>
              <SortingIcon sortDirection={getSortDirection('name')} />
            </div>
          </TableHead>
          <TableHead className="min-w-[150px]">
            <span className="font-medium">Groups</span>
          </TableHead>
          <TableHead className="min-w-[100px]">
            <div className="flex items-center justify-between pr-2 group">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSortingChange('created_at')}
                className="-ml-3 flex-1 justify-start hover:bg-muted transition-colors"
              >
                <span className="font-medium">Created</span>
              </Button>
              <SortingIcon sortDirection={getSortDirection('created_at')} />
            </div>
          </TableHead>
          <TableHead className="min-w-[80px]">
            <span className="font-medium">Status</span>
          </TableHead>
          <TableHead className="w-[20px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={onBulkAddToGroup}
                  className="cursor-pointer"
                  disabled={selectedUsersForGroupOpsCount === 0}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Group ({selectedUsersForGroupOpsCount})
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onBulkRemoveFromGroup}
                  className="cursor-pointer"
                  disabled={selectedUsersForGroupOpsCount === 0}
                >
                  <UserMinus className="mr-2 h-4 w-4" />
                  Remove Group ({selectedUsersForGroupOpsCount})
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onBulkDisable}
                  className="cursor-pointer"
                  disabled={selectedNonAdminUsersCount === 0}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  Disable ({selectedNonAdminUsersCount})
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onBulkDelete}
                  className="cursor-pointer text-destructive focus:text-destructive"
                  disabled={selectedNonAdminUsersCount === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete ({selectedNonAdminUsersCount})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 && (
          <TableRow key="empty-state">
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No users found matching your search.' : 'No users found.'}
            </TableCell>
          </TableRow>
        )}
        {users.map((user) => (
          <TableRow key={user.name} className="hover:bg-muted/50">
            <TableCell className="px-4" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedUsers.has(user.name)}
                onCheckedChange={(checked) => handleSelectUser(user.name, checked as boolean)}
                aria-label={`Select ${user.name}`}
              />
            </TableCell>
            <TableCell className="font-medium">
              <div className="truncate">{user.name}</div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {user.groups && user.groups.length > 0 ? (
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
                  <div className="truncate">
                    {user.created_at ? formatRelativeTime(user.created_at) : "Never"}
                  </div>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onUserAction(user, 'editGroups')}
                    className="cursor-pointer"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Edit Groups
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onUserAction(user, user.enabled ? 'disable' : 'enable')}
                    className="cursor-pointer"
                    disabled={user.is_admin}
                  >
                    {user.enabled ? (
                      <>
                        <UserX className="mr-2 h-4 w-4" />
                        Disable
                      </>
                    ) : (
                      <>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Enable
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onUserAction(user, 'delete')}
                    className="cursor-pointer text-destructive focus:text-destructive"
                    disabled={user.is_admin}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

