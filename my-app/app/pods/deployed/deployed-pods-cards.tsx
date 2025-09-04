import { Button } from "@/components/ui/button"
import {
  Card,
} from "@/components/ui/card"
import { CalendarIcon, Trash } from "lucide-react"
import Image from "next/image"
import { DeployedPod } from "@/lib/types"
import { formatUptime } from "@/lib/utils"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { IconCircleFilled } from "@tabler/icons-react"
import { useState, useEffect } from "react"

// Live uptime component that updates every second
function LiveUptime({ initialUptime }: { initialUptime: number }) {
  // Calculate the start time once when component mounts
  const [startTime] = useState(() => Date.now() - (initialUptime * 1000))
  const [currentUptime, setCurrentUptime] = useState(initialUptime)

  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate current uptime based on the fixed start time
      const newUptime = Math.floor((Date.now() - startTime) / 1000)
      setCurrentUptime(newUptime)
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  return <span>{formatUptime(currentUptime)}</span>
}


type SectionCardsProps = {
  pods: DeployedPod[]
  onDelete: (pod: DeployedPod) => void
}

export function SectionCards({ pods, onDelete }: SectionCardsProps) {
  if (pods.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 py-8">
        <div className="text-muted-foreground">No deployed pods found</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {pods.map((pod, index) => {
        const vms = pod.vms || []
        // Determine grid columns based on VM count
        const gridCols = vms.length >= 6 ? "grid-cols-2" : "grid-cols-1"
        
        return (
          <div key={pod.name || index}>
            {/* Main Card */}
            <Card className="px-6 min-h-[700px] flex flex-col">

              {/* Header row */}
              <div className="relative flex gap-4 -mt-2">
                
                {/* Image */}
                <div className="flex-shrink-0 pt-2.5">
                  <div className="w-48 h-48 rounded-lg border bg-muted overflow-hidden shadow">
                    <Image 
                      src={pod.template?.image_path ? `/api/v1/template/image/${pod.template.image_path}` : "/kaminoLogo.svg"}
                      alt="Kamino Logo"
                      className="w-full h-full object-cover"
                      width={192}
                      height={192}
                      unoptimized
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center">
                  
                  {/* Delete Pod Button */}
                    <Button 
                    variant="destructive" 
                    className="absolute top-0 right-0 mt-2 w-fit px-3"
                    size="icon"
                    onClick={() => onDelete(pod)}
                    >
                    <Trash className="size-5" />
                    <span className="hidden sm:inline">Delete Pod</span>
                  </Button>

                  {/* Date and Title */}
                  <div className="flex flex-col justify-center">
                    <p className="flex items-center text-xs text-muted-foreground mb-2">
                      <CalendarIcon className="mr-1.5 h-4 w-4" />
                      {pod.template?.created_at ? new Date(pod.template.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }) : new Date().toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <h1 className="text-4xl font-semibold leading-tight text-wrap">
                      {pod.template?.name ? pod.template?.name : pod.name}
                    </h1>
                  </div>
                </div>
              </div>
              
              {/* Main content */}
              <div className="flex flex-col lg:flex-row gap-4 pb-4 flex-1">
                
                {/* VMs */}
                <Card className="w-full lg:w-2/3 order-1 lg:order-2 min-h-fit">
                  <div className="flex flex-col p-4 py-0 gap-2">
                    <div className={`grid ${gridCols} gap-2 auto-rows-max`}>
                        {vms.length > 0 ? (
                        vms.map((vm) => (
                          <Link 
                          key={vm.vmid} 
                          href={`https://gonk.sdc.cpp:8006/#v1:0:=qemu%2F${vm.vmid}:4:::::::`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block"
                          >
                          <div className="flex items-center justify-between px-4 py-2 rounded-xl border min-h-[60px] transition-all duration-200 hover:bg-accent hover:scale-[1.02] hover:shadow-md cursor-pointer">
                            <div className="flex items-center gap-2">
                            <IconCircleFilled 
                              className={`h-4 w-4 flex-shrink-0 ${
                              vm.status === 'running' ? 'text-green-700' : 
                              vm.status === 'stopped' ? 'text-red-700' : 
                              'text-yellow-700'
                              }`} 
                            />
                            <p className="text-sm font-semibold">{vm.name}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                            {vm.status === 'running' ? (
                              <LiveUptime initialUptime={vm.uptime} />
                            ) : (
                              vm.status
                            )}
                            </p>
                          </div>
                          </Link>
                        ))
                        ) : (
                        <div className="flex items-center justify-center px-4 py-8 rounded-xl border col-span-full">
                          <p className="text-sm text-muted-foreground">No virtual machines found</p>
                        </div>
                        )}
                    </div>
                  </div>
                </Card>
                
                {/* Description */}
                <ScrollArea className="h-105 w-full border rounded-xl p-4 shadow order-2 lg:order-1">
                  <MarkdownRenderer 
                    content={pod.template?.description ? pod.template.description : 'No description available'} 
                    variant="compact"
                  />
                </ScrollArea>
              </div>

              {/* Footer section */}
              {/* <div className="mt-auto">
                <Separator className="mb-4" />
                <CardFooter className="flex space-x-2 text-muted-foreground -ml-4">
                  <p>Author:</p>
                  <Badge className="shadow">{pod.template?.name || "Unknown"}</Badge>
                </CardFooter>
              </div> */}
            </Card>
          </div>
        )
      })}
    </div>
  )
}
