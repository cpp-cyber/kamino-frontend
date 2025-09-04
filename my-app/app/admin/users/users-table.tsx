"use client"

import * as React from "react"
import { GetUsersResponse, User } from "@/lib/types"
import { getAllUsers, disableUser, bulkAddUsersToGroup, bulkRemoveUsersFromGroup, bulkDeleteUsers } from "@/lib/api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { ErrorDisplay } from "@/components/ui/error-display"
import { HeaderStats } from "./header-stats"
import { UsersTableToolbar } from "./users-table-toolbar"
import { UsersTableCore } from "./users-table-core"
import { UsersTablePagination } from "./users-table-pagination"
import { useUserFilters } from "./use-user-filters"
import { GroupSelectionDialog } from "@/app/admin/users/group-selection-dialog"
import { BulkDeleteConfirmDialog } from "@/app/admin/users/bulk-delete-confirm-dialog"
import { BulkDisableConfirmDialog } from "@/app/admin/users/bulk-disable-confirm-dialog"
import { toast } from "sonner"
import { SortingState } from "@tanstack/react-table"

interface UsersTableProps {
  onUserAction: (user: User, action: 'enable' | 'disable' | 'editGroups' | 'delete') => void
  onRefresh?: () => Promise<void> | void
}

export function UsersTable({ onUserAction, onRefresh }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [usersData, setUsersData] = React.useState<GetUsersResponse>({ users: [], count: 0, admin_count: 0, disabled_count: 0 })
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)

  // Selection state
  const [selectedUsers, setSelectedUsers] = React.useState<Set<string>>(new Set())

  // Sorting state
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "created_at", desc: true } // Default sort by created time, newest first
  ])

  // Filter state
  const [showEnabledUsers, setShowEnabledUsers] = React.useState(true)
  const [showDisabledUsers, setShowDisabledUsers] = React.useState(true)

  // Dialog states
  const [addGroupDialogOpen, setAddGroupDialogOpen] = React.useState(false)
  const [removeGroupDialogOpen, setRemoveGroupDialogOpen] = React.useState(false)
  const [disableConfirmDialogOpen, setDisableConfirmDialogOpen] = React.useState(false)
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = React.useState(false)

  // Apply filters
  const filteredUsers = useUserFilters({ 
    users: usersData.users, 
    searchTerm,
    showEnabledUsers,
    showDisabledUsers
  })

  // Apply sorting to filtered users before pagination
  const sortedUsers = React.useMemo(() => {
    if (sorting.length === 0) return filteredUsers
    
    const sortedData = [...filteredUsers]
    const sort = sorting[0]
    
    sortedData.sort((a, b) => {
      let aValue: string | number | boolean | Date
      let bValue: string | number | boolean | Date
      
      if (sort.id === 'created_at') {
        aValue = new Date(a.created_at)
        bValue = new Date(b.created_at)
      } else if (sort.id === 'name') {
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
      } else if (sort.id === 'enabled') {
        aValue = a.enabled
        bValue = b.enabled
      } else if (sort.id === 'is_admin') {
        aValue = a.is_admin
        bValue = b.is_admin
      } else if (sort.id === 'groups') {
        aValue = a.groups.length
        bValue = b.groups.length
      } else {
        return 0
      }
      
      if (aValue < bValue) return sort.desc ? 1 : -1
      if (aValue > bValue) return sort.desc ? -1 : 1
      return 0
    })
    
    return sortedData
  }, [filteredUsers, sorting])

  // Clear selection when search changes or page changes
  React.useEffect(() => {
    setSelectedUsers(new Set())
  }, [searchTerm, currentPage])

  // Get selected user objects
  const selectedUserObjects = React.useMemo(() => {
    return usersData.users.filter(user => selectedUsers.has(user.name))
  }, [usersData.users, selectedUsers])

  // For group operations - include all selected users (including admins)
  const selectedUsersForGroupOps = React.useMemo(() => {
    return selectedUserObjects
  }, [selectedUserObjects])

  // For delete operations - exclude admin users
  const selectedNonAdminUsers = React.useMemo(() => {
    return selectedUserObjects.filter(user => !user.is_admin)
  }, [selectedUserObjects])

  // Bulk operation handlers
  const handleBulkAddToGroup = () => {
    if (selectedUsers.size === 0) {
      toast.error('No users selected')
      return
    }
    setAddGroupDialogOpen(true)
  }

  const handleBulkRemoveFromGroup = () => {
    if (selectedUsers.size === 0) {
      toast.error('No users selected')
      return
    }
    setRemoveGroupDialogOpen(true)
  }

  const handleBulkDisable = () => {
    if (selectedUsers.size === 0) {
      toast.error('No users selected')
      return
    }
    if (selectedNonAdminUsers.length === 0) {
      toast.error('Cannot disable admin users')
      return
    }
    setDisableConfirmDialogOpen(true)
  }

  const handleBulkDelete = () => {
    if (selectedUsers.size === 0) {
      toast.error('No users selected')
      return
    }
    if (selectedNonAdminUsers.length === 0) {
      toast.error('Cannot delete admin users')
      return
    }
    setDeleteConfirmDialogOpen(true)
  }

  const handleAddGroupConfirm = async (groupName: string) => {
    try {
      // Use all selected users (including admins) for group operations
      const usersToUpdate = selectedUsersForGroupOps
      
      if (usersToUpdate.length === 0) {
        toast.error('No users selected')
        return
      }

      // Use bulk API endpoint to add users to group
      const usernamesToUpdate = usersToUpdate.map(user => user.name)
      await bulkAddUsersToGroup(usernamesToUpdate, groupName)
      
      toast.success(`Added ${usersToUpdate.length} users to group "${groupName}"`)
      setSelectedUsers(new Set())
      await handleRefresh()
    } catch (error) {
      console.error('Failed to add users to group:', error)
      toast.error('Failed to add users to group')
    }
  }

  const handleRemoveGroupConfirm = async (groupName: string) => {
    try {
      // Use all selected users (including admins) for group operations
      const usersToUpdate = selectedUsersForGroupOps
      
      if (usersToUpdate.length === 0) {
        toast.error('No users selected')
        return
      }

      // Use bulk API endpoint to remove users from group
      const usernamesToUpdate = usersToUpdate.map(user => user.name)
      await bulkRemoveUsersFromGroup(usernamesToUpdate, groupName)
      
      toast.success(`Removed ${usersToUpdate.length} users from group "${groupName}"`)
      setSelectedUsers(new Set())
      await handleRefresh()
    } catch (error) {
      console.error('Failed to remove users from group:', error)
      toast.error('Failed to remove users from group')
    }
  }

  const handleDisableConfirm = async () => {
    try {
      const usernamesToDisable = selectedNonAdminUsers.map(user => user.name)
      await Promise.all(usernamesToDisable.map(username => disableUser(username)))
      toast.success(`Disabled ${selectedNonAdminUsers.length} users`)
      setSelectedUsers(new Set())
      await handleRefresh()
    } catch (error) {
      console.error('Failed to disable users:', error)
      toast.error('Failed to disable users')
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      const usernamesToDelete = selectedNonAdminUsers.map(user => user.name)
      await bulkDeleteUsers(usernamesToDelete)
      
      toast.success(`Deleted ${selectedNonAdminUsers.length} users`)
      setSelectedUsers(new Set())
      await handleRefresh()
    } catch (error) {
      console.error('Failed to delete users:', error)
      toast.error('Failed to delete users')
    }
  }

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
      const fetchedUsersData = await getAllUsers()
      setUsersData(fetchedUsersData)
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

  const handleUserAction = (user: User, action: 'enable' | 'disable' | 'editGroups' | 'delete') => {
    onUserAction(user, action)
  }

  // Pagination calculations
  const totalItems = sortedUsers.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = sortedUsers.slice(startIndex, endIndex)

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
      <HeaderStats usersData={usersData} onUserCreated={handleRefresh} />

      {/* Users Table */}
      <div className="rounded-md border">
        <UsersTableToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          showEnabledUsers={showEnabledUsers}
          onShowEnabledUsersChange={setShowEnabledUsers}
          showDisabledUsers={showDisabledUsers}
          onShowDisabledUsersChange={setShowDisabledUsers}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        <UsersTableCore
          users={currentUsers}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          sorting={sorting}
          onSortingChange={setSorting}
          onUserAction={handleUserAction}
          selectedUsers={selectedUsers}
          onSelectionChange={setSelectedUsers}
          selectedUsersForGroupOpsCount={selectedUsersForGroupOps.length}
          selectedNonAdminUsersCount={selectedNonAdminUsers.length}
          onBulkAddToGroup={handleBulkAddToGroup}
          onBulkRemoveFromGroup={handleBulkRemoveFromGroup}
          onBulkDisable={handleBulkDisable}
          onBulkDelete={handleBulkDelete}
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

      {/* Dialogs */}
      <GroupSelectionDialog
        open={addGroupDialogOpen}
        onOpenChange={setAddGroupDialogOpen}
        title="Add Users to Group"
        description="Select a group to add the selected users to:"
        onConfirm={handleAddGroupConfirm}
        selectedUsersCount={selectedUsersForGroupOps.length}
      />

      <GroupSelectionDialog
        open={removeGroupDialogOpen}
        onOpenChange={setRemoveGroupDialogOpen}
        title="Remove Users from Group"
        description="Select a group to remove the selected users from:"
        onConfirm={handleRemoveGroupConfirm}
        selectedUsersCount={selectedUsersForGroupOps.length}
      />

      <BulkDisableConfirmDialog
        open={disableConfirmDialogOpen}
        onOpenChange={setDisableConfirmDialogOpen}
        onConfirm={handleDisableConfirm}
        selectedUsersCount={selectedNonAdminUsers.length}
        usernames={selectedNonAdminUsers.map(user => user.name)}
      />

      <BulkDeleteConfirmDialog
        open={deleteConfirmDialogOpen}
        onOpenChange={setDeleteConfirmDialogOpen}
        onConfirm={handleDeleteConfirm}
        selectedUsersCount={selectedNonAdminUsers.length}
        usernames={selectedNonAdminUsers.map(user => user.name)}
      />
    </div>
  )
}
