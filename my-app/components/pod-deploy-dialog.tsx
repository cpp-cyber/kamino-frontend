"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { Progress } from "@/components/ui/progress"
import { CalendarIcon, Rocket, Server as ServerIcon, Rocket as RocketIcon } from "lucide-react"
import Image from "next/image"
import { VisuallyHidden } from "radix-ui"
import { deployPod } from "@/lib/api"
import { PodTemplate } from "@/lib/types"

interface PodDeployDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedPod: PodTemplate | null
}

function PodDeployProgress() {
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const start = Date.now()
    const duration = 30000 // 30 seconds
    let animationFrame: number

    const updateProgress = () => {
      const elapsed = Date.now() - start
      const percent = Math.min((elapsed / duration) * 100, 100)
      setProgress(percent)
      if (percent < 100) {
        animationFrame = requestAnimationFrame(updateProgress)
      }
    }

    animationFrame = requestAnimationFrame(updateProgress)
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      const redirectDelay = setTimeout(() => {
        router.push("/pods/deployed")
      }, 500)
      return () => clearTimeout(redirectDelay)
    }
  }, [progress, router])

  return <Progress value={progress} className="w-full" />
}

export function PodDeployDialog({ isOpen, onClose, selectedPod }: PodDeployDialogProps) {
  const [deployProgress, setDeployProgress] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)

  const handleConfirmDeploy = async () => {
    if (!selectedPod?.name) return
    
    onClose()
    setDeployProgress(true)
    
    // Show initial toast
    toast.info(`Deploying "${selectedPod.name.replaceAll('_', ' ')}"...`, {
      duration: 2000,
    })
    
    try {
      await deployPod(selectedPod.name)
      console.log(`Successfully deployed pod: ${selectedPod.name}`)
      
      // Show success toast
      toast.success(`Successfully deployed "${selectedPod.name.replaceAll('_', ' ')}"!`, {
        description: "You will be redirected to your deployed pods shortly.",
        duration: 4000,
      })
      
      setTimeout(() => {
        setDeployProgress(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to deploy pod:', error)
      setDeployProgress(false)
      setShowErrorDialog(true)
      
      // Show error toast as well
      toast.error(`Failed to deploy "${selectedPod.name.replaceAll('_', ' ')}"`, {
        description: "Please check the error details for more information.",
        duration: 5000,
      })
    }
  }

  const handleCloseErrorDialog = () => {
    setShowErrorDialog(false)
  }

  return (
    <>
      {/* Details + Deploy Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <VisuallyHidden.Root>
          <DialogTitle>Deploy Pod Template</DialogTitle>
        </VisuallyHidden.Root>
        <DialogContent className="max-w-full md:min-w-2xl p-6 bg-card !duration-0 data-[state=closed]:animate-none data-[state=open]:animate-none" showCloseButton={false}>
        {selectedPod && (
          <div>
            <div className="space-y-6">
            {/* Top section with image, date, and title */}
              <div className="flex gap-4 pb-2">
                {/* Square image */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 rounded-lg border bg-muted overflow-hidden shadow-xl">
                    {selectedPod.image_path ? (
                    <Image 
                      src={`/api/v1/template/image/${selectedPod.image_path}`}
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
                    {selectedPod.name.replaceAll('_', ' ')}
                  </h1>
                </div>
              </div>
                              
              {/* Scrollable description */}
              <div className="space-y-2 ">
                <ScrollArea className="h-[350px] w-full border rounded-xl shadow p-2">
                  <MarkdownRenderer 
                    content={selectedPod.description || 'No description available'} 
                    variant="compact"
                  />
                </ScrollArea>
              </div>
              
              {/* Pod Stats */}
              <div className="mt-auto mb-5">
                <div className="flex items-center rounded-lg bg-muted/50 p-3 shadow">
                  
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
                  <div className="h-6 w-[2px] bg-border" />
                  
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
                className="w-full h-10 text-sm bg-gradient-to-r from-kamino-green to-kamino-yellow font-medium hover:brightness-90 cursor-pointer !text-white"
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
            <AlertDialogTitle>Deploying Pod</AlertDialogTitle>
          </AlertDialogHeader>
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
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              Deployment Failed
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              The pod deployment was unsuccessful.
            </div>
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded border-l-4 border-l-destructive">
              <strong>Troubleshooting tips:</strong>
              <ul className="mt-1 space-y-1">
                <li>• Ensure you are not trying to clone a template that you have already cloned</li>
              </ul>
            </div>
            <AlertDialogFooter>
              <AlertDialogAction onClick={handleCloseErrorDialog}>
                Close
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
