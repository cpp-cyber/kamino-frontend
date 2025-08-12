"use client"

import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface HeaderStatsStateProps {
  loading: boolean
  error: string | null
  refetch: () => void
}

export function HeaderStatsState({ loading, error, refetch }: HeaderStatsStateProps) {
  if (loading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="@container/card">
            <CardHeader className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 grid-cols-3">
        <Card className="@container/card col-span-full">
          <CardHeader>
            <CardDescription>Dashboard Error</CardDescription>
            <div className="text-red-500 text-center py-4">
              Error loading dashboard data: {error}
            </div>
            <div className="flex justify-center">
              <Button variant="outline" onClick={refetch}>
                <RefreshCw className="size-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return null
}
