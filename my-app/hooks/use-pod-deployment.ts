"use client"

import { useState } from "react"
import { PodTemplate } from "@/lib/types"

export function usePodDeployment() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPod, setSelectedPod] = useState<PodTemplate | null>(null)

  const openDeployDialog = (pod: PodTemplate) => {
    setSelectedPod(pod)
    setIsDialogOpen(true)
  }

  const closeDeployDialog = () => {
    setIsDialogOpen(false)
    setSelectedPod(null)
  }

  return {
    isDialogOpen,
    selectedPod,
    openDeployDialog,
    closeDeployDialog,
  }
}
