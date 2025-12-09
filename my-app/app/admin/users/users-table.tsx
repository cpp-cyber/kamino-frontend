"use client";

import * as React from "react";
import { GetUsersResponse, User } from "@/lib/types";
import { getAllUsers } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ErrorDisplay } from "@/components/ui/error-display";
import { HeaderStats } from "./header-stats";
import { UsersTableToolbar } from "./users-table-toolbar";
import { UsersTableCoreWrapper } from "./users-table-core";
import { UsersTablePagination } from "./users-table-pagination";
import { useUserFilters } from "./use-user-filters";
import { GroupSelectionDialog } from "@/app/admin/users/group-selection-dialog";
import { BulkDeleteConfirmDialog } from "@/app/admin/users/bulk-delete-confirm-dialog";
import { toast } from "sonner";
import { SortingState } from "@tanstack/react-table";
import {
  handleDeleteUsers,
  handleUserGroupOperation,
} from "@/lib/admin-operations";

interface UsersTableProps {
  onUserAction: (user: User, action: "editGroups" | "delete") => void;
  onRefresh?: () => Promise<void> | void;
}

export function UsersTable({ onUserAction, onRefresh }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(25);

  // Selection state
  const [selectedUsers, setSelectedUsers] = React.useState<Set<string>>(
    new Set(),
  );

  // Sorting state
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "created_at", desc: false }, // Default sort by created_at (recent to old)
  ]);

  // Dialog states
  const [addGroupDialogOpen, setAddGroupDialogOpen] = React.useState(false);
  const [removeGroupDialogOpen, setRemoveGroupDialogOpen] =
    React.useState(false);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] =
    React.useState(false);

  // Compute stats from users data
  const stats = React.useMemo(() => {
    return {
      count: users.length,
      disabled_count: users.filter((u) => !u.enabled).length,
      admin_count: users.filter((u) => u.is_admin).length,
      creator_count: users.filter((u) => u.is_creator).length,
    };
  }, [users]);

  // Apply filters
  const filteredUsers = useUserFilters({
    users,
    searchTerm,
  });

  // Apply sorting to filtered users before pagination
  const sortedUsers = React.useMemo(() => {
    if (sorting.length === 0) return filteredUsers;

    const sortedData = [...filteredUsers];
    const sort = sorting[0];

    sortedData.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sort.id === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sort.id === "groups") {
        aValue = a.groups.length;
        bValue = b.groups.length;
      } else if (sort.id === "created_at") {
        // Sort by date (most recent first by default)
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
        return sort.desc ? aDate - bDate : bDate - aDate;
      } else {
        return 0;
      }

      if (aValue < bValue) return sort.desc ? 1 : -1;
      if (aValue > bValue) return sort.desc ? -1 : 1;
      return 0;
    });

    return sortedData;
  }, [filteredUsers, sorting]);

  // Clear selection when search changes or page changes
  React.useEffect(() => {
    setSelectedUsers(new Set());
  }, [searchTerm, currentPage]);

  // Get selected user objects
  const selectedUserObjects = React.useMemo(() => {
    return users.filter((user) => selectedUsers.has(user.name));
  }, [users, selectedUsers]);

  // Bulk operation handlers
  const handleBulkAddToGroup = () => {
    if (selectedUsers.size === 0) {
      toast.error("No users selected");
      return;
    }
    setAddGroupDialogOpen(true);
  };

  const handleBulkRemoveFromGroup = () => {
    if (selectedUsers.size === 0) {
      toast.error("No users selected");
      return;
    }
    setRemoveGroupDialogOpen(true);
  };

  const handleBulkDelete = () => {
    if (selectedUsers.size === 0) {
      toast.error("No users selected");
      return;
    }
    setDeleteConfirmDialogOpen(true);
  };

  const handleAddGroupConfirm = async (groupName: string) => {
    try {
      const usersToUpdate = selectedUserObjects;

      if (usersToUpdate.length === 0) {
        toast.error("No users selected");
        return;
      }

      const usernamesToUpdate = usersToUpdate.map((user) => user.name);
      await handleUserGroupOperation(
        usernamesToUpdate,
        groupName,
        "add",
        async () => {
          setSelectedUsers(new Set());
          await handleRefresh();
        },
      );
    } catch (error) {
      console.error("Failed to add users to group:", error);
    }
  };

  const handleRemoveGroupConfirm = async (groupName: string) => {
    try {
      const usersToUpdate = selectedUserObjects;

      if (usersToUpdate.length === 0) {
        toast.error("No users selected");
        return;
      }

      const usernamesToUpdate = usersToUpdate.map((user) => user.name);
      await handleUserGroupOperation(
        usernamesToUpdate,
        groupName,
        "remove",
        async () => {
          setSelectedUsers(new Set());
          await handleRefresh();
        },
      );
    } catch (error) {
      console.error("Failed to remove users from group:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const usernamesToDelete = selectedUserObjects.map((user) => user.name);
      await handleDeleteUsers(usernamesToDelete, async () => {
        setSelectedUsers(new Set());
        await handleRefresh();
      });
    } catch (error) {
      console.error("Failed to delete users:", error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchUsers();
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Failed to refresh users:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUsersData = await getAllUsers();
      setUsers(fetchedUsersData.users);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch users";
      setError(errorMessage);
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  React.useEffect(() => {
    fetchUsers();
  }, []);

  // Reset to first page when search or items per page changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const handleUserAction = (user: User, action: "editGroups" | "delete") => {
    onUserAction(user, action);
  };

  // Pagination calculations
  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = sortedUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner message="Loading users..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <ErrorDisplay error={error} />
        <Button onClick={fetchUsers} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (isRefreshing) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner message="Refreshing users..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <HeaderStats stats={stats} onUserCreated={handleRefresh} />

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
        <UsersTableCoreWrapper
          users={currentUsers}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          sorting={sorting}
          onSortingChange={setSorting}
          onUserAction={handleUserAction}
          selectedUsers={selectedUsers}
          onSelectionChange={setSelectedUsers}
          selectedUsersCount={selectedUserObjects.length}
          onBulkAddToGroup={handleBulkAddToGroup}
          onBulkRemoveFromGroup={handleBulkRemoveFromGroup}
          onBulkDelete={handleBulkDelete}
          searchTerm={searchTerm}
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
        selectedUsersCount={selectedUserObjects.length}
      />

      <GroupSelectionDialog
        open={removeGroupDialogOpen}
        onOpenChange={setRemoveGroupDialogOpen}
        title="Remove Users from Group"
        description="Select a group to remove the selected users from:"
        onConfirm={handleRemoveGroupConfirm}
        selectedUsersCount={selectedUserObjects.length}
      />

      <BulkDeleteConfirmDialog
        open={deleteConfirmDialogOpen}
        onOpenChange={setDeleteConfirmDialogOpen}
        onConfirm={handleDeleteConfirm}
        selectedUsersCount={selectedUserObjects.length}
        usernames={selectedUserObjects.map((user) => user.name)}
      />
    </div>
  );
}
