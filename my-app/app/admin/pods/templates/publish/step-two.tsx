"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import TemplateImageDropzoneWithCropper from "./image-dropzone-with-cropper"
import { Separator } from "@/components/ui/separator"

interface StepTwoProps {
  selectedTemplate: string
  description: string
  onDescriptionChange: (description: string) => void
  authors: string
  onAuthorsChange: (authors: string) => void
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
  authors,
  onAuthorsChange,
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
          Add a description, list of authors, number of VMs, and an image to your template.
        </CardDescription>
      </CardHeader>
      <Separator className="mx-auto" />
      <CardContent className="space-y-6">
        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Provide a detailed description or steps to complete this template..."
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

        {/* Authors */}
        <div className="space-y-2">
          <Label htmlFor="authors">Authors</Label>
          <Input
            id="authors"
            placeholder="Enter template authors (e.g., John Doe, Jane Smith)"
            value={authors}
            onChange={(e) => onAuthorsChange(e.target.value)}
            maxLength={255}
          />
          <p className="text-sm text-muted-foreground">
            Specify the authors or creators of this template (max 255 characters).
          </p>
        </div>

        {/* VM Count */}
        <div className="space-y-2">
          <Label htmlFor="vm-count">VMs</Label>
          <Select
            value={vmCount.toString()}
            onValueChange={(value) => onVmCountChange(Number(value))}
            defaultValue="1"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="1 VM" />
            </SelectTrigger>
            <SelectContent className="h-60">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.vmCount && (
            <p className="text-sm text-destructive">{errors.vmCount}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Specify how many VMs this template contains (1-12)
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
