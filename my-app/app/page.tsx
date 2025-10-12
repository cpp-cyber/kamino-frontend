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
import { getUserDashboard } from "@/lib/api"
import { LoadingSpinnerSmall } from "@/components/ui/loading-spinner"
import { ErrorDisplay } from "@/components/ui/error-display"
import { Button } from "@/components/ui/button"
import { Eye, Boxes, Rocket, User, Calendar, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PodDeployDialog } from "@/components/pod-deploy-dialog"
import { usePodDeployment } from "@/hooks/use-pod-deployment"
import { IconPlayerPlayFilled, IconUsersGroup } from "@tabler/icons-react"
import { formatPodName, formatRelativeTime, formatDateTime } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/contexts/auth-context"
import { Group } from "@/lib/types"

export default function Page() {
  const { isDialogOpen, selectedPod, openDeployDialog, closeDeployDialog } = usePodDeployment()
  const { authState } = useAuth()
  
  // Single API call to get all dashboard data
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useApiState({
    fetchFn: getUserDashboard,
  })

  // Extract data from the unified response
  const deployedPods = dashboardData?.pods || []
  const podTemplates = dashboardData?.templates || []
  const currentUserData = dashboardData?.user_info || null

  // Computed loading and error states
  const isLoading = dashboardLoading
  const hasError = dashboardError

  const pageHeader = (
    <div className="flex flex-col items-center justify-center min-h-[125px] text-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">Kamino Dashboard</h1>
      <p className="text-muted-foreground text-xl leading-7 [&:not(:first-child)]:mt-2">
        Browse, deploy, and manage your own instance of our curated interactive pod environments
      </p>
    </div>
  )

  return (
    <AuthGuard>
      <PageLayout header={pageHeader} showGradientBackground={true}>
        {/* Grid Layout - Deployed Pods and User Profile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* User Profile Card - 1/3 width on desktop, full width on mobile, appears first on mobile */}
          <div className="md:col-span-1 md:order-2">
            <Card className="@container/card bg-gradient-to-br from-primary/5 to-kamino-green/5 border-primary/20 h-full">
              <CardHeader>
                <CardTitle>
                  <span className="text-xl font-bold text-foreground">Profile</span>
                  <p className="text-sm text-muted-foreground">
                    Your account information
                  </p>
                </CardTitle>
                <CardAction className="flex items-center justify-center h-full">
                  <User className="size-8" />
                </CardAction>
              </CardHeader>
              <Separator className="-mb-2 bg-primary/20"/>
              <CardContent className="flex flex-col items-center justify-center flex-1">
                <div className="text-center space-y-4 w-full">
                  <div className="pb-2">
                    <h3 className="text-xl font-bold text-foreground break-words hyphens-auto">
                      {authState.username || "User"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {authState.isAdmin ? "Administrator" : "General User"}
                    </p>
                  </div>
                  
                  <div className="space-y-3">

                    {/* Deployed Pods */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Boxes className="h-4 w-4" />
                        Deployed Pods
                      </span>
                      <span className="font-semibold text-foreground">
                        <Tooltip >
                          <TooltipTrigger>
                            <span className="font-semibold text-foreground">
                              <Badge variant="secondary" className="bg-card shadow-md dark:shadow-primary/10">{deployedPods?.length || 0} / 5</Badge>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="text-sm">
                            <p>Maximum of 5 deployed pods allowed per user</p>
                          </TooltipContent>
                        </Tooltip>
                        
                      </span>
                    </div>
                    
                    <Separator className="bg-primary/10"/>
                    
                    {/* Groups */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <IconUsersGroup className="h-4 w-4" />
                        Groups
                      </span>
                      {isLoading ? (
                        <LoadingSpinnerSmall />
                      ) : currentUserData?.groups ? (
                        <Tooltip >
                          <TooltipTrigger>
                            <span className="font-semibold text-foreground">
                              <Badge variant="secondary" className="bg-card shadow-md dark:shadow-primary/10">{currentUserData.groups.length}</Badge>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="text-sm">
                            {currentUserData.groups.map((group: Group) => (
                              <p key={group.name}>{group.name}</p>
                            ))}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="font-semibold text-foreground">
                          Unknown
                        </span>
                      )}
                    </div>

                    <Separator className="bg-primary/10"/>

                    {/* Member Since */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Member Since
                      </span>
                      {isLoading ? (
                        <LoadingSpinnerSmall />
                      ) : currentUserData?.created_at ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="font-semibold text-foreground">
                              <Badge variant="secondary" className="bg-card shadow-md dark:shadow-primary/10">{formatRelativeTime(currentUserData.created_at)}</Badge>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="text-sm">
                            <p>{formatDateTime(currentUserData.created_at)}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="font-semibold text-foreground">
                          Unknown
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deployed Pods Card - 2/3 width on desktop, full width on mobile, appears second on mobile */}
          <div className="md:col-span-2 md:order-1">
            <Card className="@container/card bg-gradient-to-br from-primary/5 to-kamino-green/5 border-primary/20 h-full">
              <CardHeader>
                <CardTitle>
                  <span className="text-xl font-semibold text-foreground inline-flex items-center gap-2">
                    <Rocket className="size-5 text-kamino-yellow" />
                    My Deployed Pods
                  </span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pods you have already deployed and can interact with
                  </p>
                </CardTitle>
                <CardAction className="text-xs">
                  <Button variant="link" size="sm" className="mt-2">
                    <Eye />
                    <Link href="/pods/deployed" passHref>View All</Link>
                  </Button>
                </CardAction>
              </CardHeader>
              <Separator className="-mb-2 bg-primary/20"/>
              <CardContent className="flex flex-col justify-center flex-1 py-6">
                {isLoading && <div className="flex justify-center"><LoadingSpinnerSmall /></div>}
                {hasError && <ErrorDisplay error={hasError} />}
                {!isLoading && !hasError && deployedPods && (
                  <>
                    {deployedPods.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No deployed pods found.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {deployedPods.slice(0, 3).map((pod, index) => (
                          <div key={pod.name || index} className="mb-4 last:mb-0">
                            <Link href="/pods/deployed" passHref>
                              <div
                                className="flex items-center gap-4 p-4 bg-card rounded-xl w-full cursor-pointer border-2 border-card shadow-md dark:shadow-primary/5 hover:border-primary/15 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                role="button"
                              >
                              <div className="bg-sidebar-accent-foreground/10 text-sidebar-primary-foreground flex size-16 items-center justify-center rounded-lg overflow-hidden shadow-lg shrink-0">
                                <Image
                                  src={pod.template?.image_path ? `/api/v1/template/image/${pod.template.image_path}` : '/kaminoLogo.svg'}
                                  alt={`${pod.name} Logo`}
                                  width={64}
                                  height={64}
                                  className="size-16 object-cover rounded-lg"
                                  unoptimized
                                />
                              </div>
                              <div className="flex flex-col">
                                <h3 className="text-lg font-semibold text-foreground">{formatPodName(pod.template?.name || pod.name)}</h3>
                                <div className="flex items-center gap-2 pt-2">
                                  <Badge variant="secondary" className="gap-2 font-medium shadow">
                                    <Boxes className="h-3 w-3" />
                                    {pod.vms.length} {pod.vms.length === 1 ? 'VM' : 'VMs'}
                                  </Badge>
                                  {pod.vms.filter(vm => vm.status === 'running').length > 0 && (
                                    <Badge variant="secondary" className="gap-2 font-medium shadow">
                                      <IconPlayerPlayFilled className="text-green-400" />
                                      {pod.vms.filter(vm => vm.status === 'running').length} Running
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            </Link>
                          </div>
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
          </div>
        </div>

        {/* Pod Templates Section */}
        <div className="space-y-8">
          <Card className="@container/card bg-gradient-to-br from-primary/5 to-kamino-green/5 border-primary/20">
            <CardHeader>
              <CardTitle>
                <span className="text-xl font-semibold text-foreground inline-flex items-center gap-2">
                  <Copy className="size-5 text-kamino-green" />
                  Pod Templates
                </span>
                <p className="mt-1 text-sm text-muted-foreground">
                  Library of templates created by students and faculty, available for users to clone and interact with.
                </p>
              </CardTitle>
              <CardAction className="text-xs">
                <Button variant="link" size="sm" className="mt-2">
                  <Eye />
                  <Link href="/pods/templates" passHref>View All</Link>
                </Button>
              </CardAction>
            </CardHeader>
            <Separator className="-mb-2 bg-primary/20"/>
            <CardContent>
              {isLoading && <LoadingSpinnerSmall />}
              {hasError && <ErrorDisplay error={hasError} />}
              {!isLoading && !hasError && podTemplates && (
                <>
                  {podTemplates.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No pod templates found.
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {podTemplates.slice(0, 3).map((template, index) => (
                          <div
                            key={template.name || index}
                            onClick={() => openDeployDialog(template)}
                            className="flex flex-col p-4 bg-card rounded-xl cursor-pointer border-2 border-card shadow-md dark:shadow-primary/5 hover:border-primary/15 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none transition-colors h-full"
                            role="button"
                          >
                            <div className="flex items-center gap-4 mb-4">
                              <div className="bg-sidebar-accent-foreground/10 text-sidebar-primary-foreground flex size-16 items-center justify-center rounded-lg overflow-hidden shadow-lg shrink-0">
                                <Image
                                  src={template.image_path ? `/api/v1/template/image/${template.image_path}` : '/kaminoLogo.svg'}
                                  alt={template.name}
                                  width={64}
                                  height={64}
                                  unoptimized
                                  className="size-16 object-cover rounded-lg"
                                />
                              </div>
                              <h3 className="text-lg font-semibold text-foreground">{formatPodName(template.name)}</h3>
                            </div>
                            <div className="flex flex-col flex-grow">
                              <div className="flex flex-wrap gap-2 mt-auto">
                                <Badge variant="secondary" className="gap-2 font-medium shadow">
                                  <Boxes />
                                  {(template.vm_count || 0)} {template.vm_count === 1 ? "VM" : "VMs"}
                                </Badge>
                                <Badge variant="secondary" className="gap-2 font-medium shadow">
                                  <Rocket />
                                  {template.deployments} Deployments
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {podTemplates.length > 3 && (
                        <div className="text-center pt-4">
                          <Link href="/pods/templates" className="text-primary hover:underline text-sm">
                            View {podTemplates.length - 3} more pod templates
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Centralized Deploy Dialog */}
        <PodDeployDialog 
          isOpen={isDialogOpen}
          onClose={closeDeployDialog}
          selectedPod={selectedPod}
        />
      </PageLayout>
    </AuthGuard>
  )
}
