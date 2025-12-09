"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { PageLayout } from "@/app/admin/admin-page-layout";
import { GroupsTable } from "@/app/admin/groups/groups-table";
import { handleDeleteGroups } from "@/lib/admin-operations";
import { renameGroup } from "@/lib/api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Group } from "@/lib/types";

const breadcrumbs = [{ label: "Groups", href: "/admin/groups" }];

export default function AdminGroupsPage() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [bulkDeleteGroups, setBulkDeleteGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = async () => {
    setRefreshKey((prev) => prev + 1);
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleGroupAction = (
    groupName: string,
    action: "delete" | "rename",
  ) => {
    const group = { name: groupName } as Group;
    if (action === "delete") {
      setSelectedGroup(group);
      setAlertOpen(true);
    } else if (action === "rename") {
      setSelectedGroup(group);
      setNewGroupName(groupName);
      setRenameDialogOpen(true);
    }
  };

  // Bulk delete handler called from GroupsTable
  const handleBulkDeleteRequest = (groupNames: string[]) => {
    setBulkDeleteGroups(groupNames);
    setBulkDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedGroup) {
        // Single delete
        await handleDeleteGroups([selectedGroup.name], () => {
          setAlertOpen(false);
          setSelectedGroup(null);
          handleRefresh();
        });
      }
    } catch (error) {
      // Error handling is done in the centralized function
      console.error("Failed to delete group:", error);
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (!bulkDeleteGroups.length) return;
    setIsBulkDeleting(true);
    try {
      await handleDeleteGroups(bulkDeleteGroups, () => {
        setBulkDeleteDialogOpen(false);
        setBulkDeleteGroups([]);
        handleRefresh();
      });
    } catch (error) {
      // Error handling is done in the centralized function
      console.error("Failed to delete groups:", error);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleConfirmRename = async () => {
    if (!selectedGroup || !newGroupName.trim()) return;
    if (newGroupName.trim() === selectedGroup.name) {
      toast.error("New name must be different from current name");
      return;
    }
    setIsRenaming(true);
    try {
      await renameGroup(selectedGroup.name, newGroupName.trim());
      toast.success(
        `Group renamed from "${selectedGroup.name}" to "${newGroupName.trim()}"`,
      );
      setRenameDialogOpen(false);
      setSelectedGroup(null);
      setNewGroupName("");
      handleRefresh();
    } catch (error) {
      toast.error(
        `Failed to rename group: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      console.error("Failed to rename group:", error);
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <AuthGuard adminOnly>
      <PageLayout breadcrumbs={breadcrumbs}>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
              <p className="text-muted-foreground">Manage and create groups</p>
            </div>
            <GroupsTable
              onGroupAction={handleGroupAction}
              onBulkDeleteRequest={handleBulkDeleteRequest}
              key={refreshKey}
            />
          </div>
        </div>
      </PageLayout>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Group</DialogTitle>
            <DialogDescription>
              Enter a new name for &quot;{selectedGroup?.name}&quot;
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">New Group Name</Label>
              <Input
                id="name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter new group name"
                disabled={isRenaming}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRenameDialogOpen(false)}
              disabled={isRenaming}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRename}
              disabled={isRenaming || !newGroupName.trim()}
            >
              {isRenaming ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete &quot;{selectedGroup?.name}&quot;?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete these {bulkDeleteGroups.length}{" "}
              groups?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="max-h-40 overflow-y-auto mb-2 text-sm text-muted-foreground">
            {bulkDeleteGroups.map((name) => (
              <div key={name} className="truncate">
                {name}
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBulkDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isBulkDeleting}
            >
              {isBulkDeleting
                ? "Deleting..."
                : `Delete (${bulkDeleteGroups.length})`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthGuard>
  );
}
