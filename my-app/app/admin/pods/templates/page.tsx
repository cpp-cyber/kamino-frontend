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

const breadcrumbs = [{ label: "Pod Templates", href: "/admin/pods/templates" }]

// Placeholder API functions (to be implemented later)
const hidePodTemplate = async (templateName: string) => {
  // TODO: Implement actual API call
  // await api.hidePodTemplate(templateName)
  console.log(`Hide template: ${templateName}`)
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
  const [selectedTemplate, setSelectedTemplate] = useState<{ name: string, action: 'hide' | 'delete' } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleTemplateAction = async (templateName: string, action: 'hide' | 'delete') => {
    setSelectedTemplate({ name: templateName, action })
    setAlertOpen(true)
  }

  const handleConfirmTemplateAction = async () => {
    if (!selectedTemplate) return
    
    setIsProcessing(true)
    try {
      if (selectedTemplate.action === 'hide') {
        await hidePodTemplate(selectedTemplate.name)
        toast.success(`Template "${selectedTemplate.name}" has been hidden`)
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
    return selectedTemplate.action === 'hide' ? 'hide' : 'permanently delete'
  }

  const getActionDescription = () => {
    if (!selectedTemplate) return ''
    if (selectedTemplate.action === 'hide') {
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
                `${selectedTemplate?.action === 'hide' ? 'Hiding' : 'Deleting'}...` : 
                `${selectedTemplate?.action === 'hide' ? 'Hide' : 'Delete'}`
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthGuard>
  )
}
