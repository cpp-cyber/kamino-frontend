"use client"

import * as React from "react"
import { User } from "@/lib/types"
import { getAllUsers } from "@/lib/api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { ErrorDisplay } from "@/components/ui/error-display"
import { HeaderStats } from "./header-stats"
import { UsersTableToolbar } from "./users-table-toolbar"
import { UsersTableColumns } from "./users-table-columns"
import { UsersTablePagination } from "./users-table-pagination"
import { useUserFilters } from "./use-user-filters"

interface UsersTableProps {
  onDelete: (user: User) => void
  onRefresh?: () => Promise<void> | void
}

export function UsersTable({ onDelete, onRefresh }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)

  // Apply filters
  const filteredUsers = useUserFilters({ users, searchTerm })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchUsers()
      if (onRefresh) {
        await onRefresh()
      }
    } catch (error) {
      console.error('Failed to refresh users:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const usersData = await getAllUsers()
      setUsers(usersData)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users'
      setError(errorMessage)
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch users on component mount
  React.useEffect(() => {
    fetchUsers()
  }, [])

  // Reset to first page when search or items per page changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, itemsPerPage])

  const handleDeleteClick = (user: User, event: React.MouseEvent) => {
    event.stopPropagation()
    onDelete(user)
  }

  // Pagination calculations
  const totalItems = filteredUsers.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner message="Loading users..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <ErrorDisplay error={error} />
        <Button onClick={fetchUsers} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  if (isRefreshing) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner message="Refreshing users..." />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <HeaderStats users={users} />

      {/* Users Table */}
      <div className="rounded-md border">
        <UsersTableToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        <UsersTableColumns
          users={currentUsers}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Pagination */}
      <UsersTablePagination
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
