"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DashboardStats } from "@/lib/types"
import { 
  Users, 
  Copy, 
  Rocket, 
  Boxes,
  TrendingUp,
  Activity,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

interface DashboardOverviewProps {
  stats: DashboardStats
}

export function DashboardOverview({ stats }: DashboardOverviewProps) {
  // Calculate some derived metrics
  const totalResources = stats.cluster.total
  const cpuPercentage = (totalResources.cpu_usage * 100).toFixed(1)
  const memoryPercentage = ((totalResources.memory_used / totalResources.memory_total) * 100).toFixed(1)
  const storagePercentage = ((totalResources.storage_used / totalResources.storage_total) * 100).toFixed(1)

  // Recent activity mock data (this could be enhanced with real API data)
  const recentActivities = [
    {
      id: 1,
      type: "pod_deployed",
      title: "Pod deployed",
      description: "New pod instance created",
      timestamp: "2 minutes ago",
      icon: Rocket,
      color: "bg-blue-500"
    },
    {
      id: 2,
      type: "user_created", 
      title: "User created",
      description: "New user account registered",
      timestamp: "15 minutes ago",
      icon: Users,
      color: "bg-green-500"
    },
    {
      id: 3,
      type: "template_published",
      title: "Template published",
      description: "New pod template made available",
      timestamp: "1 hour ago",
      icon: Copy,
      color: "bg-purple-500"
    }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* System Health Overview */}
      <Card className="@container/card lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5" />
            System Health Overview
          </CardTitle>
          <CardDescription>
            Current resource utilization and system status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Resource Utilization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">CPU Usage</span>
                  <span className="text-sm text-muted-foreground">{cpuPercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(parseFloat(cpuPercentage), 100)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Memory</span>
                  <span className="text-sm text-muted-foreground">{memoryPercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(parseFloat(memoryPercentage), 100)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Storage</span>
                  <span className="text-sm text-muted-foreground">{storagePercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(parseFloat(storagePercentage), 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-blue-600">{stats.users}</div>
                <div className="text-xs text-muted-foreground">Total Users</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-green-600">{stats.published_templates}</div>
                <div className="text-xs text-muted-foreground">Templates</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-purple-600">{stats.deployed_pods}</div>
                <div className="text-xs text-muted-foreground">Active Pods</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-orange-600">{stats.vms}</div>
                <div className="text-xs text-muted-foreground">Virtual Machines</div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/users">
                <Button variant="outline" size="sm">
                  <Users className="size-4 mr-2" />
                  Manage Users
                  <ArrowRight className="size-3 ml-2" />
                </Button>
              </Link>
              <Link href="/admin/groups">
                <Button variant="outline" size="sm">
                  <Users className="size-4 mr-2" />
                  Manage Groups
                  <ArrowRight className="size-3 ml-2" />
                </Button>
              </Link>
              <Link href="/admin/pods/deployed">
                <Button variant="outline" size="sm">
                  <Rocket className="size-4 mr-2" />
                  Deployed Pods
                  <ArrowRight className="size-3 ml-2" />
                </Button>
              </Link>
              <Link href="/admin/vms">
                <Button variant="outline" size="sm">
                  <Boxes className="size-4 mr-2" />
                  Virtual Machines
                  <ArrowRight className="size-3 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest system events and changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`rounded-full p-2 ${activity.color}`}>
                      <IconComponent className="size-4 text-white" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                )
              })}
              <div className="text-center pt-4">
                <Button variant="ghost" size="sm">
                  View All Activity
                  <ArrowRight className="size-3 ml-2" />
                </Button>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
