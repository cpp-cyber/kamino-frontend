"use client"

import * as React from "react"
import { PlayIcon, SquareIcon, MoreVertical, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badges"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { VirtualMachine } from "@/lib/types"
import { formatUptime } from "@/lib/utils"
import Link from "next/link"

interface VMTableProps {
  vms: VirtualMachine[]
  onVMAction: (vmid: number, node: string, action: 'start' | 'shutdown' | 'reboot') => void
}

export function VMTable({ vms, onVMAction }: VMTableProps) {
  return (
    <div className="bg-muted/60 rounded-md p-4 w-full">
      <div className="w-full overflow-x-auto">
        <Table style={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHeader className="[&_*]:text-muted-foreground">
            <TableRow>
              <TableHead className="px-4" style={{ width: '60px' }}>ID</TableHead>
              <TableHead style={{ width: '90px' }}>Node</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uptime</TableHead>
              <TableHead className="w-28 px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vms.map((vm) => (
              <TableRow key={`${vm.vmid}-${vm.node}`}>
                <TableCell className="px-4 font-mono text-sm" style={{ width: '100px' }}>{vm.vmid}</TableCell>
                <TableCell className="font-mono text-sm" style={{ width: '120px' }}>{vm.node}</TableCell>
                <TableCell className="font-medium">
                  <Button variant="link" className="truncate -ml-3" size="sm">
                    <Link 
                        href={`https://gonk.sdc.cpp:8006/#v1:0:=qemu%2F${vm.vmid}:4:::::::`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                      {vm.name}
                    </Link>
                  </Button>
                </TableCell>
                <TableCell>
                  <StatusBadge status={vm.status} />
                </TableCell>
                <TableCell className="font-mono text-sm">{formatUptime(vm.uptime)}</TableCell>
                <TableCell className="text-right px-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onVMAction(vm.vmid, vm.node, 'start')}
                        disabled={vm.status === 'running'}
                        className="cursor-pointer"
                      >
                        <PlayIcon className="mr-2 h-4 w-4 text-green-600" />
                        Start
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onVMAction(vm.vmid, vm.node, 'shutdown')}
                        disabled={vm.status !== 'running'}
                        className="cursor-pointer"
                      >
                        <SquareIcon className="mr-2 h-4 w-4 text-destructive" />
                        Shutdown
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onVMAction(vm.vmid, vm.node, 'reboot')}
                        className="cursor-pointer"
                      >
                        <RotateCcw className="mr-2 h-4 w-4 text-blue-600" />
                        Reboot
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
