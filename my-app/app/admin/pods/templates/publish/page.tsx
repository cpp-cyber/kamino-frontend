"use client"

import { AuthGuard } from "@/components/auth-guard"
import { PageLayout } from "@/app/admin/admin-page-layout"
import { TemplatePublishWizard } from "./template-wizard"

const breadcrumbs = [
  { label: "Publish Template", href: "/templates/publish" }
]

export default function PublishTemplatePage() {
  return (
    <AuthGuard adminOnly>
      <PageLayout breadcrumbs={breadcrumbs}>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Publish Template</h1>
              <p className="text-muted-foreground">
                Configure and publish a new pod template in three simple steps
              </p>
            </div>
            
            {/* Template Wizard */}
            <TemplatePublishWizard />
          </div>
        </div>
      </PageLayout>
    </AuthGuard>
  )
}
