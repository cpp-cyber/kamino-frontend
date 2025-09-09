import React from 'react'
import { MoreVertical, Edit, Trash2 } from "lucide-react"
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
import { Group } from "@/lib/types"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { formatRelativeTime, formatDateTime } from "@/lib/utils"
import { SortingState } from "@tanstack/react-table"

interface GroupsTableCoreProps {
  groups: Group[]
  searchTerm: string
  onGroupAction: (groupName: string, action: 'rename' | 'delete') => void
  selectedGroups: string[]
  onSelectGroup: (groupName: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onBulkAction: (action: 'delete') => void
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
}

export function GroupsTableCore({
  groups,
  searchTerm,
  onGroupAction,
  selectedGroups,
  onSelectGroup,
  onSelectAll,
  onBulkAction,
  sorting,
  onSortingChange
}: GroupsTableCoreProps) {
  // Only groups that can be selected (can_modify)
  const allSelectableGroups = React.useMemo(() => groups.filter(g => g.can_modify).map(g => g.name), [groups])
  
  const allSelected = allSelectableGroups.length > 0 && allSelectableGroups.every(name => selectedGroups.includes(name))
  const isIndeterminate = selectedGroups.length > 0 && !allSelected

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
              checked={isIndeterminate ? "indeterminate" : allSelected}
              onCheckedChange={checked => onSelectAll(!!checked)}
              aria-label="Select all groups"
              disabled={allSelectableGroups.length === 0}
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
                <span className="font-medium">Name</span>
              </Button>
              <SortingIcon sortDirection={getSortDirection('name')} />
            </div>
          </TableHead>
          <TableHead className="min-w-[100px]">
            <div className="flex items-center justify-between pr-2 group">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSortingChange('user_count')}
                className="-ml-3 flex-1 justify-start hover:bg-muted transition-colors"
              >
                <span className="font-medium">User Count</span>
              </Button>
              <SortingIcon sortDirection={getSortDirection('user_count')} />
            </div>
          </TableHead>
          <TableHead className="min-w-[150px]">
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
          <TableHead className="w-[20px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" disabled={selectedGroups.length === 0}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onBulkAction('delete')}
                  className="cursor-pointer text-destructive focus:text-destructive"
                  disabled={selectedGroups.length === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete ({selectedGroups.length})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.length === 0 && (
          <TableRow key="empty-state">
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No groups found matching your search.' : 'No groups found.'}
            </TableCell>
          </TableRow>
        )}
        {groups.map((group) => (
          <TableRow key={group.name} className="hover:bg-muted/50">
            <TableCell className="px-4" onClick={e => e.stopPropagation()}>
              <Checkbox
                checked={selectedGroups.includes(group.name)}
                onCheckedChange={checked => onSelectGroup(group.name, !!checked)}
                aria-label={`Select ${group.name}`}
                disabled={!group.can_modify}
              />
            </TableCell>
            <TableCell className="font-medium">
              <div className="truncate">{group.name}</div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {group.user_count ?? 0}
            </TableCell>
            <TableCell className="text-muted-foreground">
              <Tooltip>
                <TooltipTrigger>
                  <div className="truncate">
                    {group.created_at ? formatRelativeTime(group.created_at) : "Never"}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{group.created_at ? formatDateTime(group.created_at) : "Never"}</p>
                </TooltipContent>
              </Tooltip>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" disabled={!group.can_modify}>
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
