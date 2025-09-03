"use client"

import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GetGroupsResponse } from "@/lib/types"
import { IconUsersGroup } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateGroupDialog } from "@/components/shared/create-group-dialog"

interface HeaderStatsProps {
  groupsData: GetGroupsResponse
  onGroupCreated?: () => void
}

export function HeaderStats({ groupsData, onGroupCreated }: HeaderStatsProps) {
  return (
    <>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid-cols-2 pb-2">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Groups</CardDescription>
            <CardAction>
              <IconUsersGroup/>
            </CardAction>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {groupsData.count}
            </CardTitle>
          </CardHeader>
        </Card>

        <CreateGroupDialog 
          onGroupCreated={onGroupCreated}
          trigger={
            <Button 
              className="h-full bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md  hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2"
              type="button"
            >
              <IconUsersGroup />
              Create Groups
            </Button>
          }
        />
      </div>
    </>
  )
}
