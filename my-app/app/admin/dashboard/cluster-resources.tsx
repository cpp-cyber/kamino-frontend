"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, MemoryStick, HardDrive } from "lucide-react"
import { calculateUtilization, formatBytes } from "@/lib/utils"
import { ProxmoxResourcesResponse } from "@/lib/types"

interface ClusterResourcesProps {
  resources: ProxmoxResourcesResponse
}

export function ClusterResources({ resources }: ClusterResourcesProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Cluster Resources</CardTitle>
      </CardHeader>
      <div className="flex gap-6 px-6 pb-4">
        <div className="flex-1 flex flex-col space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Cpu className="size-4" />
            CPU Usage
          </div>
          <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
            <div 
              className="absolute bottom-0 w-full bg-gradient-to-t from-foreground/80 to-foreground/60 transition-all duration-300 ease-in-out rounded-b-lg animate-[grow-up_1s_ease-out]"
              style={{ 
                height: `${Math.min(resources.cluster.total.cpu_usage * 100, 100)}%`,
                '--target-height': `${Math.min(resources.cluster.total.cpu_usage * 100, 100)}%`
              } as React.CSSProperties & { '--target-height': string }}
            />
          </div>
          <span className="text-lg font-semibold text-foreground">
            {(resources.cluster.total.cpu_usage * 100).toFixed(2)}%
          </span>
        </div>
        <div className="flex-1 flex flex-col space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <MemoryStick className="size-4" />
            Memory
          </div>
          <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
            <div 
              className="absolute bottom-0 w-full bg-gradient-to-t from-foreground/70 to-foreground/50 transition-all duration-300 ease-in-out rounded-b-lg animate-[grow-up_1s_ease-out]"
              style={{ 
                height: `${Math.min(calculateUtilization(resources.cluster.total.memory_used, resources.cluster.total.memory_total), 100)}%`,
                '--target-height': `${Math.min(calculateUtilization(resources.cluster.total.memory_used, resources.cluster.total.memory_total), 100)}%`
              } as React.CSSProperties & { '--target-height': string }}
            />
          </div>
          <div>
            <span className="text-lg font-semibold text-foreground">
              {calculateUtilization(resources.cluster.total.memory_used, resources.cluster.total.memory_total)}%
            </span>
            <div className="text-xs text-muted-foreground">
              {formatBytes(resources.cluster.total.memory_used)} / {formatBytes(resources.cluster.total.memory_total)}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <HardDrive className="size-4" />
            Storage
          </div>
          <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
            <div 
              className="absolute bottom-0 w-full bg-gradient-to-t from-foreground/60 to-foreground/40 transition-all duration-300 ease-in-out rounded-b-lg animate-[grow-up_1s_ease-out]"
              style={{ 
                height: `${Math.min(calculateUtilization(resources.cluster.total.storage_used, resources.cluster.total.storage_total), 100)}%`,
                '--target-height': `${Math.min(calculateUtilization(resources.cluster.total.storage_used, resources.cluster.total.storage_total), 100)}%`
              } as React.CSSProperties & { '--target-height': string }}
            />
          </div>
          <div>
            <span className="text-lg font-semibold text-foreground">
              {calculateUtilization(resources.cluster.total.storage_used, resources.cluster.total.storage_total)}%
            </span>
            <div className="text-xs text-muted-foreground">
              {formatBytes(resources.cluster.total.storage_used)} / {formatBytes(resources.cluster.total.storage_total)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
