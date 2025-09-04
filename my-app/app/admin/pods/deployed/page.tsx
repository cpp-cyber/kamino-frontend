"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { PageLayout } from "@/app/admin/admin-page-layout"
import { DeployedPodsTable } from "@/app/admin/pods/deployed/deployed-pods-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { adminDeletePods, startVM, shutdownVM, rebootVM } from "@/lib/api"
import { DeployedPod } from "@/lib/types"

const breadcrumbs = [{ label: "Deployed Pods", href: "/admin/pods/deployed" }]


export default function AdminPage() {
  const [alertOpen, setAlertOpen] = useState(false)
  const [selectedPod, setSelectedPod] = useState<DeployedPod | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  
  // VM action confirmation state
  const [vmActionAlertOpen, setVmActionAlertOpen] = useState(false)
  const [selectedVM, setSelectedVM] = useState<{ vmid: number, node: string, action: 'start' | 'shutdown' | 'reboot' } | null>(null)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleDeleteClick = (pod: DeployedPod) => {
    setSelectedPod(pod)
    setAlertOpen(true)
  }

  const handleBulkDeleteClick = (pods: DeployedPod[]) => {
    setSelectedPod({ name: `${pods.length} pods`, vms: [] } as DeployedPod)
    setAlertOpen(true)
    setSelectedPods(pods)
  }

  const [selectedPods, setSelectedPods] = useState<DeployedPod[]>([])

  const handleConfirmDelete = async () => {
    if (!selectedPod) return
    
    setIsDeleting(true)
    try {
      if (selectedPods.length > 0) {
        // Bulk delete
        const podNames = selectedPods.map(pod => pod.name)
        await adminDeletePods(podNames)
        toast.success(`${selectedPods.length} pods have been deleted.`)
        setSelectedPods([])
      } else {
        // Single delete
        await adminDeletePods([selectedPod.name])
        toast.success(`Pod "${selectedPod.name}" has been queued for deletion and will be removed shortly.`)
      }
      setAlertOpen(false)
      setSelectedPod(null)
    } catch (error) {
      toast.error(`Failed to delete pod(s): ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleVMAction = async (vmid: number, node: string, action: 'start' | 'shutdown' | 'reboot') => {
    setSelectedVM({ vmid, node, action })
    setVmActionAlertOpen(true)
  }

  const handleConfirmVMAction = async () => {
    if (!selectedVM) return
    
    try {
      if (selectedVM.action === 'start') {
        await startVM(selectedVM.vmid, selectedVM.node)
        toast.success(`VM ${selectedVM.vmid} is starting...`)
      } else if (selectedVM.action === 'shutdown') {
        await shutdownVM(selectedVM.vmid, selectedVM.node)
        toast.success(`VM ${selectedVM.vmid} is shutting down...`)
      } else if (selectedVM.action === 'reboot') {
        await rebootVM(selectedVM.vmid, selectedVM.node)
        toast.success(`VM ${selectedVM.vmid} is rebooting...`)
      }
      setVmActionAlertOpen(false)
      setSelectedVM(null)
    } catch (error) {
      toast.error(`Failed to ${selectedVM.action} VM: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setVmActionAlertOpen(false)
      setSelectedVM(null)
    }
  }

  return (
    <AuthGuard adminOnly>
      <PageLayout
        breadcrumbs={breadcrumbs}
      >
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Deployed Pods</h1>
              <p className="text-muted-foreground">
                Manage all deployed pods hosted on Proxmox
              </p>
            </div>
            <DeployedPodsTable 
              onDelete={handleDeleteClick} 
              onBulkDelete={handleBulkDeleteClick} 
              onVMAction={handleVMAction} 
              onRefresh={handleRefresh}
              key={refreshKey}
            />
          </div>
        </div>
      </PageLayout>

      {/* Delete Confirmation Dialog (single or bulk) */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedPods.length > 1
                ? `Are you sure you want to delete these ${selectedPods.length} pods?`
                : `Are you sure you want to delete "${selectedPod?.name}"?`}
            </AlertDialogTitle>
          </AlertDialogHeader>
          {selectedPods.length > 1 && (
            <div className="max-h-40 overflow-y-auto mb-2 text-sm text-muted-foreground">
              {selectedPods.map(pod => (
                <div key={pod.name} className="truncate">{pod.name}</div>
              ))}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting
                ? "Deleting..."
                : selectedPods.length > 0
                  ? `Delete (${selectedPods.length})`
                  : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* VM Action Confirmation Dialog */}
      <AlertDialog open={vmActionAlertOpen} onOpenChange={setVmActionAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to {selectedVM?.action} VM &quot;{selectedVM?.vmid}&quot;?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmVMAction} 
              className={selectedVM?.action === 'shutdown' ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {selectedVM?.action === 'start' ? 'Start' : selectedVM?.action === 'shutdown' ? 'Shutdown' : 'Reboot'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthGuard>
  )
}
