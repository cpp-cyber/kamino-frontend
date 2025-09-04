"use client"

import { ArrowUpDown, MoreVertical, UserPlus, UserMinus, UserX, Trash2, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { formatRelativeTime, formatDateTime } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

// Column definitions for the Users table
export const createUsersTableColumns = (
  onUserAction: (user: User, action: 'enable' | 'disable' | 'editGroups' | 'delete') => void,
  selectedUsers: Set<string>,
  onSelectionChange: (selectedUsers: Set<string>) => void,
  selectedUsersForGroupOpsCount: number,
  selectedNonAdminUsersCount: number,
  onBulkAddToGroup: () => void,
  onBulkRemoveFromGroup: () => void,
  onBulkDisable: () => void,
  onBulkDelete: () => void
): ColumnDef<User>[] => {
  
  // Selection handlers (moved outside of hooks to be regular functions)
  const handleSelectUser = (userName: string, checked: boolean) => {
    const newSelectedUsers = new Set(selectedUsers)
    if (checked) {
      newSelectedUsers.add(userName)
    } else {
      newSelectedUsers.delete(userName)
    }
    onSelectionChange(newSelectedUsers)
  }

  const handleSelectAll = (users: User[]) => {
    const isAllSelected = users.length > 0 && selectedUsers.size === users.length
    
    if (isAllSelected) {
      // If all are selected, deselect all
      onSelectionChange(new Set())
    } else {
      // If none or some are selected, select all users (including admins)
      const allUserNames = users.map(user => user.name)
      onSelectionChange(new Set(allUserNames))
    }
  }

  return [
    {
      id: "select",
      header: ({ table }) => {
        const users = table.getFilteredRowModel().rows.map(row => row.original)
        const isAllSelected = users.length > 0 && selectedUsers.size === users.length
        const isSomeSelected = selectedUsers.size > 0 && selectedUsers.size < users.length
        
        return (
          <Checkbox
            checked={isSomeSelected ? "indeterminate" : isAllSelected}
            onCheckedChange={() => handleSelectAll(users)}
            aria-label="Select all users"
            className="ml-1.5"
          />
        )
      },
      cell: ({ row }) => (
        <div className="w-[50px] px-3 ml-1.5" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selectedUsers.has(row.original.name)}
            onCheckedChange={(checked) => handleSelectUser(row.original.name, checked as boolean)}
            aria-label={`Select ${row.original.name}`}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3"
          >
            Username
            <ArrowUpDown className="size-3 -ml-1 text-muted-foreground" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-medium px-3">
          <span>{row.getValue("name")}</span>
        </div>
      ),
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "groups",
      header: () => (
        <div className="px-3 text-left -ml-2">
          Groups
        </div>
      ),
      cell: ({ row }) => {
        const groups = row.getValue("groups") as Array<{ name: string }>
        return (
          <div className="flex flex-wrap gap-1 px-3">
            {groups.length > 0 ? (
              groups.map((group) => (
                <Badge key={group.name} variant="secondary" className="text-xs">
                  {group.name}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">No groups</span>
            )}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-3"
          >
            Created
            <ArrowUpDown className="size-3 -ml-1 text-muted-foreground" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const createdAt = row.getValue("created_at") as string
        return (
          <div className="text-muted-foreground px-3">
            <Tooltip>
              <TooltipTrigger>
                {createdAt ? formatRelativeTime(createdAt) : "Never"}
              </TooltipTrigger>
              <TooltipContent>
                <p>{createdAt ? formatDateTime(createdAt) : "Never"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )
      },
      sortingFn: (rowA, rowB) => {
        const aDate = new Date(rowA.original.created_at?.endsWith('Z') ? rowA.original.created_at : rowA.original.created_at + 'Z')
        const bDate = new Date(rowB.original.created_at?.endsWith('Z') ? rowB.original.created_at : rowB.original.created_at + 'Z')
        return aDate.getTime() - bDate.getTime() // aDate - bDate = when desc:true, newer dates come first
      },
    },
    {
      accessorKey: "enabled",
      header: () => (
        <div className="px-3 text-left -ml-2">
          Status
        </div>
      ),
      cell: ({ row }) => {
        const enabled = row.getValue("enabled") as boolean
        return (
          <div className="px-4">
            <Badge 
              variant={enabled ? "secondary" : "destructive"}
              className={enabled ? "bg-green-600 text-white dark:bg-green-700" : ""}
            >
              {enabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      id: "actions",
      header: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
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
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="px-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
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
          </div>
        )
      },
      enableSorting: false,
    },
  ]
}

