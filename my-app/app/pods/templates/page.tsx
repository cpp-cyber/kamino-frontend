"use client"

import { useState } from "react"
import { PageLayout } from "@/components/user-page-layout"
import { AuthGuard } from "@/components/auth-guard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorDisplay } from "@/components/ui/error-display"
import { useApiState } from "@/hooks/use-api-state"
import { PodDeployProgress } from "./progress-bar"
import { SectionCards } from "@/app/pods/templates/pod-templates-cards"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { getPodTemplates, deployPod } from "@/lib/api"
import { PodTemplate } from "@/lib/types"

export default function Page() {
  const [alertOpen, setAlertOpen] = useState(false)
  const [deployProgress, setDeployProgress] = useState(false)
  const [selectedPod, setSelectedPod] = useState<PodTemplate | null>(null)
  const [deployError, setDeployError] = useState<string | null>(null)
  const { data: pods, loading, error } = useApiState({
    fetchFn: getPodTemplates,
  })

  const handleDeployClick = (pod: PodTemplate) => {
    setSelectedPod(pod)
    setAlertOpen(true)
  }

  const handleConfirmDeploy = async () => {
    if (!selectedPod?.name) return
    
    setAlertOpen(false)
    setDeployProgress(true)
    setDeployError(null)
    
    try {
      await deployPod(selectedPod.name)
      console.log(`Successfully deployed pod: ${selectedPod.name}`)
      // Optionally redirect to deployed pods page or show success message
      setTimeout(() => {
        setDeployProgress(false)
        // You can add navigation here, e.g., router.push('/pods/deployed')
      }, 2000)
    } catch (error) {
      console.error('Failed to deploy pod:', error)
      setDeployError(error instanceof Error ? error.message : 'Failed to deploy pod')
      setDeployProgress(false)
    }
  }

  const pageHeader = (
    <div className="flex flex-col items-center justify-center min-h-[125px] text-center">
      <h1 className="text-4xl font-bold text-primary">Pod Templates</h1>
      <p className="text-primary/90 mt-2">
      Browse and deploy your own instance of our curated interactive pod environments.
      </p>
    </div>
  )
  

  return (
    <AuthGuard>
      <PageLayout header={pageHeader} showGradientBackground={true}>
        {loading && <LoadingSpinner message="Loading pod templates..." />}
        {error && <ErrorDisplay error={error} />}
        {!loading && !error && pods && (
          <SectionCards pods={pods} onDeploy={handleDeployClick} />
        )}
        
        {/* Confirm popup */}
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Deploy {selectedPod?.name || 'this pod'}?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDeploy}>
                Deploy
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Deployment progress popup */}
        <AlertDialog open={deployProgress} onOpenChange={setDeployProgress}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {deployError ? 'Deployment Failed' : 'Deploying Pod'}
              </AlertDialogTitle>
            </AlertDialogHeader>
            {deployError ? (
              <div className="space-y-4">
                <AlertDialogDescription className="text-destructive">
                  {deployError}
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogAction onClick={() => setDeployProgress(false)}>
                    Close
                  </AlertDialogAction>
                </AlertDialogFooter>
              </div>
            ) : (
              <div className="space-y-4">
                <AlertDialogDescription>
                  You will automatically be taken to your pod once it is deployed.
                </AlertDialogDescription>
                <div className="p-2">
                  <div className="flex justify-center">
                    <div className="w-full max-w-md">
                      <PodDeployProgress />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AlertDialogContent>
        </AlertDialog>
      </PageLayout>
    </AuthGuard>
  )
}
