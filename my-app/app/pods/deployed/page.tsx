"use client"

import { useState } from "react"
import { toast } from "sonner"
import { PageLayout } from "@/components/user-page-layout"
import { AuthGuard } from "@/components/auth-guard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorDisplay } from "@/components/ui/error-display"
import { useApiState } from "@/hooks/use-api-state"
import { deletePod, getDeployedPods } from "@/lib/api"
import { DeployedPod } from "@/lib/types"
import { SectionCards } from "@/app/pods/deployed/deployed-pods-cards"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Page() {
  const [alertOpen, setAlertOpen] = useState(false)
  const [selectedPod, setSelectedPod] = useState<DeployedPod | null>(null)
  const { data: pods, loading, error } = useApiState({
    fetchFn: getDeployedPods,
  })

  const handleDeleteClick = (pod: DeployedPod) => {
    setSelectedPod(pod)
    setAlertOpen(true)
  }

  const handleConfirmDelete = () => {
    setAlertOpen(false)
    if (selectedPod) {
      deletePod(selectedPod.name)
      console.log(`Destroying pod: ${selectedPod.name}`)
      // Show toast notification
      toast.success(`Pod "${selectedPod.name}" has been queued for deletion and will be removed shortly.`)
    }
  }

  const pageHeader = (
    <div className="flex flex-col items-center justify-center min-h-[125px] text-center">
      <h1 className="text-4xl font-bold text-primary">Deployed Pods</h1>
      <p className="text-primary/90 mt-2">
        Browse and manage your deployed pod instances.
      </p>
    </div>
  )

  return (
    <AuthGuard>
      <PageLayout header={pageHeader} showGradientBackground={true}>
        {loading && <LoadingSpinner message="Loading deployed pods..." />}
        {error && <ErrorDisplay error={error} />}
        {!loading && !error && pods && (
          <SectionCards pods={pods} onDelete={handleDeleteClick} />
        )}

        {/* Confirm popup */}
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete &quot;{selectedPod?.name}&quot;?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PageLayout>
    </AuthGuard>
  )
}
