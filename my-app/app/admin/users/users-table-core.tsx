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
import { User } from "@/lib/types"
import { createUsersTableColumns } from "./users-table-columns"

interface UsersTableCoreProps {
  users: User[]
  currentPage: number
  itemsPerPage: number
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  onUserAction: (user: User, action: 'enable' | 'disable' | 'editGroups' | 'delete') => void
  selectedUsers: Set<string>
  onSelectionChange: (selectedUsers: Set<string>) => void
  selectedUsersForGroupOpsCount: number
  selectedNonAdminUsersCount: number
  onBulkAddToGroup: () => void
  onBulkRemoveFromGroup: () => void
  onBulkDisable: () => void
  onBulkDelete: () => void
}

export function UsersTableCore({
  users,
  currentPage,
  itemsPerPage,
  sorting,
  onSortingChange,
  onUserAction,
  selectedUsers,
  onSelectionChange,
  selectedUsersForGroupOpsCount,
  selectedNonAdminUsersCount,
  onBulkAddToGroup,
  onBulkRemoveFromGroup,
  onBulkDisable,
  onBulkDelete
}: UsersTableCoreProps) {
  const columns = React.useMemo(() => createUsersTableColumns(
    onUserAction,
    selectedUsers,
    onSelectionChange,
    selectedUsersForGroupOpsCount,
    selectedNonAdminUsersCount,
    onBulkAddToGroup,
    onBulkRemoveFromGroup,
    onBulkDisable,
    onBulkDelete
  ), [
    onUserAction,
    selectedUsers,
    onSelectionChange,
    selectedUsersForGroupOpsCount,
    selectedNonAdminUsersCount,
    onBulkAddToGroup,
    onBulkRemoveFromGroup,
    onBulkDisable,
    onBulkDelete
  ])

  const table = useReactTable({
    data: users,
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

  // Since sorting is handled at parent level, we don't need to slice here
  // Just use the users data as-is since it's already paginated and sorted
  return (
    <Table>
      <TableHeader className="bg-muted text-muted-foreground">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead 
                  key={header.id}
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
        {users.length === 0 && (
          <TableRow key="empty-state">
            <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
              No users found.
            </TableCell>
          </TableRow>
        )}
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} className="hover:bg-muted/50">
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
