"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth-guard";
import { PageLayout } from "@/app/admin/admin-page-layout";
import { UsersTable } from "@/app/admin/users/users-table";
import { EditGroupsDialog } from "@/app/admin/users/edit-groups-dialog";
import { deleteUser } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from "@/lib/types";
import { isFacultyMode } from "@/lib/utils";

const breadcrumbs = [{ label: "Users", href: "/admin/users" }];

export default function AdminUsersPage() {
  const facultyMode = isFacultyMode();
  const [alertOpen, setAlertOpen] = useState(false);
  const [editGroupsOpen, setEditGroupsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedAction, setSelectedAction] = useState<
    "editGroups" | "delete" | null
  >(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = async () => {
    setRefreshKey((prev) => prev + 1);
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleUserAction = (user: User, action: "editGroups" | "delete") => {
    setSelectedUser(user);
    setSelectedAction(action);

    if (action === "editGroups") {
      setEditGroupsOpen(true);
      return;
    }

    // Prevent delete action in faculty mode
    if (action === "delete" && facultyMode) {
      toast.error("User deletion is disabled in faculty mode");
      return;
    }

    setAlertOpen(true);
  };

  const getActionText = () => {
    if (!selectedAction) return "";
    return selectedAction === "delete" ? "delete" : selectedAction;
  };

  const getActionButtonText = () => {
    if (!selectedAction) return "";
    return selectedAction === "delete" ? "Delete" : selectedAction;
  };

  const handleConfirmAction = async () => {
    if (!selectedUser || !selectedAction) return;

    try {
      if (selectedAction === "delete") {
        await deleteUser(selectedUser.name);
        toast.success(
          `User "${selectedUser.name}" has been deleted successfully.`,
        );
      }

      setAlertOpen(false);
      setSelectedUser(null);
      setSelectedAction(null);
      // Trigger a refresh of the users table
      handleRefresh();
    } catch (error) {
      toast.error(
        `Failed to ${getActionText()} user: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  return (
    <AuthGuard adminOnly>
      <PageLayout breadcrumbs={breadcrumbs}>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Users</h1>
              <p className="text-muted-foreground">
                Manage user accounts and permissions
              </p>
            </div>
            <UsersTable
              onUserAction={handleUserAction}
              onRefresh={handleRefresh}
              key={refreshKey}
            />
          </div>
        </div>
      </PageLayout>

      {/* Action Confirmation Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to {getActionText()} &quot;
              {selectedUser?.name}&quot;?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={
                selectedAction === "delete"
                  ? "bg-destructive hover:bg-destructive/90"
                  : ""
              }
            >
              {getActionButtonText()}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Groups Dialog */}
      <EditGroupsDialog
        user={selectedUser}
        open={editGroupsOpen}
        onOpenChange={setEditGroupsOpen}
        onSuccess={handleRefresh}
      />
    </AuthGuard>
  );
}
