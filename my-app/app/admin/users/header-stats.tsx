"use client";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, UserX, Shield, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateUserDialog } from "@/components/shared/create-user-dialog";

interface UserStats {
  count: number;
  disabled_count: number;
  admin_count: number;
  creator_count: number;
}

interface HeaderStatsProps {
  stats: UserStats;
  onUserCreated?: () => void;
}

export function HeaderStats({ stats, onUserCreated }: HeaderStatsProps) {
  return (
    <>
      <div
        className={`*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs pb-2 lg:grid-cols-3 xl:grid-cols-5 grid-cols-1`}
      >
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Users</CardDescription>
            <CardAction>
              <User />
            </CardAction>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.count}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Disabled Users</CardDescription>
            <CardAction>
              <UserX />
            </CardAction>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.disabled_count}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Admin Users</CardDescription>
            <CardAction>
              <Shield />
            </CardAction>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.admin_count}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Creator Users</CardDescription>
            <CardAction>
              <Pencil />
            </CardAction>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {stats.creator_count}
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
              Create Users
            </Button>
          }
        />
      </div>
    </>
  );
}
