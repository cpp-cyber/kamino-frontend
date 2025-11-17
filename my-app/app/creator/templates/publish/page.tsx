"use client";

import { AuthGuard } from "@/components/auth-guard";
import { CreatorPageLayout } from "@/app/creator/creator-page-layout";
import { TemplatePublishWizard } from "@/components/templates/publish-wizard/template-wizard";

const breadcrumbs = [
  { label: "Publish Template", href: "/creator/templates/publish" },
];

export default function CreatorPublishTemplatePage() {
  return (
    <AuthGuard creatorOrAdmin>
      <CreatorPageLayout breadcrumbs={breadcrumbs}>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Publish Template
              </h1>
              <p className="text-muted-foreground">
                Configure and publish a new pod template in three simple steps
              </p>
            </div>

            {/* Template Wizard */}
            <TemplatePublishWizard />
          </div>
        </div>
      </CreatorPageLayout>
    </AuthGuard>
  );
}
