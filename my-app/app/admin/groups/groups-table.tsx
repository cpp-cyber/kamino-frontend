"use client"

import * as React from "react"
import { GetGroupsResponse, Group } from "@/lib/types"
import { getGroups } from "@/lib/api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { HeaderStats } from "./header-stats"
import { GroupsTableToolbar } from "./groups-table-toolbar"
import { GroupsTableCore } from "./groups-table-core"
import { GroupsTablePagination } from "./groups-table-pagination"
import { SortingState } from "@tanstack/react-table"

interface GroupsTableProps {
  onGroupAction: (groupName: string, action: 'rename' | 'delete') => void
}

export function GroupsTable({ onGroupAction }: GroupsTableProps) {
  const [groupsData, setGroupsData] = React.useState<GetGroupsResponse>({ groups: [], count: 0 })
  const [filteredGroups, setFilteredGroups] = React.useState<Group[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)
  
  // Sorting state with default sort by created time (newest first)
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "created_at", desc: true }
  ])

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

  // Apply sorting to filtered groups before pagination
  const sortedGroups = React.useMemo(() => {
    if (sorting.length === 0) return filteredGroups
    
    const sortedData = [...filteredGroups]
    const sort = sorting[0]
    
    sortedData.sort((a, b) => {
      let aValue: any
      let bValue: any
      
      if (sort.id === 'created_at') {
        aValue = a.created_at ? new Date(a.created_at) : new Date(0)
        bValue = b.created_at ? new Date(b.created_at) : new Date(0)
      } else if (sort.id === 'name') {
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
      } else if (sort.id === 'user_count') {
        aValue = a.user_count || 0
        bValue = b.user_count || 0
      } else if (sort.id === 'can_modify') {
        aValue = a.can_modify || false
        bValue = b.can_modify || false
      } else {
        return 0
      }
      
      if (aValue < bValue) return sort.desc ? 1 : -1
      if (aValue > bValue) return sort.desc ? -1 : 1
      return 0
    })
    
    return sortedData
  }, [filteredGroups, sorting])

  // Reset to page 1 when search changes or items per page changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, itemsPerPage])

  // Pagination calculations
  const totalItems = sortedGroups.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedGroups = sortedGroups.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

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
        <GroupsTableToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          onRefresh={loadGroups}
          totalItems={totalItems}
        />
        <GroupsTableCore
          groups={paginatedGroups}
          sorting={sorting}
          onSortingChange={setSorting}
          onGroupAction={onGroupAction}
          searchTerm={searchTerm}
        />
      </div>

      {/* Pagination */}
      <GroupsTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
