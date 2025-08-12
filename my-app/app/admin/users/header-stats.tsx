"use client"

// import { useState } from "react"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "@/lib/types"
import { Users, Shield } from "lucide-react"

interface HeaderStatsProps {
  users: User[]
}

export function HeaderStats({ users }: HeaderStatsProps) {
  // const [dialogOpen, setDialogOpen] = useState(false)
  const totalUsers = users.length
  const adminUsers = users.filter(user => user.isAdmin).length

  return (
    <>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid-cols-2 pb-2">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Users</CardDescription>
            <CardAction>
              <Users/>
            </CardAction>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalUsers}
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
              {adminUsers}
            </CardTitle>
          </CardHeader>
        </Card>
        
        {/* Gradient Button with Kamino Colors */}
        {/* <button
          onClick={() => setDialogOpen(true)}
          className="@container/card group relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-kamino-green to-kamino-yellow p-6 shadow-xs transition-all duration-200 hover:shadow-md"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          <div className="relative flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white/80">Add User</span>
              <UserPlus className="h-4 w-4 text-white/80" />
            </div>
            <div className="text-2xl font-semibold text-white @[250px]/card:text-3xl">
              +
            </div>
          </div>
        </button> */}
      </div>

      {/* Simple Dialog */}
      {/* <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              This is a simple dialog that will be used for adding new users. You can customize this dialog content as needed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialogOpen(false)}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  )
}
