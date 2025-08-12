"use client"

import { AuthGuard } from "@/components/auth-guard"
import { PageLayout } from "@/app/admin/admin-page-layout"
import { HeaderStats } from "@/app/admin/dashboard/header-stats"
import { HeaderStatsState } from "@/app/admin/dashboard/header-stats-state"
import { ResourcesState } from "@/app/admin/dashboard/resources-state"
import { getProxmoxResources } from "@/lib/api"
import { useApiState } from "@/hooks/use-api-state"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { ClusterResources } from "@/app/admin/dashboard/cluster-resources"
import { NodeResources } from "@/app/admin/dashboard/node-resources"

export default function AdminPage() {
  // Fetch dashboard stats (pod templates, deployed pods, VMs)
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats()
  
  // Fetch Proxmox resources (cluster and node data)
  const { data: resources, loading: resourcesLoading, error: resourcesError, refetch: refetchResources } = useApiState({
    fetchFn: getProxmoxResources,
    deps: []
  })

  return (
    <AuthGuard>
      <PageLayout>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Header Stats Section */}
            {statsLoading || statsError ? (
              <HeaderStatsState 
                loading={statsLoading} 
                error={statsError} 
                refetch={refetchStats} 
              />
            ) : (
              <HeaderStats stats={stats} />
            )}

            {/* Resources Section */}
            {resourcesLoading || resourcesError ? (
              <ResourcesState 
                loading={resourcesLoading} 
                error={resourcesError} 
                refetch={refetchResources} 
              />
            ) : resources ? (
              <>
                <ClusterResources resources={resources} />
                <NodeResources resources={resources} />
              </>
            ) : null}
          </div>
        </div>
      </PageLayout>
    </AuthGuard>
  )
}
