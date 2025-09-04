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
  SortingState,
  useReactTable,
  OnChangeFn,
} from "@tanstack/react-table"
import { VirtualMachine } from "@/lib/types"
import { createVMTableColumns } from "./vm-table-columns"

interface VMTableCoreProps {
  vms: VirtualMachine[]
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  onVMAction: (vmid: number, node: string, action: 'start' | 'shutdown' | 'reboot') => void
}

export function VMTableCore({
  vms,
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
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    state: {
      sorting,
    },
  })

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
                  className="px-3"
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
        {vms.length === 0 && (
          <TableRow key="empty-state">
            <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
              No virtual machines found.
            </TableCell>
          </TableRow>
        )}
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell 
                key={cell.id}
                style={{ width: `${cell.column.getSize()}px` }}
                className="px-1"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
