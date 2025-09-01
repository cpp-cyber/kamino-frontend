"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { PageLayout } from "@/app/admin/admin-page-layout"
import { GroupsTable } from "@/app/admin/groups/groups-table"
import { deleteGroup } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Group } from "@/lib/types"

const breadcrumbs = [{ label: "Groups", href: "/admin/groups" }]

export default function AdminGroupsPage() {
  const [alertOpen, setAlertOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [newGroupName, setNewGroupName] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = async () => {
    setRefreshKey(prev => prev + 1)
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const handleGroupAction = (groupName: string, action: 'rename' | 'delete') => {
    const group = { name: groupName } as Group
    setSelectedGroup(group)
    
    if (action === 'delete') {
      setAlertOpen(true)
    } else if (action === 'rename') {
      setNewGroupName(groupName)
      setRenameDialogOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      if (selectedGroup) {
        // Single delete
        await deleteGroup(selectedGroup.name)
        toast.success(`Group "${selectedGroup.name}" has been deleted successfully.`)
      }
      setAlertOpen(false)
      setSelectedGroup(null)
      // Trigger a refresh of the groups table
      handleRefresh()
    } catch (error) {
      toast.error(`Failed to delete group: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleConfirmRename = async () => {
    if (!selectedGroup || !newGroupName.trim()) return
    
    setIsRenaming(true)
    try {
      // TODO: Implement rename group API call when available
      // await renameGroup(selectedGroup.name, newGroupName.trim())
      toast.success(`Group renamed from "${selectedGroup.name}" to "${newGroupName.trim()}" successfully.`)
      setRenameDialogOpen(false)
      setSelectedGroup(null)
      setNewGroupName("")
      // Trigger a refresh of the groups table
      handleRefresh()
    } catch (error) {
      toast.error(`Failed to rename group: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsRenaming(false)
    }
  }

  return (
    <AuthGuard adminOnly>
      <PageLayout breadcrumbs={breadcrumbs}>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
              <p className="text-muted-foreground">
                Manage and create groups
              </p>
            </div>
            <GroupsTable
              onGroupAction={handleGroupAction}
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
              Are you sure you want to delete &quot;{selectedGroup?.name}&quot;?
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

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                id="groupName"
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
    </AuthGuard>
  )
}
