"use client"

import { PageLayout } from "@/components/user-page-layout"
import { AuthGuard } from "@/components/auth-guard"

export default function Page() {
  const pageHeader = (
    <div className="flex flex-col items-center justify-center min-h-[125px] text-center">
      <h1 className="text-4xl font-bold text-primary">Kamino</h1>
      <p className="text-primary/90 mt-2">
        What is Kamino?
      </p>
    </div>
  )

  return (
    <AuthGuard>
      <PageLayout header={pageHeader} showGradientBackground={true}>
        <p>WIP</p>
      </PageLayout>
    </AuthGuard>
  )
}
