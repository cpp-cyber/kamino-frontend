"use client"

import { PageLayout } from "@/components/user-page-layout"
import { AuthGuard } from "@/components/auth-guard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorDisplay } from "@/components/ui/error-display"
import { useApiState } from "@/hooks/use-api-state"
import { SectionCards } from "@/app/pods/templates/pod-templates-cards"
import { getPodTemplates } from "@/lib/api"
import { PodDeployDialog } from "@/components/pod-deploy-dialog"
import { usePodDeployment } from "@/hooks/use-pod-deployment"

export default function Page() {
  const { isDialogOpen, selectedPod, openDeployDialog, closeDeployDialog } = usePodDeployment()
  
  const { data: pods, loading, error } = useApiState({
    fetchFn: getPodTemplates,
  })

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
          <SectionCards pods={pods} onDeploy={openDeployDialog} />
        )}
        
        {/* Centralized Deploy Dialog */}
        <PodDeployDialog 
          isOpen={isDialogOpen}
          onClose={closeDeployDialog}
          selectedPod={selectedPod}
        />
      </PageLayout>
    </AuthGuard>
  )
}
