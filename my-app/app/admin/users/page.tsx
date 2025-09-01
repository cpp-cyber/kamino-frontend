"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { PageLayout } from "@/app/admin/admin-page-layout"
import { UsersTable } from "@/app/admin/users/users-table"
import { deleteUser } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { User } from "@/lib/types"

const breadcrumbs = [{ label: "Users", href: "/admin/users" }]

export default function AdminUsersPage() {
  const [alertOpen, setAlertOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = async () => {
    setRefreshKey(prev => prev + 1)
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user)
    setAlertOpen(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      if (selectedUser) {
        // Single delete
        await deleteUser(selectedUser.name)
        toast.success(`User "${selectedUser.name}" has been deleted successfully.`)
      }
      setAlertOpen(false)
      setSelectedUser(null)
      // Trigger a refresh of the users table
      handleRefresh()
    } catch (error) {
      toast.error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDeleting(false)
    }
  }

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
              onDelete={handleDeleteClick} 
              onRefresh={handleRefresh}
              key={refreshKey}
            />
          </div>
        </div>
      </PageLayout>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete &quot;{selectedUser?.name}&quot;?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthGuard>
  )
}
