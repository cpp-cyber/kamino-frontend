import React from 'react'
import { DeployedPod } from "@/lib/types"

interface UsePodFiltersProps {
  pods: DeployedPod[]
  searchTerm: string
}

export function usePodFilters({ pods, searchTerm }: UsePodFiltersProps) {
  return React.useMemo(() => {
    return pods.filter((pod) =>
      pod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pod.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pod.vms.some((vm) => 
        vm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vm.id.includes(searchTerm) ||
        vm.node.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vm.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [searchTerm, pods])
}
