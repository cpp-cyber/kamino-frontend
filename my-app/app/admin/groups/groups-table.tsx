"use client"

import * as React from "react"
import { SearchIcon, MoreVertical, Edit, Trash2, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { GetGroupsResponse, Group } from "@/lib/types"
import { getGroups } from "@/lib/api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatRelativeTime, formatDateTime } from '@/lib/utils'
import { HeaderStats } from "./header-stats"

interface GroupsTableProps {
  onGroupAction: (groupName: string, action: 'rename' | 'delete') => void
}

export function GroupsTable({ onGroupAction }: GroupsTableProps) {
  const [groupsData, setGroupsData] = React.useState<GetGroupsResponse>({ groups: [], count: 0 })
  const [filteredGroups, setFilteredGroups] = React.useState<Group[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getGroups()
      setGroupsData(data)
      setFilteredGroups(data.groups)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load groups')
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    const filtered = groupsData.groups.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredGroups(filtered)
  }, [searchTerm, groupsData])

  const totalItems = filteredGroups.length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner message="Loading groups..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadGroups} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <HeaderStats groupsData={groupsData} onGroupCreated={loadGroups} />
      {/* Table */}
      <div className="rounded-md border">
        <div className="bg-muted p-4 border-b rounded-t-md">
          <div className="flex items-center justify-between space-x-2">
            <div className="relative flex-1 max-w-sm">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-background"
              />
            </div>
            {searchTerm && (
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                {totalItems} result{totalItems !== 1 ? 's' : ''}
              </div>
            )}
            <Button onClick={loadGroups} variant="outline">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader className="bg-muted text-muted-foreground">
            <TableRow>
              <TableHead className="px-4">Name</TableHead>
              <TableHead>User Count</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-end px-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.length === 0 && (
              <TableRow key="empty-state">
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No Groups found matching your search.' : 'No Groups found.'}
                </TableCell>
              </TableRow>
            )}
            {filteredGroups.map((group) => (
              <TableRow key={group.name}>
                <TableCell className="font-medium px-4">{group.name}</TableCell>
                <TableCell className="text-muted-foreground">{group.user_count ?? 0}</TableCell>
                <TableCell className="text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger>
                      {group.created_at ? formatRelativeTime(group.created_at) : "Never"}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{group.created_at ? formatDateTime(group.created_at) : "Never"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell  className="text-end px-6">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </div>
  )
}
