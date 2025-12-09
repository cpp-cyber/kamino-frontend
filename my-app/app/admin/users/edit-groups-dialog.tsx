"use client";

import React, { useState, useEffect } from "react";
import { User, Group } from "@/lib/types";
import { getGroups, updateUserGroups } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "@/components/kibo-ui/tags";

interface EditGroupsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditGroupsDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: EditGroupsDialogProps) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [initialGroups, setInitialGroups] = useState<string[]>([]);
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  // Handle dialog close - reset groups when closed
  const handleDialogOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Dialog is being closed, reset to initial groups
      setSelectedGroups(initialGroups);
    }
    onOpenChange(newOpen);
  };

  // Load available groups when dialog opens
  useEffect(() => {
    if (open) {
      loadGroups();
    }
  }, [open]);

  // Set initial selected groups when user changes
  useEffect(() => {
    if (user) {
      // Extract group names from Group objects
      const groupNames = user.groups.map((g) => g.name);
      setSelectedGroups(groupNames);
      setInitialGroups(groupNames);
    }
  }, [user]);

  const loadGroups = async () => {
    try {
      const response = await getGroups();
      setAvailableGroups(response.groups);
    } catch (error) {
      console.error("Failed to load groups:", error);
      toast.error("Failed to load available groups");
    }
  };

  // Check if a group is protected (initially assigned AND contains "kamino" or "admin" case-insensitive)
  const isProtectedGroup = (groupName: string) => {
    const lowerName = groupName.toLowerCase();
    const hasProtectedKeyword =
      lowerName.includes("kamino") || lowerName.includes("admin");
    const wasInitiallyAssigned = initialGroups.includes(groupName);
    return hasProtectedKeyword && wasInitiallyAssigned;
  };

  const handleRemove = (value: string) => {
    if (!selectedGroups.includes(value)) {
      return;
    }

    // Prevent removal of protected groups
    if (isProtectedGroup(value)) {
      toast.warning(`Cannot remove "${value}" - this is a protected group`);
      return;
    }

    setSelectedGroups((prev) => prev.filter((v) => v !== value));
  };

  const handleSelect = (value: string) => {
    if (selectedGroups.includes(value)) {
      // If trying to deselect a protected group, prevent it
      if (isProtectedGroup(value)) {
        toast.warning(`Cannot remove "${value}" - this is a protected group`);
        return;
      }
      handleRemove(value);
      return;
    }
    setSelectedGroups((prev) => [...prev, value]);
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await updateUserGroups(user.name, selectedGroups);
      toast.success("User groups updated successfully");
      // Update initial groups to new state and close dialog
      setInitialGroups(selectedGroups);
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to update user groups:", error);
      toast.error("Failed to update user groups");
    }
  };

  const handleCancel = () => {
    // Reset to initial groups and close dialog
    setSelectedGroups(initialGroups);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user?.name}</DialogTitle>
          <DialogDescription>
            <span className="text-xs text-muted-foreground">
              Select groups to assign to this user.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <Tags className="w-full">
            <TagsTrigger>
              {selectedGroups.map((groupName) => (
                <TagsValue
                  key={groupName}
                  onRemove={() => handleRemove(groupName)}
                >
                  {groupName}
                </TagsValue>
              ))}
            </TagsTrigger>
            <TagsContent>
              <TagsInput
                onValueChange={setSearchValue}
                placeholder="Search groups..."
              />
              <TagsList>
                <TagsEmpty>No groups found</TagsEmpty>
                <TagsGroup>
                  {availableGroups
                    .filter((group) => !selectedGroups.includes(group.name))
                    .filter((group) =>
                      group.name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()),
                    )
                    .map((group) => (
                      <TagsItem
                        key={group.name}
                        onSelect={handleSelect}
                        value={group.name}
                      >
                        {group.name}
                      </TagsItem>
                    ))}
                </TagsGroup>
              </TagsList>
            </TagsContent>
          </Tags>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Update Groups</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
