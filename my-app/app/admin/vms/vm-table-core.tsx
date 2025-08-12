import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  OnChangeFn,
} from "@tanstack/react-table"
import { VirtualMachine } from "@/lib/types"
import { createVMTableColumns } from "./vm-table-columns"
import { formatBytes, formatUptime } from "@/lib/utils"
import { StatusBadge } from "@/components/status-badges"
import { Button } from "@/components/ui/button"
import { PlayIcon, SquareIcon } from "lucide-react"
import Link from "next/link"

interface VMTableCoreProps {
  vms: VirtualMachine[]
  currentPage: number
  itemsPerPage: number
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  onVMAction: (vmid: number, node: string, action: 'start' | 'stop') => void
}

export function VMTableCore({
  vms,
  currentPage,
  itemsPerPage,
  sorting,
  onSortingChange,
  onVMAction
}: VMTableCoreProps) {
  const columns = React.useMemo(() => createVMTableColumns(onVMAction), [onVMAction])

  const table = useReactTable({
    data: vms,
    columns,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: false,
    columnResizeMode: "onChange",
    state: {
      sorting,
    },
  })

  // Get sorted data for pagination
  const sortedData = table.getSortedRowModel().rows.map(row => row.original)
  
  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentVMs = sortedData.slice(startIndex, endIndex)

  return (
    <Table style={{ tableLayout: 'fixed', width: '100%' }}>
      <TableHeader className="bg-muted text-muted-foreground">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead 
                  key={header.id}
                  style={{ width: `${header.getSize()}px` }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {currentVMs.length === 0 && (
          <TableRow key="empty-state">
            <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
              No virtual machines found.
            </TableCell>
          </TableRow>
        )}
        {currentVMs.map((vm) => (
          <TableRow key={vm.vmid}>
            <TableCell className="font-mono px-4" style={{ width: '100px' }}>{vm.vmid}</TableCell>
            <TableCell style={{ width: '120px' }}>{vm.node}</TableCell>
            <TableCell className="font-medium" style={{ width: '200px' }}>
              <Button variant="link" size="sm" className="p-0">
                <Link 
                  href={`https://gonk.sdc.cpp:8006/#v1:0:=qemu%2F${vm.vmid}:4:::::::`}
                  target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="truncate">{vm.name}</div>
                  </Link>
                </Button>
              </TableCell>
              <TableCell style={{ width: '100px' }}>{vm.pool || 'N/A'}</TableCell>
              <TableCell style={{ width: '150px' }}>
                {vm.maxcpu > 0 ? 
                  `${((vm.cpu || 0) * 100).toFixed(1)}% (${vm.maxcpu} cores)` : 
                  `0.0% (${vm.maxcpu || 0} cores)`
                }
              </TableCell>
              <TableCell style={{ width: '220px' }}>
                <div className="truncate">
                  {vm.maxmem > 0 ? 
                    `${formatBytes(vm.mem || 0)} / ${formatBytes(vm.maxmem)} (${(((vm.mem || 0) / vm.maxmem) * 100).toFixed(1)}%)` : 
                    'N/A'
                  }
                </div>
              </TableCell>
              <TableCell style={{ width: '120px' }}>
                {formatBytes(vm.maxdisk)}
              </TableCell>
              <TableCell style={{ width: '100px' }}>
                <StatusBadge status={vm.status} />
              </TableCell>
              <TableCell style={{ width: '120px' }}>{formatUptime(vm.uptime)}</TableCell>
              <TableCell style={{ width: '80px' }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onVMAction(vm.vmid, vm.node, vm.status === 'running' ? 'stop' : 'start')}
                  className={`h-8 w-8 ml-2 ${
                    vm.status === 'running' 
                      ? "text-destructive hover:text-destructive hover:bg-destructive/10" 
                      : "text-green-600 hover:text-green-600 hover:bg-green-600/10"
                  }`}
                >
                  {vm.status === 'running' ? (
                    <SquareIcon className="h-4 w-4" />
                  ) : (
                    <PlayIcon className="h-4 w-4" />
                  )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
