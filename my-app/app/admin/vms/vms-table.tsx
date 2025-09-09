"use client"

import * as React from "react"
import { SortingState } from "@tanstack/react-table"
import { VirtualMachine } from "@/lib/types"
import { getVirtualMachines } from "@/lib/api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { HeaderStats } from "./header-stats"
import { VMTableToolbar } from "./vm-table-toolbar"
import { VMsTableCoreWrapper } from "./vm-table-core"
import { VMTablePagination } from "./vm-table-pagination"
import { useVMFilters } from "./use-vm-filters"

interface VMsTableProps {
  onVMAction: (vmid: number, node: string, action: 'start' | 'shutdown' | 'reboot') => void
}

export function VMsTable({ onVMAction }: VMsTableProps) {
  const [vms, setVMs] = React.useState<VirtualMachine[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "vmid",
      desc: false
    }
  ])
  
  // Filter states
  const [showRunningOnly, setShowRunningOnly] = React.useState(true)
  const [showStoppedVMs, setShowStoppedVMs] = React.useState(false)
  
  // Node filter states - all nodes selected by default
  const availableNodes = ['commando', 'gemini', 'godfrey', 'gonk', 'malenia', 'radahn']
  const [selectedNodes, setSelectedNodes] = React.useState<string[]>(availableNodes)
  
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)

  // Apply filters
  const filteredVMs = useVMFilters({
    vms,
    searchTerm,
    showRunningOnly,
    showStoppedVMs,
    selectedNodes,
    availableNodes
  })

  // Apply sorting to filtered VMs before pagination
  const sortedVMs = React.useMemo(() => {
    if (sorting.length === 0) return filteredVMs
    
    const sortedData = [...filteredVMs]
    const sort = sorting[0]
    
    sortedData.sort((a, b) => {
      let aValue: string | number | boolean
      let bValue: string | number | boolean
      
      if (sort.id === 'vmid') {
        aValue = a.vmid
        bValue = b.vmid
      } else if (sort.id === 'name') {
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
      } else if (sort.id === 'node') {
        aValue = a.node.toLowerCase()
        bValue = b.node.toLowerCase()
      } else if (sort.id === 'status') {
        aValue = a.status.toLowerCase()
        bValue = b.status.toLowerCase()
      } else if (sort.id === 'cpu') {
        aValue = a.cpu
        bValue = b.cpu
      } else if (sort.id === 'mem') {
        aValue = a.mem
        bValue = b.mem
      } else if (sort.id === 'uptime') {
        aValue = a.uptime
        bValue = b.uptime
      } else if (sort.id === 'disk') {
        aValue = a.disk
        bValue = b.disk
      } else {
        return 0
      }
      
      if (aValue < bValue) return sort.desc ? 1 : -1
      if (aValue > bValue) return sort.desc ? -1 : 1
      return 0
    })
    
    return sortedData
  }, [filteredVMs, sorting])

  React.useEffect(() => {
    loadVMs()
  }, [])

  const loadVMs = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getVirtualMachines()
      setVMs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load virtual machines')
    } finally {
      setIsLoading(false)
    }
  }

  // Reset to first page when search or filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, showRunningOnly, showStoppedVMs, selectedNodes, itemsPerPage])

  // Pagination calculations
  const totalItems = sortedVMs.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedVMs = sortedVMs.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner message="Loading virtual machines..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadVMs} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  const runningCount = vms.filter(vm => vm.status === 'running').length
  const totalCount = vms.length

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <HeaderStats totalCount={totalCount} runningCount={runningCount} />

      {/* Table */}
      <div className="rounded-md border">
        <VMTableToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          showRunningOnly={showRunningOnly}
          onShowRunningOnlyChange={setShowRunningOnly}
          showStoppedVMs={showStoppedVMs}
          onShowStoppedVMsChange={setShowStoppedVMs}
          selectedNodes={selectedNodes}
          onSelectedNodesChange={setSelectedNodes}
          availableNodes={availableNodes}
          onRefresh={loadVMs}
        />
        <VMsTableCoreWrapper
          vms={paginatedVMs}
          sorting={sorting}
          onSortingChange={setSorting}
          onVMAction={onVMAction}
          searchTerm={searchTerm}
        />
      </div>

      {/* Pagination */}
      <VMTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
