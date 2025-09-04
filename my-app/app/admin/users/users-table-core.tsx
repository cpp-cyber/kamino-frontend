import React from 'react'
import { SortingState } from "@tanstack/react-table"
import { User } from "@/lib/types"
import { UsersTableCore } from "./users-table-columns"

interface UsersTableCoreWrapperProps {
  users: User[]
  currentPage: number
  itemsPerPage: number
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onUserAction: (user: User, action: 'enable' | 'disable' | 'editGroups' | 'delete') => void
  selectedUsers: Set<string>
  onSelectionChange: (selectedUsers: Set<string>) => void
  selectedUsersForGroupOpsCount: number
  selectedNonAdminUsersCount: number
  onBulkAddToGroup: () => void
  onBulkRemoveFromGroup: () => void
  onBulkDisable: () => void
  onBulkDelete: () => void
  searchTerm?: string
}

export function UsersTableCoreWrapper({
  users,
  sorting,
  onSortingChange,
  onUserAction,
  selectedUsers,
  onSelectionChange,
  selectedUsersForGroupOpsCount,
  selectedNonAdminUsersCount,
  onBulkAddToGroup,
  onBulkRemoveFromGroup,
  onBulkDisable,
  onBulkDelete,
  searchTerm = ""
}: UsersTableCoreWrapperProps) {
  return (
    <UsersTableCore
      users={users}
      searchTerm={searchTerm}
      onUserAction={onUserAction}
      selectedUsers={selectedUsers}
      onSelectionChange={onSelectionChange}
      selectedUsersForGroupOpsCount={selectedUsersForGroupOpsCount}
      selectedNonAdminUsersCount={selectedNonAdminUsersCount}
      onBulkAddToGroup={onBulkAddToGroup}
      onBulkRemoveFromGroup={onBulkRemoveFromGroup}
      onBulkDisable={onBulkDisable}
      onBulkDelete={onBulkDelete}
      sorting={sorting}
      onSortingChange={onSortingChange}
    />
  )
}
