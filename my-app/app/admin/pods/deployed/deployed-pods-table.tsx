"use client"

import * as React from "react"
import { DeployedPod } from "@/lib/types"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { getAllDeployedPods } from "@/lib/api"
import { ErrorDisplay } from "@/components/ui/error-display"
import { HeaderStats } from "./header-stats"
import { PodsTableToolbar } from "./pods-table-toolbar"
import { PodsTableCore } from "./pods-table-columns"
import { PodsTablePagination } from "./pods-table-pagination"
import { usePodFilters } from "./use-pod-filters"
import { usePodExpansion } from "./use-pod-expansion"

interface DeployedPodsTableProps {
  onDelete: (pod: DeployedPod) => void
  onBulkDelete: (pods: DeployedPod[]) => void
  onVMAction: (vmid: number, node: string, action: 'start' | 'stop') => void
  onRefresh?: () => Promise<void> | void
}

export function DeployedPodsTable({ onDelete, onBulkDelete, onVMAction, onRefresh }: DeployedPodsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [pods, setPods] = React.useState<DeployedPod[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)

  // Apply filters
  const filteredPods = usePodFilters({ pods, searchTerm })

  // Selection state - moved to this component level
  const [selectedPods, setSelectedPods] = React.useState<Set<string>>(new Set())

  // Helper functions for selection
  const clearSelection = React.useCallback(() => {
    setSelectedPods(new Set())
  }, [])

  const getSelectedPodObjects = React.useCallback(() => {
    return filteredPods.filter(pod => selectedPods.has(pod.name))
  }, [filteredPods, selectedPods])

  const {
    expandedRows,
    toggleRow,
    handleToggleAllRows
  } = usePodExpansion({ pods: filteredPods })

  const fetchPods = React.useCallback(async () => {
    try {
      setError(null)
      const data = await getAllDeployedPods()
      setPods(data)
    } catch (err) {
      console.error('Failed to fetch deployed pods:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch deployed pods')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchPods()
  }, [fetchPods])

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    } else {
      setIsRefreshing(true)
      await fetchPods()
      setIsRefreshing(false)
    }
  }

  // Reset to first page when search or items per page changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, itemsPerPage])

  // Clear selection when filtered pods change
  React.useEffect(() => {
    setSelectedPods(prev => {
      const currentPodNames = new Set(filteredPods.map(pod => pod.name))
      const newSelection = new Set<string>()
      prev.forEach(podName => {
        if (currentPodNames.has(podName)) {
          newSelection.add(podName)
        }
      })
      return newSelection
    })
  }, [filteredPods])

  const handleDeleteClick = (pod: DeployedPod, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent row expansion when clicking delete
    onDelete(pod)
  }

  const handleBulkDelete = () => {
    const selectedPodObjects = getSelectedPodObjects()
    onBulkDelete(selectedPodObjects)
    clearSelection() // Clear selection after bulk delete
  }

  // Pagination calculations
  const totalItems = filteredPods.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPods = filteredPods.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner message="Loading deployed pods..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <ErrorDisplay error={error} />
        <Button onClick={fetchPods} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  if (isRefreshing) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner message="Loading deployed pods..." />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <HeaderStats pods={pods} />

      {/* Deployed Pods Table */}
      <div className="rounded-md border">
        <PodsTableToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          selectedPodsCount={selectedPods.size}
          onBulkDelete={handleBulkDelete}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        <PodsTableCore
          pods={currentPods}
          searchTerm={searchTerm}
          expandedRows={expandedRows}
          selectedPods={selectedPods}
          onToggleRow={toggleRow}
          onToggleAllRows={handleToggleAllRows}
          onDelete={handleDeleteClick}
          onVMAction={onVMAction}
          onSelectionChange={setSelectedPods}
        />
      </div>

      {/* Pagination */}
      <PodsTablePagination
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
