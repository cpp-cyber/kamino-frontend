"use client"

import { useId } from "react"
import { Eye, EyeOff, RocketIcon, ServerIcon, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import Image from "next/image"

interface StepThreeProps {
  selectedTemplate: string
  description: string
  vmCount: number
  imageFiles: File[]
  isVisible: boolean
  onVisibilityChange: (visible: boolean) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
}

export function StepThree({ 
  selectedTemplate,
  description,
  vmCount,
  imageFiles,
  isVisible,
  onVisibilityChange,
  onSubmit, 
  onBack,
  isSubmitting 
}: StepThreeProps) {
  const id = useId()

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
            <div className="opacity-100 hover:opacity-95 transition-all duration-300 group h-[480px] w-full max-w-xl overflow-hidden rounded-xl bg-card shadow-lg hover:shadow-xl border">
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
                
                {/* Pod Release Date */}
                <div className="mb-2 -mt-2 flex items-center text-xs text-muted-foreground justify-end">
                  <CalendarIcon className="mr-1.5 h-4 w-4" />
                  {new Date().toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  })}
                </div>

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
              {isVisible ? (
                <Eye className="h-5 w-5 text-green-600" />
              ) : (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
                  {isVisible ? "Visible to Users" : "Hidden from Users"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isVisible 
                    ? "This template will be available for users to deploy" 
                    : "This template will be published as hidden"
                  }
                </p>
              </div>
            </div>
            <Switch
              id={id}
              checked={isVisible}
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
            Once published, the template will be {isVisible ? "immediately available to users" : "saved but hidden from users"}.
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
    </Card>
  )
}
