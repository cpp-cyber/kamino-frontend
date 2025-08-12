import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TrashIcon } from "lucide-react"
import Image from "next/image"
import { DeployedPod } from "@/lib/types"
import { StatusBadge } from "@/components/status-badges"
import { formatBytes, formatUptime } from "@/lib/utils"

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
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 grid-cols-1 py-4">
      {pods.map((pod, index) => (
        <Card key={pod.name || index} className="@container/card my-4">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tabular-nums flex items-center gap-3 @[250px]/card:text-2xl">
              <div className="bg-sidebar-accent-foreground/10 text-sidebar-primary-foreground flex aspect-square size-16 items-center justify-center rounded-lg overflow-hidden shadow-lg">
                {/* <Image
                  src={pod.icon || "https://i.imgur.com/C4l2RaF.jpeg"}
                  alt={`${pod.name} Logo`}
                  width={64}
                  height={64}
                  className="size-16 object-cover rounded-lg"
                /> */}
                <Image src="/kaminoLogo.svg" alt="Kamino Logo" width={56} height={56} className="size-14" />
              </div>
              {pod.name}
            </CardTitle>
            <CardAction>
              <Button 
                variant="destructive" 
                size="icon" 
                className="size-10"
                onClick={() => onDelete(pod)}
              >
                <TrashIcon/>
              </Button>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {/* <div className="mb-4 -mt-4 px-1.5">
              { pod.description || "No description provided" }
            </div> */}
            <Table>
                <TableHeader className="[&_*]:text-muted-foreground">
                  <TableRow>
                    <TableHead className="px-4">Name</TableHead>
                    <TableHead>CPU</TableHead>
                    <TableHead>Memory</TableHead>
                    <TableHead>Disk</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uptime</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {pod.vms.map((vm) => (
                  <TableRow key={vm.vmid}>
                    <TableCell className="font-medium px-4">{vm.name}</TableCell>
                    <TableCell>
                      {vm.maxcpu > 0 ? 
                        `${((vm.cpu || 0) * 100).toFixed(1)}% (${vm.maxcpu} cores)` : 
                        'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      {vm.maxmem > 0 ? 
                        `${formatBytes((vm.mem || 0))} / ${formatBytes(vm.maxmem)} (${(((vm.mem || 0) / vm.maxmem) * 100).toFixed(1)}%)` : 
                        'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      {formatBytes(vm.maxdisk)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={vm.status} />
                    </TableCell>
                    <TableCell>{formatUptime(vm.uptime)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* <hr className="w-full border-t text-muted-foreground mt-2 pt-2" />
            <div className="text-xs text-muted-foreground w-full inline-flex justify-between">
              <div className="text-start">
                Author: N/A
              </div>
              <div className="text-end">
                Deployed: {new Date(pod.deployed_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div> */}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
