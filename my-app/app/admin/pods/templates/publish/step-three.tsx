"use client"

import { useId, useState } from "react"
import { Eye, EyeOff, RocketIcon, ServerIcon, CalendarIcon, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { VisuallyHidden } from "radix-ui"
import Image from "next/image"

interface StepThreeProps {
  selectedTemplate: string
  description: string
  authors: string
  vmCount: number
  imageFiles: File[]
  isTemplateVisible: boolean
  onVisibilityChange: (templateVisible: boolean) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
}

export function StepThree({ 
  selectedTemplate,
  description,
  authors,
  vmCount,
  imageFiles,
  isTemplateVisible,
  onVisibilityChange,
  onSubmit, 
  onBack,
  isSubmitting 
}: StepThreeProps) {
  const id = useId()
  const [previewOpen, setPreviewOpen] = useState(false)

  const handlePreviewClick = () => {
    setPreviewOpen(true)
  }

  return (
    <Card className="max-w-lg flex-1 mx-auto flex flex-col justify-center">
      <CardHeader>
        <CardTitle className="text-lg">Publish Settings & Review</CardTitle>
        <CardDescription>
          Review your template configuration and set visibility options
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-6">
        {/* Template Preview */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Template Preview</h4>
          <div className="flex justify-center px-14">
            <div 
              className="opacity-100 hover:opacity-95 transition-all duration-300 group h-[480px] w-full max-w-xl overflow-hidden rounded-xl bg-card shadow-lg hover:shadow-xl border cursor-pointer"
              onClick={handlePreviewClick}
            >
              {/* Pod Image */}
              <div className="relative h-[200px] w-full overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="w-full h-full relative overflow-hidden">
                    {imageFiles.length > 0 ? (
                      <Image 
                        src={URL.createObjectURL(imageFiles[0])} 
                        alt="Template Preview" 
                        fill
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105" 
                      />
                    ) : (
                      <Image 
                        src="/kaminoLogo.svg" 
                        alt="Kamino Logo" 
                        fill
                        className="object-cover object-top opacity-15 transition-transform duration-300 group-hover:scale-105" 
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5" />
                  </div>
                </div>
              </div>

              {/* Pod Content */}
              <div className="flex h-[280px] flex-col p-6">
                
                {/* Pod Name */}
                <h3 className="mb-1 text-2xl font-bold">{selectedTemplate}</h3>
                
                {/* Pod Description */}
                <div className="mb-4 text-sm text-muted-foreground leading-relaxed h-[120px] overflow-hidden">
                  <div className="h-full relative">
                    <MarkdownRenderer
                      content={description}
                      variant="card"
                      className="h-full overflow-hidden"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Pod Stats */}
                <div className="mt-auto pt-1">
                  <div className="flex items-center rounded-lg bg-muted/50 p-3">
                    
                    {/* VMs */}
                    <div className="flex-1 flex justify-center">
                      <div className="flex flex-col items-center text-center">
                        <div className="text-sm font-bold mb-1">{vmCount}</div>
                        <div className="flex items-center space-x-1">
                          <ServerIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {vmCount === 1 ? "VM" : "VMs"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="h-6 w-px bg-border" />
                    
                    {/* Deployments */}
                    <div className="flex-1 flex justify-center">
                      <div className="flex flex-col items-center text-center">
                        <div className="text-sm font-bold mb-1">0</div>
                        <div className="flex items-center space-x-1">
                          <RocketIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Deployments
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <Separator /> */}

        {/* Visibility Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Visibility</h4>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {isTemplateVisible ? (
                <Eye className="h-5 w-5 text-green-600" />
              ) : (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
                  {isTemplateVisible ? "Visible to Users" : "Hidden from Users"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isTemplateVisible 
                    ? "This template will be available for users to deploy" 
                    : "This template will be published as hidden"
                  }
                </p>
              </div>
            </div>
            <Switch
              id={id}
              checked={isTemplateVisible}
              onCheckedChange={onVisibilityChange}
              aria-label="Toggle template visibility"
            />
          </div>
        </div>

        {/* <Separator /> */}

        {/* Ready to Publish */}
        {/* <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-sm">Ready to Publish</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Your template configuration is complete and ready to be published. 
            Once published, the template will be {isTemplateVisible ? "immediately available to users" : "saved but hidden from users"}.
          </p>
        </div> */}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
            Back
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : 'Publish Template'}
          </Button>
        </div>
      </CardContent>

      {/* Full Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <VisuallyHidden.Root>
          <DialogTitle>Template Preview</DialogTitle>
        </VisuallyHidden.Root>
        <DialogContent className="max-w-full md:min-w-2xl p-6 bg-card">
          <div>
            <div className="space-y-6">
              {/* Top section with image, date, and title */}
              <div className="flex gap-4 pb-2">
                {/* Square image */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 rounded-lg border bg-muted overflow-hidden shadow-xl">
                    {imageFiles.length > 0 ? (
                      <Image 
                        src={URL.createObjectURL(imageFiles[0])}
                        alt={selectedTemplate}
                        className="w-full h-full object-cover"
                        width={192}
                        height={192}
                      />
                    ) : (
                      <Image 
                        src="/kaminoLogo.svg"
                        alt="Kamino Logo"
                        className="w-full h-full object-cover opacity-15"
                        width={192}
                        height={192}
                      />
                    )}
                  </div>
                </div>
                
                {/* Date and title */}
                <div className="flex-1 flex flex-col justify-center">
                  <p className="flex items-center text-xs text-muted-foreground">
                    <CalendarIcon className="mr-1.5 h-4 w-4" />
                    {new Date().toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <h1 className="text-4xl font-semibold leading-tight text-wrap">
                    {selectedTemplate}
                  </h1>
                </div>
              </div>
                              
              {/* Scrollable description */}
              <div className="space-y-2">
                <ScrollArea className="h-[350px] w-full border rounded-md p-2">
                  <MarkdownRenderer 
                    content={description || 'No description available'} 
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
                      <div className="text-sm font-bold mb-1">{vmCount}</div>
                      <div className="flex items-center space-x-1">
                        <ServerIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {vmCount === 1 ? "VM" : "VMs"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="h-6 w-[2px] bg-border" />
                  
                  {/* Deployments */}
                  <div className="flex-1 flex justify-center">
                    <div className="flex flex-col items-center text-center">
                      <div className="text-sm font-bold mb-1">0</div>
                      <div className="flex items-center space-x-1">
                        <RocketIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Deployments
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
                size="sm"
                className="w-full h-10"
                disabled
              >
                <Rocket />
                Deploy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
