"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AuthGuard } from "@/components/auth-guard"
import { PageLayout } from "@/app/admin/admin-page-layout"
import { PodTemplateTable } from "@/app/admin/pods/templates/templates-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toggleTemplateVisibility } from "@/lib/api"

const breadcrumbs = [{ label: "Pod Templates", href: "/admin/pods/templates" }]

// Placeholder API functions (to be implemented later)
const templateVisibility = async (templateName: string) => {
  await toggleTemplateVisibility(templateName)
  console.log(`Toggled template: ${templateName}`)
  return Promise.resolve()
}

const deletePodTemplate = async (templateName: string) => {
  // TODO: Implement actual API call
  // await api.deletePodTemplate(templateName)
  console.log(`Delete template: ${templateName}`)
  return Promise.resolve()
}

export default function AdminPodTemplatePage() {
  const [alertOpen, setAlertOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<{ name: string, action: 'toggle' | 'delete' } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleTemplateAction = async (templateName: string, action: 'toggle' | 'delete') => {
    setSelectedTemplate({ name: templateName, action })
    setAlertOpen(true)
  }

  const handleConfirmTemplateAction = async () => {
    if (!selectedTemplate) return
    
    setIsProcessing(true)
    try {
      if (selectedTemplate.action === 'toggle') {
        await templateVisibility(selectedTemplate.name)
        toast.success(`Template "${selectedTemplate.name}" has been toggle`)
      } else {
        await deletePodTemplate(selectedTemplate.name)
        toast.success(`Template "${selectedTemplate.name}" has been deleted`)
      }
      setAlertOpen(false)
      setSelectedTemplate(null)
      // Note: The table will refresh automatically or you might want to trigger a refresh
    } catch (error) {
      toast.error(`Failed to ${selectedTemplate.action} template: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const getActionText = () => {
    if (!selectedTemplate) return ''
    return selectedTemplate.action === 'toggle' ? 'toggle' : 'permanently delete'
  }

  const getActionDescription = () => {
    if (!selectedTemplate) return ''
    if (selectedTemplate.action === 'toggle') {
      return 'This template will be hidden from the available templates list. You can unhide it later from the admin settings.'
    }
    return 'This action cannot be undone. This will permanently delete the template and remove all associated data.'
  }

  return (
    <AuthGuard adminOnly>
      <PageLayout
        breadcrumbs={breadcrumbs}
      >
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Pod Templates</h1>
              <p className="text-muted-foreground">
                Manage all pod templates on Proxmox
              </p>
            </div>
            <PodTemplateTable onTemplateAction={handleTemplateAction} />
          </div>
        </div>
      </PageLayout>

      {/* Template Action Confirmation Dialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to {getActionText()} &quot;{selectedTemplate?.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {getActionDescription()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmTemplateAction} 
              disabled={isProcessing}
              className={selectedTemplate?.action === 'delete' ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {isProcessing ? 
                `${selectedTemplate?.action === 'toggle' ? 'Toggling' : 'Deleting'}...` : 
                `${selectedTemplate?.action === 'toggle' ? 'Toggle' : 'Delete'}`
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthGuard>
  )
}
