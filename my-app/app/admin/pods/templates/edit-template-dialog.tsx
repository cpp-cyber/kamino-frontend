"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { editTemplate, uploadTemplateImage } from "@/lib/api"
import { PodTemplate } from "@/lib/types"
import TemplateImageDropzoneWithCropper from "./publish/image-dropzone-with-cropper"

interface EditTemplateDialogProps {
  template: PodTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditTemplateDialog({ 
  template, 
  open, 
  onOpenChange, 
  onSuccess
}: EditTemplateDialogProps) {
  const [description, setDescription] = useState("")
  const [authors, setAuthors] = useState("")
  const [vmCount, setVmCount] = useState(1)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [templateVisible, setTemplateVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when template changes or dialog opens
  useEffect(() => {
    if (template && open) {
      setDescription(template.description || "")
      setAuthors(template.authors || "")
      setVmCount(template.vm_count || 1)
      setTemplateVisible(template.template_visible || false)
      setImageFiles([])
      setErrors({})
    }
  }, [template, open])

  // Handle dialog close - reset form
  const handleDialogOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setDescription("")
      setAuthors("")
      setVmCount(1)
      setImageFiles([])
      setTemplateVisible(false)
      setErrors({})
    }
    onOpenChange(newOpen)
  }

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (vmCount < 1) {
      newErrors.vmCount = "Templates must have at least 1 VM"
    } else if (vmCount > 10) {
      newErrors.vmCount = "Templates cannot have more than 10 VMs"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [vmCount])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!template) return
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      // Upload image file if present
      let imagePath = template.image_path || ""
      if (imageFiles.length > 0) {
        try {
          imagePath = await uploadTemplateImage(imageFiles[0])
        } catch (uploadError) {
          toast.error('Failed to upload image. Please try again.')
          return
        }
      }

      // Prepare updated template object
      const updatedTemplate: PodTemplate = {
        name: template.name,
        description: description || "",
        authors: authors || "",
        image_path: imagePath,
        template_visible: templateVisible,
        vm_count: vmCount || 0,
        deployments: template.deployments,
        created_at: template.created_at,
      }
      
      await editTemplate(updatedTemplate)
      toast.success(`Template "${template.name}" has been updated successfully`)
      
      setIsSubmitting(false)
      onOpenChange(false)
      
      if (onSuccess) {
        setTimeout(onSuccess, 100)
      }
      
    } catch (error) {
      toast.error(`Failed to update template: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
          <DialogDescription>
            Update the template configuration for "{template?.name}"
          </DialogDescription>
        </DialogHeader>
        
        <Separator />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide a detailed description of this template..."
              className="resize-none min-h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-sm text-muted-foreground">
              Supports Markdown formatting including **bold**, *italic*, `code`, links, lists, and line breaks.
            </p>
          </div>

          {/* Authors */}
          <div className="space-y-2">
            <Label htmlFor="authors">Authors</Label>
            <Input
              id="authors"
              placeholder="Enter template authors (e.g., John Doe, Jane Smith)"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              disabled={isSubmitting}
              maxLength={255}
            />
            <p className="text-sm text-muted-foreground">
              Specify the authors or creators of this template (max 255 characters).
            </p>
          </div>

          {/* VM Count */}
          <div className="space-y-2">
            <Label htmlFor="vm-count">VMs</Label>
            <Input
              id="vm-count"
              type="number"
              min="1"
              max="10"
              value={vmCount}
              onChange={(e) => setVmCount(Number(e.target.value))}
              placeholder="Enter number of VMs"
              disabled={isSubmitting}
            />
            {errors.vmCount && (
              <p className="text-sm text-destructive">{errors.vmCount}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Specify how many VMs this template contains (1-10)
            </p>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <TemplateImageDropzoneWithCropper 
              value={imageFiles}
              onFilesChange={setImageFiles}
            />
            <p className="text-sm text-muted-foreground">
              Upload a new image for your template (max 10MB). Leave empty to keep current image.
            </p>
          </div>

          {/* Visibility Toggle */}
          <div className="space-y-4">
            <Label>Visibility</Label>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div>
                  <Label htmlFor="template-visible" className="text-sm font-medium cursor-pointer">
                    {templateVisible ? "Visible to Users" : "Hidden from Users"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {templateVisible 
                      ? "This template is available for users to deploy" 
                      : "This template is hidden from users"
                    }
                  </p>
                </div>
              </div>
              <Switch
                id="template-visible"
                checked={templateVisible}
                onCheckedChange={setTemplateVisible}
                disabled={isSubmitting}
                aria-label="Toggle template visibility"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Template'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
