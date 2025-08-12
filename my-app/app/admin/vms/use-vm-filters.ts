import React from 'react'
import { VirtualMachine } from "@/lib/types"

interface UseVMFiltersProps {
  vms: VirtualMachine[]
  searchTerm: string
  showRunningOnly: boolean
  showStoppedVMs: boolean
  selectedNodes: string[]
  availableNodes: string[]
}

export function useVMFilters({
  vms,
  searchTerm,
  showRunningOnly,
  showStoppedVMs,
  selectedNodes,
  availableNodes
}: UseVMFiltersProps) {
  return React.useMemo(() => {
    let filtered = vms.filter((vm) =>
      vm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vm.node.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vm.vmid.toString().includes(searchTerm) ||
      vm.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vm.pool && vm.pool.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    // Apply node filter
    if (selectedNodes.length > 0 && selectedNodes.length < availableNodes.length) {
      filtered = filtered.filter(vm => selectedNodes.includes(vm.node))
    }

    // Apply status filters
    if (showRunningOnly && showStoppedVMs) {
      // Show all VMs (no additional filtering needed)
    } else if (showRunningOnly && !showStoppedVMs) {
      filtered = filtered.filter(vm => vm.status === 'running')
    } else if (!showRunningOnly && showStoppedVMs) {
      filtered = filtered.filter(vm => vm.status !== 'running')
    } else if (!showRunningOnly && !showStoppedVMs) {
      filtered = [] // Show nothing if both filters are unchecked
    }

    return filtered
  }, [searchTerm, vms, showRunningOnly, showStoppedVMs, selectedNodes, availableNodes.length])
}
