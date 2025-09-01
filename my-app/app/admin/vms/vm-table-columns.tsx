"use client"

import { ArrowUpDown, PlayIcon, SquareIcon, MoreVertical, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { VirtualMachine } from "@/lib/types"
import { StatusBadge } from "@/components/status-badges"
import { formatBytes, formatUptime } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Column definitions for the VMs table
export const createVMTableColumns = (
  onVMAction: (vmid: number, node: string, action: 'start' | 'shutdown' | 'reboot') => void
): ColumnDef<VirtualMachine>[] => [
  {
    accessorKey: "vmid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="size-3 -ml-1 text-muted-foreground" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-mono px-4">{row.getValue("vmid")}</div>,
    sortingFn: "alphanumeric",
    size: 60,
    minSize: 60,
    maxSize: 60,
  },
  {
    accessorKey: "node",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4.5"
        >
          Node
          <ArrowUpDown className="size-3 -ml-1 text-muted-foreground" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("node")}</div>,
    size: 90,
    minSize: 90,
    maxSize: 90,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4.5"
        >
          Name
          <ArrowUpDown className="size-3 -ml-1 text-muted-foreground" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const vm = row.original
      return (
        <div className="font-medium">
          <Button variant="link" size="sm" className="p-0">
            <Link 
              href={`https://gonk.sdc.cpp:8006/#v1:0:=qemu%2F${vm.vmid}:4:::::::`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {vm.name}
            </Link>
          </Button>
        </div>
      )
    },
    size: 240,
    minSize: 240,
    maxSize: 240,
  },
  {
    accessorKey: "pool",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4.5"
        >
          Pool
          <ArrowUpDown className="size-3 -ml-1 text-muted-foreground" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("pool") || 'N/A'}</div>,
    size: 240,
    minSize: 240,
    maxSize: 240,
  },
  {
    accessorKey: "cpu",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4.5"
        >
          CPU
          <ArrowUpDown className="size-3 -ml-1 text-muted-foreground" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const vm = row.original
      return (
        <div>
          {vm.maxcpu > 0 ? 
            `${((vm.cpu || 0) * 100).toFixed(1)}% (${vm.maxcpu} cores)` : 
            `0.0% (${vm.maxcpu || 0} cores)`
          }
        </div>
      )
    },
    sortingFn: (rowA, rowB) => {
      const aPercent = (rowA.original.cpu || 0) * 100
      const bPercent = (rowB.original.cpu || 0) * 100
      return aPercent - bPercent
    },
    size: 110,
    minSize: 110,
    maxSize: 110,
  },
  {
    accessorKey: "mem",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4.5"
        >
          Memory
          <ArrowUpDown className="size-3 -ml-1 text-muted-foreground" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const vm = row.original
      return (
        <div>
          {vm.maxmem > 0 ? 
            `${formatBytes(vm.mem || 0)} / ${formatBytes(vm.maxmem)} (${(((vm.mem || 0) / vm.maxmem) * 100).toFixed(1)}%)` : 
            'N/A'
          }
        </div>
      )
    },
    sortingFn: (rowA, rowB) => {
      const aPercent = rowA.original.maxmem > 0 ? ((rowA.original.mem || 0) / rowA.original.maxmem) * 100 : 0
      const bPercent = rowB.original.maxmem > 0 ? ((rowB.original.mem || 0) / rowB.original.maxmem) * 100 : 0
      return aPercent - bPercent
    },
    size: 170,
    minSize: 170,
    maxSize: 170,
  },
  {
    accessorKey: "maxdisk",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4.5"
        >
          Disk
          <ArrowUpDown className="size-3 -ml-1 text-muted-foreground" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{formatBytes(row.getValue("maxdisk"))}</div>,
    sortingFn: "alphanumeric",
    size: 70,
    minSize: 70,
    maxSize: 70,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4.5"
        >
          Status
          <ArrowUpDown className="size-3 -ml-1 text-muted-foreground" />
        </Button>
      )
    },
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    size: 100,
    minSize: 100,
    maxSize: 100,
  },
  {
    accessorKey: "uptime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4.5"
        >
          Uptime
          <ArrowUpDown className="size-3 -ml-1 text-muted-foreground" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{formatUptime(row.getValue("uptime"))}</div>,
    sortingFn: "alphanumeric",
    size: 120,
    minSize: 120,
    maxSize: 120,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const vm = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="ml-3">
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
      )
    },
    enableSorting: false,
    size: 80,
    minSize: 80,
    maxSize: 80,
  },
]
