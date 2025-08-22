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
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getPodTemplates, deployPod } from "@/lib/api"
import { PodTemplate } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { CalendarIcon, Rocket, Server as ServerIcon, Rocket as RocketIcon } from "lucide-react"
import Image from "next/image"
import { VisuallyHidden } from "radix-ui"

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
      setTimeout(() => {
        setDeployProgress(false)
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
        {/* <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
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
        </AlertDialog> */}

        <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
          <VisuallyHidden.Root>
            <DialogTitle>Your dialog title</DialogTitle>
          </VisuallyHidden.Root>
          <DialogContent className="max-w-full md:min-w-2xl min-h-[60vh] p-6 bg-card">
          {selectedPod && (
            <div>
              <div className="space-y-6">
              {/* Top section with image, date, and title */}
                <div className="flex gap-4">
                  {/* Square image */}
                  <div className="flex-shrink-0">
                  <div className="w-48 h-48 rounded-lg border bg-muted overflow-hidden shadow-lg">
                    {selectedPod.image_path ? (
                    <Image 
                      src={`/api/proxmox/templates/images/${selectedPod.image_path}`}
                      alt={selectedPod.name}
                      className="w-full h-full object-cover"
                      unoptimized
                      width={192}
                      height={192}
                    />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      No Image
                    </div>
                    )}
                  </div>
                </div>
                  
                  {/* Date and title */}
                  <div className="flex-1 flex flex-col justify-center">
                  {selectedPod.created_at && (
                    <p className="flex items-center text-xs text-muted-foreground">
                    <CalendarIcon className="mr-1.5 h-4 w-4" />
                    {new Date(selectedPod.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    </p>
                  )}
                  <h1 className="text-4xl font-semibold leading-tight text-wrap">
                    {selectedPod.name}
                  </h1>
                  </div>
                </div>
                
                
                {/* Scrollable description */}
                <div className="space-y-2">
                  <ScrollArea className="h-100 w-full p-3 rounded-md text-lg text-muted-foreground leading-relaxed overflow-hidden">
                  <MarkdownRenderer 
                    content={selectedPod.description || 'No description available'} 
                    variant="compact"
                  />
                  </ScrollArea>
                </div>
                
                {/* Pod Stats */}
                <div className="mt-auto mb-5">
                  <div className="flex items-center rounded-lg bg-muted/50 p-3">
                    
                    {/* VMs */}
                    <div className="flex-1 flex justify-center">
                      <div className="flex flex-col items-center text-center">
                        <div className="text-sm font-bold mb-1">{selectedPod.vm_count}</div>
                        <div className="flex items-center space-x-1">
                          <ServerIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {(selectedPod.vm_count || 0) === 1 ? "VM" : "VMs"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="h-6 w-px bg-border" />
                    
                    {/* Deployments */}
                    <div className="flex-1 flex justify-center">
                      <div className="flex flex-col items-center text-center">
                        <div className="text-sm font-bold mb-1">{selectedPod.deployments}</div>
                        <div className="flex items-center space-x-1">
                          <RocketIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {selectedPod.deployments === 1 ? "Deployment" : "Deployments"}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
                
              {/* Bottom buttons */}
              <div className="flex justify-end gap-2">
                <Button 
                onClick={handleConfirmDeploy}
                size="sm"
                className="w-full h-10"
                >
                <Rocket />
                Deploy
                </Button>
              </div>
            </div>
            )}
            </DialogContent>
        </Dialog>
        
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
