"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorDisplay } from "@/components/ui/error-display"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { getUnpublishedTemplates } from "@/lib/api"
import { UnpublishedPodTemplate } from "@/lib/types"
import { Separator } from "@/components/ui/separator"

interface StepOneProps {
  selectedTemplate: string
  onTemplateSelect: (template: string) => void
  onNext: () => void
}

export function StepOne({ selectedTemplate, onTemplateSelect, onNext }: StepOneProps) {
  const [templates, setTemplates] = useState<UnpublishedPodTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getUnpublishedTemplates()
        setTemplates(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load templates')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const handleNext = () => {
    if (selectedTemplate) {
      onNext()
    }
  }

  if (loading) {
    return (
      <Card className="max-w-lg flex-1 mx-auto flex flex-col justify-center">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner message="Loading available templates..." />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="max-w-lg flex-1 mx-auto flex flex-col justify-center">
        <CardContent className="pt-6">
          <ErrorDisplay error={error} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-lg flex-1 mx-auto flex flex-col justify-center">
      <CardHeader>
        <CardTitle className="text-lg">Select Template</CardTitle>
        <CardDescription>
          Choose from available unpublished templates to configure and publish
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-6">
        <div className="space-y-2 flex flex-col items-center justify-center">
            <Select value={selectedTemplate} onValueChange={onTemplateSelect} disabled={templates.length === 0}>
            <SelectTrigger id="template-select" className="w-full">
              <SelectValue placeholder="Select a template to publish" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
              <SelectItem key={template.name} value={template.name}>
                {template.name}
              </SelectItem>
              ))}
            </SelectContent>
            </Select>
          {templates.length === 0 && (
            <p className="text-sm text-destructive pb-4">
              All available templates have already been published
            </p>
          )}
        </div>

        {selectedTemplate && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Notice</AlertTitle>
            <AlertDescription>
              <div>
                <p>This will attempt to convert all VMs to templates, meaning:</p>
                <ul className="list-disc list-inside ml-2">
                  <li>No further changes can be made to the VMs</li>
                  <li>All running VMs will be shutdown</li>
                  <li>All VM snapshots will be deleted</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <Button 
            onClick={handleNext} 
            disabled={!selectedTemplate || templates.length === 0}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
