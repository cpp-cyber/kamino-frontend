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
import { DashboardQuickActions } from "@/components/dashboard/dashboard-quick-actions"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function AdminDashboardPage() {
  // Fetch unified dashboard data
  const { data: dashboardData, loading, error, refetch } = useApiState({
    fetchFn: getDashboardData,
    deps: []
  })

  return (
    <AuthGuard adminOnly>
      <PageLayout>
        <div className="@container/main flex flex-1 flex-col gap-2">
          {/* Page Header */}
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Monitor system status, manage resources, and perform quick administrative tasks
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
                <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 pb-4 md:gap-6 md:pb-6">
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

            {/* Quick Actions Section */}
            {!loading && !error && (
              <DashboardQuickActions />
            )}



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
