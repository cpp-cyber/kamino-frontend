"use client"

import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GetUsersResponse } from "@/lib/types"
import { User, Shield, UserRoundX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateUserDialog } from "@/components/shared/create-user-dialog"
import { BulkCreateUserDialog } from "@/components/shared/bulk-create-user-dialog"

interface HeaderStatsProps {
  usersData: GetUsersResponse
  onUserCreated?: () => void
}

export function HeaderStats({ usersData, onUserCreated }: HeaderStatsProps) {
  return (
    <>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:grid-cols-4 grid-cols-2 pb-2">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Users</CardDescription>
            <CardAction>
              <User/>
            </CardAction>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {usersData.count}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Admin Users</CardDescription>
            <CardAction>
              <Shield/>
            </CardAction>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {usersData.admin_count}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Disabled Users</CardDescription>
            <CardAction>
              <UserRoundX/>
            </CardAction>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <span className="text-red-600 dark:text-red-400">
                {usersData.disabled_count}
              </span>
            </CardTitle>
          </CardHeader>
        </Card>

        <CreateUserDialog 
          onUserCreated={onUserCreated}
          trigger={
            <Button 
              className="h-full w-full bg-gradient-to-br from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-md rounded-xl hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2"
              type="button"
            >
              <User />
              Create User(s)
            </Button>
          }
        />
      </div>
    </>
  )
}
