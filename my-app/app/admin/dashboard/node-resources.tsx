"use client"

import * as React from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, MemoryStick, HardDrive } from "lucide-react"
import { calculateUtilization } from "@/lib/utils"
import { ProxmoxResourcesResponse } from "@/lib/types"

interface NodeResourcesProps {
  resources: ProxmoxResourcesResponse
}

export function NodeResources({ resources }: NodeResourcesProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Node Resources</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 gap-6 @xl/card:grid-cols-2 @5xl/card:grid-cols-3 px-6">
        {resources.nodes.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No node data available.
          </div>
        ) : (
          resources.nodes.map((node) => {
            const cpuUsage = (node.cpu_usage * 100).toFixed(2)
            const memoryUsage = calculateUtilization(node.memory_used, node.memory_total)
            const storageUsage = calculateUtilization(node.storage_used, node.storage_total)
            
            return (
              <Card key={node.node_name} className="@container/card px-4">
                <CardDescription className="capitalize">{node.node_name}</CardDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Cpu className="size-4" />
                      CPU
                    </span>
                    <span className="text-sm text-muted-foreground">{cpuUsage}%</span>
                  </div>
                  <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 h-full bg-blue-500 transition-all duration-300 ease-in-out rounded-full animate-[grow-right_1s_ease-out]"
                      style={{ 
                        width: `${Math.min(node.cpu_usage * 100, 100)}%`,
                        '--target-width': `${Math.min(node.cpu_usage * 100, 100)}%`
                      } as React.CSSProperties & { '--target-width': string }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MemoryStick className="size-4" />
                      Memory
                    </span>
                    <span className="text-sm text-muted-foreground">{memoryUsage}%</span>
                  </div>
                  <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 h-full bg-green-500 transition-all duration-300 ease-in-out rounded-full animate-[grow-right_1s_ease-out]"
                      style={{ 
                        width: `${Math.min(memoryUsage, 100)}%`,
                        '--target-width': `${Math.min(memoryUsage, 100)}%`
                      } as React.CSSProperties & { '--target-width': string }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <HardDrive className="size-4" />
                      Storage
                    </span>
                    <span className="text-sm text-muted-foreground">{storageUsage}%</span>
                  </div>
                  <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 h-full bg-orange-500 transition-all duration-300 ease-in-out rounded-full animate-[grow-right_1s_ease-out]"
                      style={{ 
                        width: `${Math.min(storageUsage, 100)}%`,
                        '--target-width': `${Math.min(storageUsage, 100)}%`
                      } as React.CSSProperties & { '--target-width': string }}
                    />
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </Card>
  )
}
