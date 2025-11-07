"use client";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GetUsersResponse } from "@/lib/types";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateUserDialog } from "@/components/shared/create-user-dialog";

interface HeaderStatsProps {
  usersData: GetUsersResponse;
  onUserCreated?: () => void;
}

export function HeaderStats({ usersData, onUserCreated }: HeaderStatsProps) {
  return (
    <>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:grid-cols-2 grid-cols-1 pb-2">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Users</CardDescription>
            <CardAction>
              <User />
            </CardAction>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {usersData.count}
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
