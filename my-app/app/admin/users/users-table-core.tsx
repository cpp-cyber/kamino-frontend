import React from "react";
import { SortingState } from "@tanstack/react-table";
import { User } from "@/lib/types";
import { UsersTableCore } from "./users-table-columns";

interface UsersTableCoreWrapperProps {
  users: User[];
  currentPage: number;
  itemsPerPage: number;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  onUserAction: (user: User, action: "editGroups" | "delete") => void;
  selectedUsers: Set<string>;
  onSelectionChange: (selectedUsers: Set<string>) => void;
  selectedUsersCount: number;
  onBulkAddToGroup: () => void;
  onBulkRemoveFromGroup: () => void;
  onBulkDelete: () => void;
  searchTerm?: string;
}

export function UsersTableCoreWrapper({
  users,
  sorting,
  onSortingChange,
  onUserAction,
  selectedUsers,
  onSelectionChange,
  selectedUsersCount,
  onBulkAddToGroup,
  onBulkRemoveFromGroup,
  onBulkDelete,
  searchTerm = "",
}: UsersTableCoreWrapperProps) {
  return (
    <UsersTableCore
      users={users}
      searchTerm={searchTerm}
      onUserAction={onUserAction}
      selectedUsers={selectedUsers}
      onSelectionChange={onSelectionChange}
      selectedUsersCount={selectedUsersCount}
      onBulkAddToGroup={onBulkAddToGroup}
      onBulkRemoveFromGroup={onBulkRemoveFromGroup}
      onBulkDelete={onBulkDelete}
      sorting={sorting}
      onSortingChange={onSortingChange}
    />
  );
}
