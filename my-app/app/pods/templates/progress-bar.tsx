"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"

export function PodDeployProgress() {
  const [progress, setProgress] = React.useState(0)
  const router = useRouter()

  React.useEffect(() => {
    const start = Date.now()
    const duration = 30000 // 30 seconds
    let animationFrame: number

    const updateProgress = () => {
      const elapsed = Date.now() - start
      const percent = Math.min((elapsed / duration) * 100, 100)
      setProgress(percent)
      if (percent < 100) {
        animationFrame = requestAnimationFrame(updateProgress)
      }
    }

    animationFrame = requestAnimationFrame(updateProgress)
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  React.useEffect(() => {
    if (progress === 100) {
      const redirectDelay = setTimeout(() => {
        router.push("/pods/deployed")
      }, 500)
      return () => clearTimeout(redirectDelay)
    }
  }, [progress, router])

  return <Progress value={progress} className="w-full" />
}
