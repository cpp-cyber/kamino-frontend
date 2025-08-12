"use client"

import { AuthGuard } from "@/components/auth-guard"
import { PageLayout } from "@/app/admin/admin-page-layout"

const breadcrumbs = [{ label: "Users Guide", href: "/admin/guides/users" }]

export default function AdminUsersGuide() {

  return (
    <AuthGuard>
      <PageLayout
        breadcrumbs={breadcrumbs}
      >
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Users</h1>
              <p className="text-muted-foreground">
                Placeholder
              </p>
            </div>
            {/* content */}
          </div>
        </div>
      </PageLayout>
    </AuthGuard>
  )
}
