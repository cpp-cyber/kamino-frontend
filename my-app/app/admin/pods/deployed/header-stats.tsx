"use client"

import * as React from "react"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DeployedPod } from "@/lib/types"
import { Boxes, MonitorX, Rocket } from "lucide-react"
import { DeployPodDialog } from "@/components/shared/deploy-pod-dialog"

interface HeaderStatsProps {
  pods: DeployedPod[]
}

export function HeaderStats({ pods }: HeaderStatsProps) {
  const totalVMsCount = pods.reduce((acc, pod) => acc + (pod.vms || []).length, 0)
  const runningVMsCount = pods.reduce((acc, pod) => 
    acc + (pod.vms || []).filter(vm => vm.status === 'running').length, 0)

  const handlePodDeployed = () => {
    // Refresh will be handled by parent component
    window.location.reload()
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid-cols-2 lg:grid-cols-4 pb-2">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Pods</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pods.length}
          </CardTitle>
          <CardAction>
            <Rocket />
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total VMs</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalVMsCount}
          </CardTitle>
          <CardAction>
            <Boxes />
          </CardAction>
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
          <CardAction>
            <MonitorX />
          </CardAction>
        </CardHeader>
      </Card>
      
      <DeployPodDialog 
        onPodDeployed={handlePodDeployed}
        trigger={
          <Button 
            className="h-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md rounded-xl hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2"
            type="button"
          >
            <Rocket />
            Deploy Pods
          </Button>
        }
      />
    </div>
  )
}
