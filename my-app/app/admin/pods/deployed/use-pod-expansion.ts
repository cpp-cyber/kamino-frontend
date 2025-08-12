import React from 'react'
import { DeployedPod } from "@/lib/types"

interface UsePodExpansionProps {
  pods: DeployedPod[]
}

export function usePodExpansion({ pods }: UsePodExpansionProps) {
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())

  const toggleRow = React.useCallback((podName: string) => {
    setExpandedRows(prev => {
      const newExpandedRows = new Set(prev)
      if (prev.has(podName)) {
        newExpandedRows.delete(podName)
      } else {
        newExpandedRows.add(podName)
      }
      return newExpandedRows
    })
  }, [])

  const handleToggleAllRows = React.useCallback(() => {
    if (expandedRows.size === pods.length) {
      // If all visible rows are expanded, collapse all
      setExpandedRows(new Set())
    } else {
      // If not all visible rows are expanded, expand all visible
      setExpandedRows(new Set(pods.map(pod => pod.name)))
    }
  }, [expandedRows.size, pods])

  return {
    expandedRows,
    toggleRow,
    handleToggleAllRows
  }
}
