import React from 'react'
import { DeployedPod } from "@/lib/types"

interface UsePodSelectionProps {
  pods: DeployedPod[]
}

export function usePodSelection({ pods }: UsePodSelectionProps) {
  const [selectedPods, setSelectedPods] = React.useState<Set<string>>(new Set())

  const handleSelectPod = React.useCallback((podName: string, checked: boolean) => {
    setSelectedPods(prev => {
      const newSelectedPods = new Set(prev)
      if (checked) {
        newSelectedPods.add(podName)
      } else {
        newSelectedPods.delete(podName)
      }
      return newSelectedPods
    })
  }, [])

  const handleSelectAll = React.useCallback(() => {
    // If currently all are selected, then unselect all
    const isCurrentlyAllSelected = selectedPods.size === pods.length
    
    if (isCurrentlyAllSelected) {
      setSelectedPods(new Set())
    } else {
      // If none or some are selected, select all
      setSelectedPods(new Set(pods.map(pod => pod.name)))
    }
  }, [pods, selectedPods.size])

  const clearSelection = React.useCallback(() => {
    setSelectedPods(new Set())
  }, [])

  const getSelectedPodObjects = React.useCallback(() => {
    return pods.filter(pod => selectedPods.has(pod.name))
  }, [pods, selectedPods])

  return {
    selectedPods,
    handleSelectPod,
    handleSelectAll,
    clearSelection,
    getSelectedPodObjects
  }
}
