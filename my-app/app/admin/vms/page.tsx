"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { PageLayout } from "@/app/admin/admin-page-layout"
import { VMsTable } from "@/app/admin/vms/vms-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { startVM, shutdownVM, rebootVM } from "@/lib/api"

const breadcrumbs = [{ label: "Virtual Machines", href: "/admin/vms" }]

export default function AdminVMsPage() {
  const [alertOpen, setAlertOpen] = useState(false)
  const [selectedVM, setSelectedVM] = useState<{ vmid: number, node: string, action: 'start' | 'shutdown' | 'reboot' } | null>(null)

  const handleVMAction = async (vmid: number, node: string, action: 'start' | 'shutdown' | 'reboot') => {
    setSelectedVM({ vmid, node, action })
    setAlertOpen(true)
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
      setAlertOpen(false)
      setSelectedVM(null)
    } catch (error) {
      toast.error(`Failed to ${selectedVM.action} VM: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setAlertOpen(false)
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
              <h1 className="text-3xl font-bold tracking-tight">Virtual Machines</h1>
              <p className="text-muted-foreground">
                Manage all virtual machines on Proxmox
              </p>
            </div>
            <VMsTable onVMAction={handleVMAction} />
          </div>
        </div>
      </PageLayout>

      {/* VM Action Confirmation Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
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
