import React from "react";
import { MoreVertical, UserPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SortingIcon } from "@/components/table-components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { SortingState } from "@tanstack/react-table";

interface UsersTableCoreProps {
  users: User[];
  searchTerm: string;
  onUserAction: (user: User, action: "editGroups" | "delete") => void;
  selectedUsers: Set<string>;
  onSelectionChange: (selectedUsers: Set<string>) => void;
  selectedUsersCount: number;
  onBulkAddToGroup: () => void;
  onBulkRemoveFromGroup: () => void;
  onBulkDelete: () => void;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
}

export function UsersTableCore({
  users,
  searchTerm,
  onUserAction,
  selectedUsers,
  onSelectionChange,
  selectedUsersCount,
  onBulkDelete,
  sorting,
  onSortingChange,
}: UsersTableCoreProps) {
  const isAllSelected = users.length > 0 && selectedUsers.size === users.length;
  const isSomeSelected =
    selectedUsers.size > 0 && selectedUsers.size < users.length;

  // Selection handlers
  const handleSelectUser = React.useCallback(
    (userName: string, checked: boolean) => {
      const newSelectedUsers = new Set(selectedUsers);
      if (checked) {
        newSelectedUsers.add(userName);
      } else {
        newSelectedUsers.delete(userName);
      }
      onSelectionChange(newSelectedUsers);
    },
    [selectedUsers, onSelectionChange],
  );

  const handleSelectAll = React.useCallback(() => {
    if (isAllSelected) {
      // If all are selected, deselect all
      onSelectionChange(new Set());
    } else {
      // If none or some are selected, select all
      onSelectionChange(new Set(users.map((user) => user.name)));
    }
  }, [isAllSelected, users, onSelectionChange]);

  const handleSortingChange = (columnId: string) => {
    const currentSort = sorting.find((s) => s.id === columnId);
    if (!currentSort) {
      // Not currently sorted, sort ascending
      onSortingChange([{ id: columnId, desc: false }]);
    } else if (!currentSort.desc) {
      // Currently sorted ascending, sort descending
      onSortingChange([{ id: columnId, desc: true }]);
    } else {
      // Currently sorted descending, remove sort
      onSortingChange([]);
    }
  };

  const getSortDirection = (columnId: string): false | "asc" | "desc" => {
    const currentSort = sorting.find((s) => s.id === columnId);
    if (!currentSort) return false;
    return currentSort.desc ? "desc" : "asc";
  };

  return (
    <Table>
      <TableHeader className="bg-muted text-muted-foreground">
        <TableRow>
          <TableHead className="w-[45px] p-4">
            <Checkbox
              checked={isSomeSelected ? "indeterminate" : isAllSelected}
              onCheckedChange={handleSelectAll}
              aria-label="Select all users"
            />
          </TableHead>
          <TableHead className="min-w-[200px]">
            <div className="flex items-center justify-between pr-2 group">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSortingChange("name")}
                className="-ml-3 flex-1 justify-start hover:bg-muted transition-colors"
              >
                <span className="font-medium">Username</span>
              </Button>
              <SortingIcon sortDirection={getSortDirection("name")} />
            </div>
          </TableHead>
          <TableHead className="min-w-[150px]">
            <span className="font-medium">Groups</span>
          </TableHead>
          <TableHead className="w-[20px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={onBulkDelete}
                  className="cursor-pointer text-destructive focus:text-destructive"
                  disabled={selectedUsersCount === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete ({selectedUsersCount})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 && (
          <TableRow key="empty-state">
            <TableCell
              colSpan={4}
              className="text-center py-8 text-muted-foreground"
            >
              {searchTerm
                ? "No users found matching your search."
                : "No users found."}
            </TableCell>
          </TableRow>
        )}
        {users.map((user) => (
          <TableRow key={user.name} className="hover:bg-muted/50">
            <TableCell className="px-4" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedUsers.has(user.name)}
                onCheckedChange={(checked) =>
                  handleSelectUser(user.name, checked as boolean)
                }
                aria-label={`Select ${user.name}`}
              />
            </TableCell>
            <TableCell className="font-medium">
              <div className="truncate">{user.name}</div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {user.groups &&
                user.groups.filter((g) => g && g.trim() !== "").length > 0 ? (
                  user.groups
                    .filter((g) => g && g.trim() !== "")
                    .map((group) => (
                      <Badge
                        key={group}
                        variant="secondary"
                        className="text-xs"
                      >
                        {group}
                      </Badge>
                    ))
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onUserAction(user, "editGroups")}
                    className="cursor-pointer"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Edit Groups
                  </DropdownMenuItem>
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onUserAction(user, "delete")}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
