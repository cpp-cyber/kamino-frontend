import { useMemo } from 'react'
import { useApiState } from './use-api-state'
import { getPodTemplates, getAllDeployedPods, getVirtualMachines, getAllUsers } from '@/lib/api'

export interface DashboardStats {
  usersCount: number
  podTemplatesCount: number
  deployedPodsCount: number
  virtualMachinesCount: number
  runningVMsCount: number
  stoppedVMsCount: number
}

export function useDashboardStats() {
  
  const { data: users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useApiState({
    fetchFn: getAllUsers,
    deps: []
  })

  const { data: podTemplates, loading: templatesLoading, error: templatesError, refetch: refetchTemplates } = useApiState({
    fetchFn: getPodTemplates,
    deps: []
  })

  const { data: deployedPods, loading: podsLoading, error: podsError, refetch: refetchPods } = useApiState({
    fetchFn: getAllDeployedPods,
    deps: []
  })

  const { data: virtualMachines, loading: vmsLoading, error: vmsError, refetch: refetchVMs } = useApiState({
    fetchFn: getVirtualMachines,
    deps: []
  })

  const stats: DashboardStats = useMemo(() => {
    const runningVMs = virtualMachines?.filter(vm => vm.status === 'running').length || 0
    const totalVMs = virtualMachines?.length || 0
    const stoppedVMs = totalVMs - runningVMs

    return {
      usersCount: users?.length || 0,
      podTemplatesCount: podTemplates?.length || 0,
      deployedPodsCount: deployedPods?.length || 0,
      virtualMachinesCount: totalVMs,
      runningVMsCount: runningVMs,
      stoppedVMsCount: stoppedVMs
    }
  }, [users, podTemplates, deployedPods, virtualMachines])

  const loading = usersLoading || templatesLoading || podsLoading || vmsLoading
  const error = usersError || templatesError || podsError || vmsError

  const refetch = () => {
    refetchUsers()
    refetchTemplates()
    refetchPods()
    refetchVMs()
  }

  return {
    stats,
    loading,
    error,
    refetch
  }
}
