"use client"

import { AuthGuard } from "@/components/auth-guard"
import { PageLayout } from "@/app/admin/admin-page-layout"
import { HeaderStats } from "@/app/admin/dashboard/header-stats"
import { HeaderStatsState } from "@/app/admin/dashboard/header-stats-state"
import { ResourcesState } from "@/app/admin/dashboard/resources-state"
import { getDashboardData } from "@/lib/api"
import { useApiState } from "@/hooks/use-api-state"
import { ClusterResources } from "@/app/admin/dashboard/cluster-resources"
import { NodeResources } from "@/app/admin/dashboard/node-resources"

export default function AdminPage() {
  // Fetch unified dashboard data
  const { data: dashboardData, loading, error, refetch } = useApiState({
    fetchFn: getDashboardData,
    deps: []
  })

  return (
    <AuthGuard adminOnly>
      <PageLayout>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Header Stats Section */}
            {loading || error ? (
              <HeaderStatsState 
                loading={loading} 
                error={error} 
                refetch={refetch} 
              />
            ) : dashboardData ? (
              <HeaderStats stats={dashboardData.stats} />
            ) : null}

            {/* Resources Section */}
            {loading || error ? (
              <ResourcesState 
                loading={loading} 
                error={error} 
                refetch={refetch} 
              />
            ) : dashboardData ? (
              <>
                <ClusterResources resources={{ cluster: dashboardData.stats.cluster }} />
                <NodeResources resources={{ cluster: dashboardData.stats.cluster }} />
              </>
            ) : null}
          </div>
        </div>
      </PageLayout>
    </AuthGuard>
  )
}
