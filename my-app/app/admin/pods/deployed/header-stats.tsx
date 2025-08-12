"use client"

import * as React from "react"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DeployedPod } from "@/lib/types"

interface HeaderStatsProps {
  pods: DeployedPod[]
}

export function HeaderStats({ pods }: HeaderStatsProps) {
  const totalVMsCount = pods.reduce((acc, pod) => acc + pod.vms.length, 0)
  const runningVMsCount = pods.reduce((acc, pod) => 
    acc + pod.vms.filter(vm => vm.status === 'running').length, 0)

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid-cols-4 pb-2">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Pods</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pods.length}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total VMs</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalVMsCount}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Running VMs</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <span className="text-green-600 dark:text-green-400">
              {runningVMsCount}
            </span>
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Stopped VMs</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <span className="text-red-600 dark:text-red-400">
              {totalVMsCount - runningVMsCount}
            </span>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
