"use client"

// import { useState } from "react"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GetUsersResponse } from "@/lib/types"
import { User, Shield, UserRoundX, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function HeaderStats({ usersData }: { usersData: GetUsersResponse }) {
  // const [dialogOpen, setDialogOpen] = useState(false)

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
              {usersData.disabled_count}
            </CardTitle>
          </CardHeader>
        </Card>
        

        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button 
              className="h-full w-full min-h-[100px] bg-gradient-to-r from-kamino-green to-kamino-yellow font-medium hover:brightness-90 cursor-pointer shadow !text-white rounded-xl"
              type="button"
              >
              <Plus />
              Create Users
            </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Name</Label>
                  <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="username-1">Username</Label>
                  <Input id="username-1" name="username" defaultValue="@peduarte" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </>
  )
}
