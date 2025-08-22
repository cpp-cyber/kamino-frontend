"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import TemplateImageDropzoneWithCropper from "./image-dropzone-with-cropper"
import { Separator } from "@/components/ui/separator"

interface StepTwoProps {
  selectedTemplate: string
  description: string
  onDescriptionChange: (description: string) => void
  vmCount: number
  onVmCountChange: (count: number) => void
  imageFiles: File[]
  onImageFilesChange: (files: File[]) => void
  onNext: () => void
  onBack: () => void
}

export function StepTwo({ 
  description, 
  onDescriptionChange,
  vmCount,
  onVmCountChange,
  imageFiles,
  onImageFilesChange,
  onNext, 
  onBack 
}: StepTwoProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!description.trim()) {
      newErrors.description = "Description is required"
    }

    if (vmCount < 1) {
      newErrors.vmCount = "Templates must have at least 1 VM"
    } else if (vmCount > 10) {
      newErrors.vmCount = "Templates cannot have more than 10 VMs"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  return (
    <Card className="max-w-lg flex-1 mx-auto flex flex-col justify-center">
      <CardHeader>
        <CardTitle className="text-lg">Configure Template Details</CardTitle>
        <CardDescription>
          Add description, image, and specify the number of VMs
        </CardDescription>
      </CardHeader>
      <Separator className="mx-auto" />
      <CardContent className="space-y-6">
        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Provide a detailed description of this template..."
            className="resize-none min-h-32"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Supports Markdown formatting including **bold**, *italic*, `code`, links, lists, and line breaks.
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
            onChange={(e) => onVmCountChange(Number(e.target.value))}
            placeholder="Enter number of VMs"
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
            onFilesChange={onImageFilesChange}
          />
          <p className="text-sm text-muted-foreground">
            Upload an image for your template (max 10MB). You will be able to crop your image upon upload.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleNext}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
