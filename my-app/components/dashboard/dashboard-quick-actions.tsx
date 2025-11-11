"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateUserDialog } from "@/components/shared/create-user-dialog";
import { CreateGroupDialog } from "@/components/shared/create-group-dialog";
import { DeployPodDialog } from "@/components/shared/deploy-pod-dialog";
import { UserPlus, Users, Rocket, FileText } from "lucide-react";
import { isFacultyMode } from "@/lib/utils";

interface DashboardQuickActionsProps {
  onRefresh?: () => void;
}

export function DashboardQuickActions({
  onRefresh,
}: DashboardQuickActionsProps) {
  const router = useRouter();
  const facultyMode = isFacultyMode();

  const handlePublishTemplate = () => {
    router.push("/admin/pods/templates/publish");
  };

  const handleActionSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Perform common administrative tasks from your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`grid grid-cols-1 gap-4 ${facultyMode ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"}`}
        >
          {/* Create User */}
          {!facultyMode && (
            <CreateUserDialog
              onUserCreated={handleActionSuccess}
              trigger={
                <Button className="h-20 w-full bg-gradient-to-br from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2">
                  <UserPlus className="size-6" />
                  <span className="text-sm font-medium">Create Users</span>
                </Button>
              }
            />
          )}

          {/* Create Group */}
          <CreateGroupDialog
            onGroupCreated={handleActionSuccess}
            trigger={
              <Button className="h-20 w-full bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2">
                <Users className="size-6" />
                <span className="text-sm font-medium">Create Groups</span>
              </Button>
            }
          />

          {/* Publish Template */}
          <Button
            onClick={handlePublishTemplate}
            className="h-20 w-full bg-gradient-to-br from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2"
          >
            <FileText className="size-6" />
            <span className="text-sm font-medium">Publish Template</span>
          </Button>

          {/* Deploy Pod */}
          <DeployPodDialog
            onPodDeployed={handleActionSuccess}
            trigger={
              <Button className="h-20 w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2">
                <Rocket className="size-6" />
                <span className="text-sm font-medium">Deploy Pods</span>
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
