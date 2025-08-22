"use client"

import { CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SuccessStepProps {
  templateName: string
  onStartNew: () => void
  onGoToTemplates: () => void
}

export function SuccessStep({ templateName, onStartNew, onGoToTemplates }: SuccessStepProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-2xl">Template Published Successfully!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <p className="text-muted-foreground">
          <strong>{templateName}</strong> has been successfully published and is now available in the template library.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onStartNew} variant="outline">
            Publish Another Template
          </Button>
          <Button onClick={onGoToTemplates}>
            View All Templates
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
