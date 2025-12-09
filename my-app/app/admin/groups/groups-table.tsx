"use client";

import * as React from "react";
import { GetGroupsResponse, Group } from "@/lib/types";
import { getGroups } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { HeaderStats } from "./header-stats";
import { GroupsTableToolbar } from "./groups-table-toolbar";
import { GroupsTableCoreWrapper } from "./groups-table-core";
import { GroupsTablePagination } from "./groups-table-pagination";
import { SortingState } from "@tanstack/react-table";

interface GroupsTableProps {
  onGroupAction: (groupName: string, action: "delete" | "rename") => void;
  onBulkDeleteRequest?: (groupNames: string[]) => void;
}

export function GroupsTable({
  onGroupAction,
  onBulkDeleteRequest,
}: GroupsTableProps) {
  const [groupsData, setGroupsData] = React.useState<GetGroupsResponse>({
    groups: [],
    count: 0,
  });
  const [filteredGroups, setFilteredGroups] = React.useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(25);
  // Sorting state with default sort by created_at (recent to old)
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "created_at", desc: false },
  ]);
  // Multi-select state
  const [selectedGroups, setSelectedGroups] = React.useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = React.useState(false);

  React.useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getGroups();
      setGroupsData(data);
      setFilteredGroups(data.groups);
      setSelectedGroups([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load groups");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const filtered = groupsData.groups.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredGroups(filtered);
    setSelectedGroups([]);
  }, [searchTerm, groupsData]);

  // Apply sorting to filtered groups before pagination
  const sortedGroups = React.useMemo(() => {
    if (sorting.length === 0) return filteredGroups;
    const sortedData = [...filteredGroups];
    const sort = sorting[0];
    sortedData.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      if (sort.id === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sort.id === "user_count") {
        aValue = a.user_count || 0;
        bValue = b.user_count || 0;
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
  }, [filteredGroups, sorting]);

  // Reset to page 1 when search changes or items per page changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Pagination calculations
  const totalItems = sortedGroups.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGroups = sortedGroups.slice(startIndex, endIndex);

  // Selection logic
  const allSelectableGroups = React.useMemo(
    () => paginatedGroups.map((g) => g.name),
    [paginatedGroups],
  );
  const handleSelectGroup = (groupName: string, checked: boolean) => {
    setSelectedGroups((prev) => {
      if (checked) {
        return [...prev, groupName];
      } else {
        return prev.filter((name) => name !== groupName);
      }
    });
  };
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGroups((prev) =>
        Array.from(new Set([...prev, ...allSelectableGroups])),
      );
    } else {
      setSelectedGroups((prev) =>
        prev.filter((name) => !allSelectableGroups.includes(name)),
      );
    }
  };
  const handleBulkAction = async (action: "delete") => {
    if (action === "delete" && selectedGroups.length > 0) {
      if (onBulkDeleteRequest) {
        onBulkDeleteRequest(selectedGroups);
        return;
      }
      // fallback: legacy bulk delete (should not be used)
      setIsBulkDeleting(true);
      try {
        await getGroups(); // Optionally refresh before delete
        await import("@/lib/api").then((api) =>
          api.deleteGroups(selectedGroups),
        );
        setSelectedGroups([]);
        await loadGroups();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete selected groups",
        );
      } finally {
        setIsBulkDeleting(false);
      }
    }
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading || isBulkDeleting) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner
          message={
            isBulkDeleting ? "Deleting selected groups..." : "Loading groups..."
          }
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadGroups} variant="outline">
          Retry
        </Button>
      </div>
    );
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
        <GroupsTableCoreWrapper
          groups={paginatedGroups}
          sorting={sorting}
          onSortingChange={setSorting}
          onGroupAction={onGroupAction}
          searchTerm={searchTerm}
          selectedGroups={selectedGroups}
          onSelectGroup={handleSelectGroup}
          onSelectAll={handleSelectAll}
          onBulkAction={handleBulkAction}
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
  );
}
