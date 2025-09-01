import React from 'react'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Boxes, MonitorCheck, MonitorXIcon } from 'lucide-react'

interface HeaderStatsProps {
  totalCount: number
  runningCount: number
}

export function HeaderStats({ totalCount, runningCount }: HeaderStatsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid-cols-3 pb-2">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total VMs</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCount}
          </CardTitle>
          <CardAction>
            <Boxes />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Running VMs</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <span className="text-green-600 dark:text-green-400">
              {runningCount}
            </span>
          </CardTitle>
          <CardAction>
            <MonitorCheck />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Stopped VMs</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <span className="text-red-600 dark:text-red-400">
              {totalCount - runningCount}
            </span>
          </CardTitle>
          <CardAction>
            <MonitorXIcon />
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  )
}
