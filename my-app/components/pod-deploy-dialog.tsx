"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogContent,
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
import { PodTemplate } from "@/lib/types"
import { formatPodName } from "@/lib/utils"
import { Separator } from "./ui/separator"

interface PodDeployDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedPod: PodTemplate | null
}

interface PodDeployProgressProps {
  templateName: string
  onComplete: () => void
  onError: () => void
}

function PodDeployProgress({ templateName, onComplete, onError }: PodDeployProgressProps) {
  const [currentMessage, setCurrentMessage] = useState("Starting deployment")
  const [progress, setProgress] = useState(0)
  const [hasError, setHasError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!templateName) {
      setCurrentMessage("❌ No template specified")
      setHasError(true)
      setTimeout(() => onError(), 5000)
      return
    }

    // For visual editing - mock progress instead of actual API call
    if (templateName === "example-template") {
      let mockProgress = 0
      const interval = setInterval(() => {
        mockProgress += 10
        setProgress(mockProgress)
        
        if (mockProgress <= 30) {
          setCurrentMessage("Initializing deployment")
        } else if (mockProgress <= 60) {
          setCurrentMessage("Setting up virtual machines")
        } else if (mockProgress <= 90) {
          setCurrentMessage("Configuring network")
        } else {
          setCurrentMessage("✅ Deployment complete!")
          clearInterval(interval)
        }
      }, 3000)
      
      return () => clearInterval(interval)
    }

    let isActive = true

    const startDeploymentStream = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/template/clone", { // Development
        // const res = await fetch("/api/v1/template/clone", {
          method: "POST",
          body: JSON.stringify({ template: templateName }),
          headers: { "Content-Type": "application/json" },
          credentials: 'include'
        })

        if (res.ok) {
          setProgress(100)
          setCurrentMessage("✅ Deployment complete!")
          onComplete()
          router.push("/pods/deployed")
          return
        }

        // Handle non-successful responses
        if (!res.ok) {
          try {
            const errorData = await res.json()
            const errorMessage = errorData.error || "Deployment failed"
            const errorDetails = errorData.details || `HTTP ${res.status}: ${res.statusText}`
            setCurrentMessage(`❌ ${errorMessage}: ${errorDetails}`)
          } catch {
            // Fallback if response body is not JSON
            setCurrentMessage(`❌ Deployment failed (${res.status}: ${res.statusText})`)
            setTimeout(() => onError(), 5000)
            return
          }
          setHasError(true)
          setTimeout(() => onError(), 5000)
          return
        }

        if (!res.body) {
          setCurrentMessage("❌ No response from server")
          setHasError(true)
          setTimeout(() => onError(), 2000)
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          
          // Parse SSE data lines
          const dataLines = chunk
            .split("\n")
            .filter(line => line.startsWith("data:"))
            .map(line => line.slice(5).trim())

          for (const data of dataLines) {
            if (data) {
              try {
                const { message, progress: progressValue } = JSON.parse(data)
                setProgress(progressValue)
                setCurrentMessage(message)
                
                // Check if deployment is complete
                if (progressValue >= 100) {
                  setProgress(100)
                  setCurrentMessage("✅ Deployment complete!")
                  onComplete()
                  router.push("/pods/deployed")
                  return
                }
              } catch {
                setCurrentMessage(`❌ Invalid response format: ${data}`)
                setHasError(true)
                setTimeout(() => onError(), 2000)
                return
              }
            }
          }
        }
      } catch (error) {
        let errorMessage = "Deployment failed"
        if (error instanceof Error) {
          errorMessage = error.message
        }
        setCurrentMessage(`❌ ${errorMessage}`)
        setHasError(true)
        if (isActive) {
          setTimeout(() => onError(), 5000)
        }
      }
    }

    startDeploymentStream()

    return () => {
      isActive = false
    }
  }, [templateName, onComplete, onError, router])

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="space-y-2">
        <Progress 
          value={progress} 
          className={`w-full h-5 shadow ${hasError ? '[&>div]:bg-destructive' : '[&>div]:bg-gradient-to-r [&>div]:from-kamino-green [&>div]:to-kamino-yellow'}`} 
        />
      </div>
      
      {/* Progress message and percentage */}
      <div className="flex justify-between items-start gap-3">
        <p className={`text-sm font-medium flex-1 ${hasError ? 'text-destructive' : 'text-muted-foreground'}`}>
          {currentMessage}
          {!hasError && progress < 100 && (
            <span className="inline-block ml-0.5">
              <span className="animate-[pulse_1.5s_ease-in-out_infinite]">.</span>
              <span className="animate-[pulse_1.5s_ease-in-out_0.2s_infinite]">.</span>
              <span className="animate-[pulse_1.5s_ease-in-out_0.4s_infinite]">.</span>
            </span>
          )}
        </p>
        <span className={`text-sm font-semibold tabular-nums ${hasError ? 'text-destructive' : 'text-foreground'}`}>
          {progress}%
        </span>
      </div>
    </div>
  )
}

export function PodDeployDialog({ isOpen, onClose, selectedPod }: PodDeployDialogProps) {
  const [deployProgress, setDeployProgress] = useState(false)
  const [deployingTemplate, setDeployingTemplate] = useState<string>("")

  const handleConfirmDeploy = async () => {
    if (!selectedPod?.name) return
    
    // Capture the template name before closing the dialog
    setDeployingTemplate(selectedPod.name)
    onClose()
    setDeployProgress(true)
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
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader className="space-y-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-kamino-green/20 mx-auto">
              <Rocket className="w-6 h-6 text-kamino-yellow" />
            </div>
            <AlertDialogTitle className="text-center text-2xl">
              Deploying Your Pod
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm space-y-2">
              You will be automatically redirected once deployment completes.
              <span className="block mt-1 font-medium text-muted-foreground">
                Average deployment time: ~3 minutes
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="mt-2">
            <PodDeployProgress
              templateName={deployingTemplate}
              onComplete={() => {
                setDeployProgress(false)
              }}
              onError={() => {
                setDeployProgress(false)
              }}
            />
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
      {/* <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
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
      </AlertDialog> */}
    </>
  )
}
