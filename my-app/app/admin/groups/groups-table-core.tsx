import React from "react";
import { SortingState } from "@tanstack/react-table";
import { Group } from "@/lib/types";
import { GroupsTableCore } from "./groups-table-columns";

interface GroupsTableCoreWrapperProps {
  groups: Group[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  onGroupAction: (groupName: string, action: "delete" | "rename") => void;
  searchTerm: string;
  selectedGroups: string[];
  onSelectGroup: (groupName: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onBulkAction: (action: "delete") => void;
}

export function GroupsTableCoreWrapper({
  groups,
  sorting,
  onSortingChange,
  onGroupAction,
  searchTerm,
  selectedGroups,
  onSelectGroup,
  onSelectAll,
  onBulkAction,
}: GroupsTableCoreWrapperProps) {
  return (
    <GroupsTableCore
      groups={groups}
      searchTerm={searchTerm}
      onGroupAction={onGroupAction}
      selectedGroups={selectedGroups}
      onSelectGroup={onSelectGroup}
      onSelectAll={onSelectAll}
      onBulkAction={onBulkAction}
      sorting={sorting}
      onSortingChange={onSortingChange}
    />
  );
}
