"use client";

import { AuthGuard } from "@/components/auth-guard";
import { CreatorPageLayout } from "@/app/creator/creator-page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiState } from "@/hooks/use-api-state";
import { getAllPodTemplates, getUnpublishedTemplates } from "@/lib/api";
import { LoadingSpinnerSmall } from "@/components/ui/loading-spinner";
import { ErrorDisplay } from "@/components/ui/error-display";
import { Copy, CopyPlusIcon, Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreatorDashboardPage() {
  const {
    data: templates,
    loading: templatesLoading,
    error: templatesError,
  } = useApiState({
    fetchFn: getAllPodTemplates,
  });

  const {
    data: unpublishedTemplates,
    loading: unpublishedLoading,
    error: unpublishedError,
  } = useApiState({
    fetchFn: getUnpublishedTemplates,
  });

  const publishedCount = templates?.length || 0;
  const unpublishedCount = unpublishedTemplates?.length || 0;
  const totalCount = publishedCount + unpublishedCount;

  const pageHeader = (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold">Creator Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Manage your pod templates - create, publish, and edit templates for
        users to deploy
      </p>
    </div>
  );

  return (
    <AuthGuard creatorOrAdmin>
      <CreatorPageLayout
        breadcrumbs={[{ label: "Dashboard", href: "/creator/dashboard" }]}
        header={pageHeader}
      >
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          {/* Total Templates */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Templates
              </CardTitle>
              <Copy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {templatesLoading || unpublishedLoading ? (
                <LoadingSpinnerSmall />
              ) : (
                <div className="text-4xl font-bold">{totalCount}</div>
              )}
            </CardContent>
          </Card>

          {/* Published Templates */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Published Templates
              </CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {templatesLoading ? (
                <LoadingSpinnerSmall />
              ) : templatesError ? (
                <ErrorDisplay error={templatesError} />
              ) : (
                <div className="text-4xl font-bold">{publishedCount}</div>
              )}
            </CardContent>
          </Card>

          {/* Unpublished Templates */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Unpublished Templates
              </CardTitle>
              <CopyPlusIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {unpublishedLoading ? (
                <LoadingSpinnerSmall />
              ) : unpublishedError ? (
                <ErrorDisplay error={unpublishedError} />
              ) : (
                <div className="text-4xl font-bold">{unpublishedCount}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Link href="/creator/templates/create" passHref>
                <Button className="w-full h-20 bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2">
                  <CopyPlusIcon className="h-6 w-6" />
                  <span className="text-sm font-medium">
                    Create New Template
                  </span>
                </Button>
              </Link>
              <Link href="/creator/templates/publish" passHref>
                <Button className="w-full h-20 bg-gradient-to-br from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2">
                  <Edit className="h-6 w-6" />
                  <span className="text-sm font-medium">Publish Templates</span>
                </Button>
              </Link>
              <Link href="/creator/templates" passHref>
                <Button className="w-full h-20 bg-gradient-to-br from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-md hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center gap-2">
                  <Copy className="h-6 w-6" />
                  <span className="text-sm font-medium">
                    View All Templates
                  </span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </CreatorPageLayout>
    </AuthGuard>
  );
}
