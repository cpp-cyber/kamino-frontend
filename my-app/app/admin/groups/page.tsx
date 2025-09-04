"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { PageLayout } from "@/app/admin/admin-page-layout"
import { GroupsTable } from "@/app/admin/groups/groups-table"
import { deleteGroups, renameGroup } from "@/lib/api"
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
import { Label } from "@/components/ui/label"
import { Group } from "@/lib/types"
import { validateGroupName, filterGroupNameInput, GroupNameValidationResult } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const breadcrumbs = [{ label: "Groups", href: "/admin/groups" }]

export default function AdminGroupsPage() {
  const [alertOpen, setAlertOpen] = useState(false)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [bulkDeleteGroups, setBulkDeleteGroups] = useState<string[]>([])
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [newGroupName, setNewGroupName] = useState("")
  const [renameValidation, setRenameValidation] = useState<GroupNameValidationResult>({ isValid: true, errors: [] })
  const [isRenaming, setIsRenaming] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = async () => {
    setRefreshKey(prev => prev + 1)
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const handleRenameInputChange = (value: string) => {
    const filtered = filterGroupNameInput(value)
    setNewGroupName(filtered)
    setRenameValidation(validateGroupName(filtered))
  }

  const handleGroupAction = (groupName: string, action: 'rename' | 'delete') => {
    const group = { name: groupName } as Group
    setSelectedGroup(group)
    if (action === 'delete') {
      setAlertOpen(true)
    } else if (action === 'rename') {
      setNewGroupName(groupName)
      setRenameValidation(validateGroupName(groupName))
      setRenameDialogOpen(true)
    }
  }

  // Bulk delete handler called from GroupsTable
  const handleBulkDeleteRequest = (groupNames: string[]) => {
    setBulkDeleteGroups(groupNames)
    setBulkDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      if (selectedGroup) {
        // Single delete
        await deleteGroups([selectedGroup.name])
        toast.success(`Group "${selectedGroup.name}" has been deleted successfully.`)
      }
      setAlertOpen(false)
      setSelectedGroup(null)
      // Trigger a refresh of the groups table
      handleRefresh()
    } catch (error) {
      toast.error(`Failed to delete group: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleConfirmBulkDelete = async () => {
    if (!bulkDeleteGroups.length) return
    setIsBulkDeleting(true)
    try {
      await deleteGroups(bulkDeleteGroups)
      toast.success(`${bulkDeleteGroups.length} group(s) deleted successfully.`)
      setBulkDeleteDialogOpen(false)
      setBulkDeleteGroups([])
      handleRefresh()
    } catch (error) {
      toast.error(`Failed to delete groups: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsBulkDeleting(false)
    }
  }

  const handleConfirmRename = async () => {
    if (!selectedGroup || !newGroupName.trim()) return
    
    const validation = validateGroupName(newGroupName)
    if (!validation.isValid) {
      toast.error(validation.errors[0])
      return
    }
    
    setIsRenaming(true)
    try {
      await renameGroup(selectedGroup.name, newGroupName.trim())
      toast.success(`Group renamed from "${selectedGroup.name}" to "${newGroupName.trim()}" successfully.`)
      setRenameDialogOpen(false)
      setSelectedGroup(null)
      setNewGroupName("")
      setRenameValidation({ isValid: true, errors: [] })
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
              onBulkDeleteRequest={handleBulkDeleteRequest}
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
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete these {bulkDeleteGroups.length} groups?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="max-h-40 overflow-y-auto mb-2 text-sm text-muted-foreground">
            {bulkDeleteGroups.map(name => (
              <div key={name} className="truncate">{name}</div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmBulkDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isBulkDeleting}
            >
              {isBulkDeleting ? "Deleting..." : `Delete (${bulkDeleteGroups.length})`}
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
              <Label htmlFor="groupName">New Group Name</Label>
              <Input
                id="groupName"
                value={newGroupName}
                onChange={(e) => handleRenameInputChange(e.target.value)}
                placeholder="Enter new group name"
                disabled={isRenaming}
                className={!renameValidation.isValid ? "border-destructive" : ""}
              />
              {!renameValidation.isValid && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {renameValidation.errors[0]}
                  </AlertDescription>
                </Alert>
              )}
              <div className="text-xs text-muted-foreground">
                Max 63 characters. Only letters, numbers, hyphens, and underscores allowed.
              </div>
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
              disabled={isRenaming || !newGroupName.trim() || !renameValidation.isValid}
            >
              {isRenaming ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthGuard>
  )
}
