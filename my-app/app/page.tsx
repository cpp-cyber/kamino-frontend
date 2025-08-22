"use client"

import { AuthGuard } from "@/components/auth-guard"
import { PageLayout } from "@/components/user-page-layout"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { useApiState } from "@/hooks/use-api-state"
import { getPodTemplates, getDeployedPods } from "@/lib/api"
import { LoadingSpinnerSmall } from "@/components/ui/loading-spinner"
import { ErrorDisplay } from "@/components/ui/error-display"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export default function Page() {
  const { data: deployedPods, loading: deployedLoading, error: deployedError } = useApiState({
    fetchFn: getDeployedPods,
  })

  const { data: podTemplates, loading: podTemplatesLoading, error: podTemplatesError } = useApiState({
    fetchFn: getPodTemplates,
  })

  const pageHeader = (
    <div className="flex flex-col items-center justify-center min-h-[125px] text-center">
      <h1 className="text-4xl font-bold text-primary">Kamino Dashboard</h1>
      <p className="text-primary/90 mt-2">
        Browse, deploy, and manage your own instance of our curated interactive pod environments
      </p>
    </div>
  )

  return (
    <AuthGuard>
      <PageLayout header={pageHeader} showGradientBackground={true}>
        {/* Deployed Pods Section */}
        <Card className="@container/card mt-8">
          <CardHeader>
            <CardTitle>
              <span className="text-xl font-bold text-foreground">My Deployed Pods</span>
              <div className="text-xs text-muted-foreground mt-1">
              Pods you have already deployed and can interact with
              </div>
            </CardTitle>
            <CardAction className="text-xs">
              <Button variant="link" size="sm" className="mt-2">
                <Eye />
                <Link href="/pods/deployed" passHref>View All</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <Separator className="-mb-2"/>
          <CardContent>
            {deployedLoading && <LoadingSpinnerSmall />}
            {deployedError && <ErrorDisplay error={deployedError} />}
            {!deployedLoading && !deployedError && deployedPods && (
              <>
                {deployedPods.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No deployed pods found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deployedPods.slice(0, 3).map((pod, index) => (
                      <Link key={pod.name || index} href="/pods/deployed" passHref>
                        <div
                          className="flex items-center gap-4 p-4 bg-card rounded-xl w-full cursor-pointer transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                          role="button"
                        >
                          <div className="bg-sidebar-accent-foreground/10 text-sidebar-primary-foreground flex size-16 items-center justify-center rounded-lg overflow-hidden shadow-lg shrink-0">
                            {/* <Image
                              src={pod.icon || "https://i.imgur.com/C4l2RaF.jpeg"}
                              alt={`${pod.name} Logo`}
                              width={64}
                              height={64}
                              className="size-16 object-cover rounded-lg"
                            /> */}
                            <Image src="/kaminoLogo.svg" alt="Kamino Logo" width={56} height={56} className="size-14" />
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-lg font-semibold text-foreground">{pod.name}</h3>
                            <div className="text-xs text-muted-foreground mt-1">
                              {/* Deployed {new Date(pod.deployed_at).toLocaleDateString()} */}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {deployedPods.length > 3 && (
                      <div className="text-center pt-4">
                        <Link href="/pods/deployed" className="text-primary hover:underline text-sm">
                          View {deployedPods.length - 3} more deployed pods
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Pod Templates Section */}
        <Card className="@container/card mt-12">
          <CardHeader>
            <CardTitle>
              <span className="text-xl font-bold text-foreground">Pod Templates</span>
              <div className="text-xs text-muted-foreground mt-1">
              Pre-made pods of virtual machines that are then turned into templates and available for users to clone
              </div>
            </CardTitle>
            <CardAction className="text-xs">
              <Button variant="link" size="sm" className="mt-2">
                <Eye />
                <Link href="/pods/templates" passHref>View All</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <Separator className="-mb-2"/>
          <CardContent>
            {podTemplatesLoading && <LoadingSpinnerSmall />}
            {podTemplatesError && <ErrorDisplay error={podTemplatesError} />}
            {!podTemplatesLoading && !podTemplatesError && podTemplates && (
              <>
                {podTemplates.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pod templates found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {podTemplates.slice(0, 3).map((template, index) => (
                      <Link key={template.name || index} href="/pods/templates" passHref>
                        <div
                          className="flex items-center gap-4 p-4 bg-card rounded-xl w-full cursor-pointer transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                          role="button"
                        >
                          <div className="bg-sidebar-accent-foreground/10 text-sidebar-primary-foreground flex size-16 items-center justify-center rounded-lg overflow-hidden shadow-lg shrink-0">
                            <Image
                              src={`/api/proxmox/templates/images/${template.image_path}`}
                              alt={template.name}
                              width={64}
                              height={64}
                              unoptimized
                              className="size-16 object-cover rounded-lg"
                            />
                            {/* <Image src="/kaminoLogo.svg" alt="Kamino Logo" width={56} height={56} className="size-14" /> */}
                          </div>
                          <div className="flex flex-col">
                            <h3 className="text-lg font-semibold text-foreground">{template.name}</h3>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                              <span>
                                {(template.vm_count || 0)} {template.vm_count === 1 ? "VM" : "VMs"}
                              </span>
                              <span>•</span>
                              <span>{template.deployments || 'N/A'} deployments</span>
                              {/* <span>•</span>
                              <span>Created {new Date(template.created_at).toLocaleDateString()}</span> */}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {podTemplates.length > 3 && (
                      <div className="text-center pt-4">
                        <Link href="/pods/templates" className="text-primary hover:underline text-sm">
                          View {podTemplates.length - 3} more pod templates
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </PageLayout>
    </AuthGuard>
  )
}
