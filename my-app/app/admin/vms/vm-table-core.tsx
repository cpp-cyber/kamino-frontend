import React from 'react'
import { SortingState } from "@tanstack/react-table"
import { VirtualMachine } from "@/lib/types"
import { VMsTableCore } from "./vm-table-columns"

interface VMsTableCoreWrapperProps {
  vms: VirtualMachine[]
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onVMAction: (vmid: number, node: string, action: 'start' | 'shutdown' | 'reboot') => void
  searchTerm?: string
}

export function VMsTableCoreWrapper({
  vms,
  sorting,
  onSortingChange,
  onVMAction,
  searchTerm = ""
}: VMsTableCoreWrapperProps) {
  return (
    <VMsTableCore
      vms={vms}
      searchTerm={searchTerm}
      onVMAction={onVMAction}
      sorting={sorting}
      onSortingChange={onSortingChange}
    />
  )
}
