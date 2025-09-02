"use client"

import * as React from "react"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DeployedPod } from "@/lib/types"
import { Boxes, Plus, MonitorX, Rocket } from "lucide-react"

interface HeaderStatsProps {
  pods: DeployedPod[]
}

export function HeaderStats({ pods }: HeaderStatsProps) {
  const totalVMsCount = pods.reduce((acc, pod) => acc + (pod.vms || []).length, 0)
  const runningVMsCount = pods.reduce((acc, pod) => 
    acc + (pod.vms || []).filter(vm => vm.status === 'running').length, 0)

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
      <Dialog>
          <DialogTrigger asChild>
            {/* TODO: Implement bulk cloning */}
            {/* Gradient Button with Kamino Colors */}
            <Button 
              className="h-full w-full bg-gradient-to-r from-kamino-green to-kamino-yellow font-medium hover:brightness-90 cursor-pointer shadow !text-white rounded-xl"
              type="button"
              >
              <Plus />
              Clone Pods
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={() => {}} className="flex flex-col space-y-6">
              <DialogHeader>
                <DialogTitle>Clone Pods</DialogTitle>
                <DialogDescription>
                  Bulk clone pods for users and groups
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Input 
                    id="name-1" 
                    name="name" 
                    placeholder="Group Name" 
                    value=""
                    onChange={() => {}}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
                <Button type="submit" >
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </div>
  )
}
