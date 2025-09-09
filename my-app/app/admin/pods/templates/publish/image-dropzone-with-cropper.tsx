"use client"

import { useState, useCallback, useEffect } from "react"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/kibo-ui/dropzone'
import {
  Cropper,
  CropperCropArea,
  CropperImage,
} from "@/components/ui/cropper"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { X, RotateCcw, Check } from "lucide-react"
import Image from "next/image"


interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

interface TemplateImageDropzoneWithCropperProps {
  onFilesChange?: (files: File[]) => void
  value?: File[]
}

const TemplateImageDropzoneWithCropper = ({ 
  onFilesChange, 
  value 
}: TemplateImageDropzoneWithCropperProps) => {
  const [files, setFiles] = useState<File[]>(value || [])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [showCropper, setShowCropper] = useState(false)
  const [croppedFile, setCroppedFile] = useState<File | null>(null)
  const [cropArea, setCropArea] = useState<CropArea | null>(null)
  
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const url = URL.createObjectURL(file)
      setImageUrl(url)
      setShowCropper(true)
      setZoom(1)
    }
  }, [])

  const handleCropConfirm = useCallback(async () => {
    if (!imageUrl || !cropArea) return

    try {
      // Create a canvas to crop the image
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) return

        // Use 1:1 aspect ratio to match the cropper
        const aspectRatio = 1 / 1
        const baseWidth = 800
        const baseHeight = Math.round(baseWidth / aspectRatio) // This will be 800 for 1:1
        
        canvas.width = baseWidth
        canvas.height = baseHeight
        
        // Use the actual crop area from the cropper
        const { x, y, width, height } = cropArea
        
        // Draw the cropped image maintaining the 1:1 aspect ratio
        ctx.drawImage(
          img,
          x, y, width, height,
          0, 0, baseWidth, baseHeight
        )
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], 'cropped-template-image.png', {
              type: 'image/png',
              lastModified: Date.now(),
            })
            
            setCroppedFile(croppedFile)
            setFiles([croppedFile])
            onFilesChange?.([croppedFile])
            setShowCropper(false)
          }
        }, 'image/png', 0.95)
      }
      
      img.src = imageUrl
    } catch (error) {
      console.error('Error cropping image:', error)
    }
  }, [imageUrl, cropArea, onFilesChange])

  const handleCropCancel = useCallback(() => {
    setShowCropper(false)
    setImageUrl(null)
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl])

  const handleRemoveImage = useCallback(() => {
    setFiles([])
    setCroppedFile(null)
    onFilesChange?.([])
    setShowCropper(false)
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl)
      setImageUrl(null)
    }
  }, [imageUrl, onFilesChange])

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [imageUrl])

  const handleReset = useCallback(() => {
    setZoom(1)
  }, [])

  return (
    <div className="space-y-4">
      {/* Show cropper interface when cropping, otherwise show dropzone or final image */}
      {showCropper && imageUrl ? (
        /* Cropper Interface Only */
        <div className="space-y-4">
          <div className="flex w-full flex-col gap-4">
            <AspectRatio ratio={1 / 1}>
              <Cropper
                className="w-full h-full border rounded-lg overflow-hidden"
                image={imageUrl}
                zoom={zoom}
                onZoomChange={setZoom}
                onCropChange={setCropArea}
              >
                <CropperImage />
                <CropperCropArea />
              </Cropper>
            </AspectRatio>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Zoom:
            </span>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value: number[]) => setZoom(value[0])}
              className="flex-1"
              aria-label="Zoom slider"
            />
            <output className="text-sm font-medium tabular-nums w-12 text-right">
              {parseFloat(zoom.toFixed(1))}x
            </output>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="shrink-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pb-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCropCancel}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCropConfirm}
            >
              <Check className="h-4 w-4 mr-2" />
              Apply Crop
            </Button>
          </div>
        </div>
      ) : croppedFile ? (
        /* Final cropped image preview */
        <div className="flex justify-center">
          <div className="relative w-96 h-96">
            <AspectRatio ratio={1 / 1}>
              <Image
                src={URL.createObjectURL(croppedFile)}
                alt="Cropped template image"
                className="rounded-lg object-cover w-full h-full border"
                unoptimized
                width={384}
                height={384}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </AspectRatio>
          </div>
        </div>
      ) : (
        /* Initial dropzone for upload */
        <Dropzone
          accept={{ 'image/*': [] }}
          maxSize={1024 * 1024 * 10}
          minSize={1024}
          onDrop={handleDrop}
          onError={console.error}
          src={files}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
      )}
    </div>
  )
}

export default TemplateImageDropzoneWithCropper
