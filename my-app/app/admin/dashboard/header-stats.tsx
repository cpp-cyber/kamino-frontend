"use client"

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardStats } from "@/hooks/use-dashboard-stats"
import { Copy, Rocket, Server, Users } from "lucide-react"

interface HeaderStatsProps {
  stats: DashboardStats
}

export function HeaderStats({ stats }: HeaderStatsProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Users</CardDescription>
          <CardAction>
            <Users/>
          </CardAction>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.usersCount}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pod Templates</CardDescription>
          <CardAction>
            <Copy/>
          </CardAction>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.podTemplatesCount}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Deployed Pods</CardDescription>
          <CardAction>
            <Rocket/>
          </CardAction>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.deployedPodsCount}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Virtual Machines</CardDescription>
          <CardAction>
            <Server/>
          </CardAction>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.virtualMachinesCount}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
