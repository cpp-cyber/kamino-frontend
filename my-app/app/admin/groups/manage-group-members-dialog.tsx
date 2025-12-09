"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  getAllUsers,
  getGroups,
  addUsersToGroups,
  removeUsersFromGroups,
} from "@/lib/api";
import { User, Group } from "@/lib/types";
import { Users, UserPlus, UserMinus } from "lucide-react";

interface ManageGroupMembersDialogProps {
  onMembersUpdated?: () => void;
  trigger?: React.ReactNode;
}

type Operation = "add" | "remove";

export function ManageGroupMembersDialog({
  onMembersUpdated,
  trigger,
}: ManageGroupMembersDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [operation, setOperation] = useState<Operation>("add");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const hasLoadedDataRef = useRef(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Load data when dialog opens
  useEffect(() => {
    if (isDialogOpen && !hasLoadedDataRef.current) {
      console.log("Loading data for manage group members dialog...");
      hasLoadedDataRef.current = true;
      setIsLoading(true);
      Promise.all([getAllUsers(), getGroups()])
        .then(([usersRes, groupsRes]) => {
          console.log("Data loaded successfully:", {
            users: usersRes.users.length,
            groups: groupsRes.groups.length,
          });
          setUsers(usersRes.users);
          setGroups(groupsRes.groups);
        })
        .catch((error) => {
          console.error("Failed to load data:", error);
          toast.error("Failed to load users and groups");
          hasLoadedDataRef.current = false;
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isDialogOpen]);

  // Filter users based on search and operation
  const filteredUsers = users.filter((user) => {
    // Apply search filter
    if (!user.name.toLowerCase().includes(userSearch.toLowerCase())) {
      return false;
    }

    // If no group selected, show all users matching search
    if (!selectedGroup) {
      return true;
    }

    // Filter based on operation
    if (operation === "add") {
      // Show users NOT in the selected group
      return !user.groups.some((group) => group.name === selectedGroup);
    } else {
      // Show users IN the selected group
      return user.groups.some((group) => group.name === selectedGroup);
    }
  });

  // Select all state helpers
  const filteredUserNames = filteredUsers.map((user) => user.name);
  const allUsersSelected =
    filteredUserNames.length > 0 &&
    filteredUserNames.every((name) => selectedUsers.includes(name));

  const handleUserToggle = (username: string) => {
    setSelectedUsers((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username],
    );
  };

  const handleSelectAllUsers = () => {
    const filteredUserNames = filteredUsers.map((user) => user.name);
    const allSelected = filteredUserNames.every((name) =>
      selectedUsers.includes(name),
    );

    if (allSelected) {
      // Remove all filtered users from selection
      setSelectedUsers((prev) =>
        prev.filter((name) => !filteredUserNames.includes(name)),
      );
    } else {
      // Add all filtered users to selection
      const newSelection = [
        ...new Set([...selectedUsers, ...filteredUserNames]),
      ];
      setSelectedUsers(newSelection);
    }
  };

  const resetForm = () => {
    setOperation("add");
    setSelectedGroup("");
    setSelectedUsers([]);
    setUserSearch("");
    hasLoadedDataRef.current = false;
  };

  const handleOperationChange = (value: Operation) => {
    setOperation(value);
    setSelectedUsers([]); // Clear selection when switching operation
  };

  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    setSelectedUsers([]); // Clear selection when switching group
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGroup) {
      toast.error("Please select a group");
      return;
    }

    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }

    setIsSubmitting(true);

    try {
      if (operation === "add") {
        await addUsersToGroups(selectedUsers, selectedGroup);
        toast.success(
          `Successfully added ${selectedUsers.length} user${selectedUsers.length !== 1 ? "s" : ""} to ${selectedGroup}`,
        );
      } else {
        await removeUsersFromGroups(selectedUsers, selectedGroup);
        toast.success(
          `Successfully removed ${selectedUsers.length} user${selectedUsers.length !== 1 ? "s" : ""} from ${selectedGroup}`,
        );
      }

      // Refresh data
      const [usersRes, groupsRes] = await Promise.all([
        getAllUsers(),
        getGroups(),
      ]);
      setUsers(usersRes.users);
      setGroups(groupsRes.groups);

      // Reset form and close dialog
      resetForm();
      setIsDialogOpen(false);

      if (onMembersUpdated) {
        onMembersUpdated();
      }
    } catch (error) {
      console.error("Failed to update group members:", error);
      if (error instanceof Error) {
        toast.error(`Failed to ${operation} users: ${error.message}`);
      } else {
        toast.error(`Failed to ${operation} users`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Users className="size-4 mr-2" />
            Manage Members
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Group Members</DialogTitle>
          <DialogDescription>
            Add or remove users from a group in bulk
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-auto space-y-2">
            {/* Operation and Group Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operation">Operation</Label>
                <Select
                  value={operation}
                  onValueChange={handleOperationChange}
                  disabled={isSubmitting || isLoading}
                >
                  <SelectTrigger id="operation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">
                      <div className="flex items-center gap-2">
                        <UserPlus className="size-4" />
                        Add Users
                      </div>
                    </SelectItem>
                    <SelectItem value="remove">
                      <div className="flex items-center gap-2">
                        <UserMinus className="size-4" />
                        Remove Users
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Group</Label>
                <Select
                  value={selectedGroup}
                  onValueChange={handleGroupChange}
                  disabled={isSubmitting || isLoading}
                >
                  <SelectTrigger id="group" className="w-full">
                    <SelectValue
                      placeholder={
                        isLoading ? "Loading groups..." : "Select group..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.name} value={group.name}>
                        <div className="flex items-center justify-between gap-2">
                          <span>{group.name}</span>
                          {group.user_count !== undefined && (
                            <Badge
                              variant="outline"
                              className="text-muted-foreground"
                            >
                              {group.user_count}
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* User Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Select Users ({selectedUsers.length} selected)
                </Label>
                {filteredUsers.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAllUsers}
                    className="h-6 px-2 text-xs hover:bg-muted"
                    disabled={isSubmitting || isLoading}
                  >
                    {allUsersSelected ? "Deselect All" : "Select All"}
                    {userSearch && ` (${filteredUsers.length})`}
                  </Button>
                )}
              </div>

              {isLoading ? (
                <LoadingSpinner message="Loading users..." />
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <div className="border-b bg-muted/50 p-3">
                    <Input
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="h-8 border-0 bg-background shadow-none focus-visible:ring-1"
                      disabled={isSubmitting}
                    />
                  </div>
                  <ScrollArea className="h-92">
                    <div className="p-2 space-y-3">
                      {!selectedGroup ? (
                        <div className="text-sm text-muted-foreground text-center py-8">
                          Please select a group first
                        </div>
                      ) : filteredUsers.length === 0 ? (
                        <div className="text-sm text-muted-foreground text-center py-8">
                          {userSearch
                            ? "No users found matching your search"
                            : operation === "add"
                              ? "All users are already in this group"
                              : "No users in this group"}
                        </div>
                      ) : (
                        filteredUsers.map((user) => (
                          <div
                            key={user.name}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`user-${user.name}`}
                              checked={selectedUsers.includes(user.name)}
                              onCheckedChange={() =>
                                handleUserToggle(user.name)
                              }
                              disabled={isSubmitting}
                            />
                            <Label
                              htmlFor={`user-${user.name}`}
                              className="text-sm cursor-pointer flex-1 leading-5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium px-2">
                                  {user.name}
                                </span>
                                <div className="flex gap-2 flex-wrap justify-end">
                                  {user.groups.slice(0, 3).map((group) => (
                                    <Badge
                                      key={group.name}
                                      variant="outline"
                                      className="text-muted-foreground"
                                    >
                                      {group.name}
                                    </Badge>
                                  ))}
                                  {user.groups.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-muted-foreground"
                                    >
                                      +{user.groups.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                ref={closeButtonRef}
                variant="outline"
                type="button"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !selectedGroup ||
                selectedUsers.length === 0 ||
                isLoading
              }
            >
              {isSubmitting ? (
                "Processing..."
              ) : (
                <>
                  {operation === "add" ? (
                    <>
                      <UserPlus className="size-4 mr-2" />
                      Add {selectedUsers.length} User
                      {selectedUsers.length !== 1 ? "s" : ""}
                    </>
                  ) : (
                    <>
                      <UserMinus className="size-4 mr-2" />
                      Remove {selectedUsers.length} User
                      {selectedUsers.length !== 1 ? "s" : ""}
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
