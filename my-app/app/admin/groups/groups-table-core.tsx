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
import { Group } from "@/lib/types"
import { createGroupsTableColumns } from "./groups-table-columns"

interface GroupsTableCoreProps {
  groups: Group[]
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  onGroupAction: (groupName: string, action: 'rename' | 'delete') => void
  searchTerm: string
}

export function GroupsTableCore({
  groups,
  sorting,
  onSortingChange,
  onGroupAction,
  searchTerm
}: GroupsTableCoreProps) {
  const columns = React.useMemo(() => createGroupsTableColumns(onGroupAction), [onGroupAction])

  const table = useReactTable({
    data: groups,
    columns,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    // Remove getSortedRowModel since sorting is handled at parent level
    // getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: false,
    columnResizeMode: "onChange",
    state: {
      sorting,
    },
  })

  return (
    <Table>
      <TableHeader className="bg-muted text-muted-foreground">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead 
                  key={header.id}
                  className="px-0"
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
        {groups.length === 0 && (
          <TableRow key="empty-state">
            <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No Groups found matching your search.' : 'No Groups found.'}
            </TableCell>
          </TableRow>
        )}
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell 
                key={cell.id}
                className="px-0"
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
