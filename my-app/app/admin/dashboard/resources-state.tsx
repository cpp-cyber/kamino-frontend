"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface ResourcesStateProps {
  loading: boolean
  error: string | null
  refetch: () => void
}

export function ResourcesState({ loading, error, refetch }: ResourcesStateProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="@container/card mb-6">
          <CardHeader>
            <CardTitle>Total Cluster Resources</CardTitle>
          </CardHeader>
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        </Card>
        
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Node Resources</CardTitle>
          </CardHeader>
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle>Resource Monitoring Error</CardTitle>
            <CardDescription>
              Unable to load cluster and node resource data
            </CardDescription>
            <div className="text-red-500 text-center py-4">
              {error}
            </div>
            <div className="flex justify-center">
              <Button variant="outline" onClick={refetch}>
                <RefreshCw className="size-4 mr-2" />
                Retry Loading Resources
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return null
}
