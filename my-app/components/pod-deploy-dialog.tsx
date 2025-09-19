"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { Progress } from "@/components/ui/progress"
import { CalendarIcon, Rocket, Server as ServerIcon, Rocket as RocketIcon, User } from "lucide-react"
import Image from "next/image"
import { VisuallyHidden } from "radix-ui"
import { handleUserPodDeployment } from "@/lib/admin-operations"
import { PodTemplate } from "@/lib/types"
import { formatPodName } from "@/lib/utils"
import { Separator } from "./ui/separator"

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
    const duration = 180000 // 3 minutes (180 seconds) - increased for cloning operations
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
    
    try {
      await handleUserPodDeployment(
        selectedPod.name,
        () => {
          // Success: Just hide progress after a short delay
          setTimeout(() => {
            setDeployProgress(false)
          }, 2000)
        },
        () => {
          // Error: Show error dialog and hide progress
          setDeployProgress(false)
          setShowErrorDialog(true)
        }
      )
    } catch (error) {
      // Fallback error handling
      console.error('Deployment failed:', error)
      setDeployProgress(false)
      setShowErrorDialog(true)
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
        <DialogContent className="max-w-full md:min-w-2xl max-h-[100vh] p-6 bg-card !duration-0 data-[state=closed]:animate-none data-[state=open]:animate-none overflow-hidden flex flex-col">
        {selectedPod && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* Top section with image, date, and title */}
              <div className="flex gap-4">
                {/* Square image */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 rounded-lg border bg-muted overflow-hidden shadow-xl">
                    <Image 
                      src={selectedPod.image_path ? `/api/v1/template/image/${selectedPod.image_path}` : '/kaminoLogo.svg'}
                      alt={selectedPod.name}
                      className="w-full h-full object-cover"
                      unoptimized
                      width={192}
                      height={192}
                    />
                  </div>
                </div>
                
                {/* Date, title, & authors */}
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
                  <h1 className="text-4xl font-semibold leading-tight text-wrap py-2">
                    {formatPodName(selectedPod.name)}
                  </h1>
                  {selectedPod.authors && (
                    <div className="flex items-center text-sm">
                      <User className="text-muted-foreground mr-1.5 size-4" />
                      <span className="text-muted-foreground">{selectedPod.authors}</span>
                    </div>
                  )}
                </div>
              </div>
                              
              {/* Description Accordion */}
              <Accordion type="multiple" defaultValue={["description"]} className="space-y-4">
                <AccordionItem value="description" className="border-b-0">
                  <AccordionTrigger className="justify-start gap-3 py-2 text-xl font-semibold text-foreground hover:no-underline rounded-b-none border-b pb-4 [&>svg]:-order-1 items-center">
                    Description
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="h-fit mt-4 bg-gradient-to-br from-primary/5 border rounded-xl shadow">
                      <div className="p-4">
                        {selectedPod.description ? (
                          selectedPod.description.length > 1000 ? (
                            <ScrollArea className="h-96 w-full rounded-md">
                              <div className="prose prose-sm max-w-none dark:prose-invert">
                                <MarkdownRenderer 
                                  content={selectedPod.description} 
                                  variant="compact"
                                />
                              </div>
                            </ScrollArea>
                          ) : (
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                              <MarkdownRenderer 
                                content={selectedPod.description} 
                              />
                            </div>
                          )
                        ) : (
                          <div className="flex items-center justify-center py-8 text-muted-foreground">
                            <span className="italic">No description available</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
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
                  <Separator orientation="vertical" className="min-h-6" />

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
              
            {/* Bottom buttons - fixed at bottom */}
            <Separator className="mb-4" />
            <Button 
              onClick={handleConfirmDeploy}
              size="sm"
              className="w-full h-10 text-sm bg-gradient-to-r from-kamino-green to-kamino-yellow font-medium hover:brightness-90 cursor-pointer !text-white"
            >
              <Rocket />
              Deploy
            </Button>
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
