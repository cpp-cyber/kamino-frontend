"use client"

import { ArrowUpDown, MoreVertical, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { Group } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { formatRelativeTime, formatDateTime } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

// Column definitions for the Groups table
export const createGroupsTableColumns = (
  onGroupAction: (groupName: string, action: 'rename' | 'delete') => void
): ColumnDef<Group>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="ml-2"
        >
          Name
          <ArrowUpDown className="size-3 -ml-1 text-muted-foreground" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium px-4">
        <span>{row.getValue("name")}</span>
      </div>
    ),
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "user_count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User Count
          <ArrowUpDown className="size-3 -ml-1 text-muted-foreground" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-muted-foreground px-3">
        {row.getValue("user_count") ?? 0}
      </div>
    ),
    sortingFn: (rowA, rowB) => {
      const a = (rowA.getValue("user_count") as number) ?? 0
      const b = (rowB.getValue("user_count") as number) ?? 0
      return a - b
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
    id: "actions",
    header: () => (
      <div className="text-end px-4">
        Actions
      </div>
    ),
    cell: ({ row }) => {
      const group = row.original
      return (
        <div className="text-end px-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" disabled={!group.can_modify}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onGroupAction(group.name, 'rename')}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onGroupAction(group.name, 'delete')}
                className="cursor-pointer text-destructive focus:text-destructive"
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
