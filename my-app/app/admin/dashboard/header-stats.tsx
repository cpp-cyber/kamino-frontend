"use client"

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardStats } from "@/lib/types"
import { Boxes, Copy, Rocket, Users, Users2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface HeaderStatsProps {
  stats: DashboardStats
}

export function HeaderStats({ stats }: HeaderStatsProps) {
  const router = useRouter()

  const handleCardClick = (route: string) => {
    router.push(route)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card 
        className="@container/card dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
        onClick={() => handleCardClick('/admin/users')}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardDescription className="text-slate-600 dark:text-slate-400 font-medium">Users</CardDescription>
            <div className="p-2 bg-slate-500 dark:bg-slate-600 rounded-lg">
              <Users className="size-4 text-white"/>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-slate-700 dark:text-slate-300 tabular-nums">
            {stats.users || 0}
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Card 
        className="@container/card dark:from-emerald-950 dark:to-green-900 border-emerald-200 dark:border-emerald-800 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-all duration-200"
        onClick={() => handleCardClick('/admin/groups')}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardDescription className="text-emerald-600 dark:text-emerald-400 font-medium">Groups</CardDescription>
            <div className="p-2 bg-kamino-green rounded-lg">
              <Users2 className="size-4 text-white"/>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
            {stats.groups || 0}
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Card 
        className="@container/card dark:from-amber-950 dark:to-yellow-900 border-amber-200 dark:border-amber-800 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/50 transition-all duration-200"
        onClick={() => handleCardClick('/admin/pods/templates')}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardDescription className="text-amber-600 dark:text-amber-400 font-medium">Pod Templates</CardDescription>
            <div className="p-2 bg-kamino-yellow rounded-lg">
              <Copy className="size-4 text-white"/>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-amber-700 dark:text-amber-300 tabular-nums">
            {stats.published_templates || 0}
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Card 
        className="@container/card dark:from-blue-950 dark:to-indigo-900 border-blue-200 dark:border-blue-800 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-200"
        onClick={() => handleCardClick('/admin/pods/deployed')}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardDescription className="text-blue-600 dark:text-blue-400 font-medium">Deployed Pods</CardDescription>
            <div className="p-2 bg-blue-500 dark:bg-blue-600 rounded-lg">
              <Rocket className="size-4 text-white"/>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-blue-700 dark:text-blue-300 tabular-nums">
            {stats.deployed_pods || 0}
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Card 
        className="@container/card dark:from-violet-950 dark:to-purple-900 border-violet-200 dark:border-violet-800 cursor-pointer hover:shadow-lg hover:scale-105 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/50 transition-all duration-200"
        onClick={() => handleCardClick('/admin/vms')}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardDescription className="text-violet-600 dark:text-violet-400 font-medium">Virtual Machines</CardDescription>
            <div className="p-2 bg-violet-500 dark:bg-violet-600 rounded-lg">
              <Boxes className="size-4 text-white"/>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-violet-700 dark:text-violet-300 tabular-nums">
            {stats.vms || 0}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
