"use client"

import { AuthGuard } from "@/components/auth-guard"
import { PageLayout } from "@/app/admin/admin-page-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Database, Server, Info, Plus, Minus } from "lucide-react"
import Link from "next/link"

const breadcrumbs = [{ label: "Users & Groups Guide", href: "/admin/guides/users" }]

export default function AdminUsersGuide() {

  return (
    <AuthGuard adminOnly>
      <PageLayout
        breadcrumbs={breadcrumbs}
      >
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
            <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6">
            <div>
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">User & Group Management</h1>
              <p className="text-muted-foreground text-xl leading-7 [&:not(:first-child)]:mt-6">
                Comprehensive guide for managing users and groups through Active Directory with automated Proxmox synchronization
              </p>
            </div>

            {/* System Architecture Infographic */}
            <Card>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg">
                  <div className="text-center">
                    <Settings className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-medium">Admin Panel</div>
                    <div className="text-sm text-muted-foreground">User Management</div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="border-t-2 border-dashed border-muted-foreground/30"></div>
                  </div>
                  <div className="text-center">
                    <Database className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                    <div className="font-medium">Active Directory</div>
                    <div className="text-sm text-muted-foreground">LDAP Operations</div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="border-t-2 border-dashed border-muted-foreground/30"></div>
                  </div>
                  <div className="text-center">
                    <Server className="h-8 w-8 mx-auto mb-2 text-green-400" />
                    <div className="font-medium">Proxmox</div>
                    <div className="text-sm text-muted-foreground">VM Access Control</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Management Section */}
            <section>
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">User Management</h2>

              <div className="space-y-6">
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  Users are created, modified, and removed through the <strong><Link href="/admin/users">Users</Link></strong> Kamino admin panel page. All changes are synchronized with Active Directory and Proxmox to ensure consistent access control.
                </p>
              </div>

              {/* Alert for Usernames and Passwords */}
              <Alert className="mt-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950/50 dark:to-blue-900/50 dark:border-blue-800 mb-2">
                <Info />
                <strong>Info</strong>
                <AlertDescription>
                  <p className="mt-2 -mb-1 font-bold">Usernames</p>
                  <ul className="list-disc list-inside">
                    <li>Must be unique across the entire Active Directory domain</li>
                    <li>Must be between 3-20 characters long</li>
                    <li>Can include letters and numbers</li>
                  </ul>
                  <p className="mt-2 -mb-1 font-bold">Passwords</p>
                  <ul className="list-disc list-inside">
                    <li>Must be between 8-128 characters long</li>
                    <li>Must include at least one letter and number</li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <div>
                <div className="pt-4">
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 flex items-center gap-2">
                    <Plus className="h-5 w-5 text-green-400" />
                    Creating Users
                  </h3>
                  <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
                    <li>
                      <strong>Create New User:</strong> Click &ldquo;Add User&rdquo; and fill in required details. There are two methods of user creation:
                      <ul className="list-disc list-inside mt-2">
                        <li><strong>Single:</strong> Create a single user with a simple username and password</li>
                        <li><strong>Bulk:</strong> Input a comma and newline separated list of usernames and passwords</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-400" />
                    Modifying Users
                  </h3>
                  <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
                    <li><strong>Group Membership:</strong> Add or remove the user from groups to change access permissions. Groups that contain &ldquo;Kamino&rdquo; or &ldquo;Admin&rdquo; cannot be modified</li>
                  </ol>
                </div>

                <div>
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 flex items-center gap-2">
                    <Minus className="h-5 w-5 text-red-400" />
                    Removing Users
                  </h3>
                  <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
                    <li><strong>Disable Account:</strong> Disable the account to prevent access</li>
                    <li><strong>Delete Account:</strong> Remove the account from Active Directory and all connected systems</li>
                  </ol>
                </div>

              </div>
            </section>

            {/* Group Management Section */}
            <section>
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Group Management</h2>

              <div className="space-y-6">
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  Groups are created, modified, and removed through the <strong><Link href="/admin/groups">Groups</Link></strong> Kamino admin panel page. All changes are synchronized with Active Directory and Proxmox to ensure consistent access control.
                </p>
              </div>

              <Alert className="mt-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950/50 dark:to-blue-900/50 dark:border-blue-800 mb-2">
                <Info />
                <strong>Info</strong>
                <AlertDescription>
                  <p className="mt-2 -mb-1 font-bold">Group Names</p>
                  <ul className="list-disc list-inside">
                    <li>Must be unique across the entire Active Directory domain</li>
                    <li>Must be between 3-63 characters long</li>
                    <li>Can include letters, numbers, hyphens, and underscores</li>
                    <li>Groups containing &ldquo;Kamino&rdquo; or &ldquo;Admin&rdquo; cannot be modified or removed</li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <div>
                <div className="pt-4">
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 flex items-center gap-2">
                    <Plus className="h-5 w-5 text-green-400" />
                    Creating Groups 
                  </h3>
                  <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
                    <li>
                      <strong>Create New Group:</strong> Click &ldquo;Add Group&rdquo; and specify the group name. There are three methods of group creation:
                      <ul className="list-disc list-inside mt-2">
                        <li><strong>Single:</strong> Create a single group with a unique name</li>
                        <li><strong>Bulk:</strong> Input a newline separated list of group names</li>
                        <li><strong>Prefix:</strong> Create multiple groups with a common prefix and a numbered suffix</li>
                      </ul>
                    </li>
                  </ol>
                </div>
                
                <div className="pt-4">
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-400" />
                    Modifying Groups 
                  </h3>
                  <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
                    <li><strong>Edit Properties:</strong> Rename the group</li>
                  </ol>
                </div>

                <div className="pt-4">
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3 flex items-center gap-2">
                    <Minus className="h-5 w-5 text-red-400" />
                    Removing Groups 
                  </h3>
                  <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
                    <li><strong>Delete Group:</strong> Select the group to be removed and click &ldquo;Delete&rdquo;</li>
                  </ol>
                </div>

              </div>
            </section>
            </div>
          </div>
        </div>
      </PageLayout>
    </AuthGuard>
  )
}
