"use client"

import { AuthGuard } from "@/components/auth-guard"
import { PageLayout } from "@/app/admin/admin-page-layout"

const breadcrumbs = [
  { label: "Create Template", href: "/templates/create" }
]

export default function CreateTemplatePage() {
  return (
    <AuthGuard adminOnly>
      <PageLayout breadcrumbs={breadcrumbs}>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create Template</h1>
              <p className="text-muted-foreground">
                Create a new pod template to share with users using resources on Proxmox
              </p>
            </div>
            
            {/* Content */}
          </div>
        </div>
      </PageLayout>
    </AuthGuard>
  )
}
