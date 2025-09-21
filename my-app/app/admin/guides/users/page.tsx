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
        <div className="@container/main flex flex-1 flex-col">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="flex flex-col gap-8 py-6 md:gap-12 md:py-8 lg:py-10">
            <div className="space-y-4">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance leading-tight">
                User & Group Management
              </h1>
              <p className="text-muted-foreground text-xl leading-relaxed max-w-4xl">
                Comprehensive guide for managing users and groups through Active Directory with automated Proxmox synchronization
              </p>
            </div>

            {/* System Architecture Infographic */}
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <Settings className="h-10 w-10 mx-auto mb-3 text-primary" />
                    <div className="font-semibold text-lg mb-1">Admin Panel</div>
                    <div className="text-base text-muted-foreground">User Management</div>
                  </div>
                  <div className="flex-1 mx-8">
                    <div className="border-t-2 border-dashed border-muted-foreground/30"></div>
                  </div>
                  <div className="text-center flex-1">
                    <Database className="h-10 w-10 mx-auto mb-3 text-blue-400" />
                    <div className="font-semibold text-lg mb-1">Active Directory</div>
                    <div className="text-base text-muted-foreground">LDAP Operations</div>
                  </div>
                  <div className="flex-1 mx-8">
                    <div className="border-t-2 border-dashed border-muted-foreground/30"></div>
                  </div>
                  <div className="text-center flex-1">
                    <Server className="h-10 w-10 mx-auto mb-3 text-green-400" />
                    <div className="font-semibold text-lg mb-1">Proxmox</div>
                    <div className="text-base text-muted-foreground">VM Access Control</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Management Section */}
            <section className="space-y-8">
              <div className="space-y-6">
                <h2 className="scroll-m-20 border-b pb-4 text-3xl lg:text-4xl font-semibold tracking-tight">
                  User Management
                </h2>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  Users are created, modified, and removed through the <strong><Link href="/admin/users" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">Users</Link></strong> Kamino admin panel page. All changes are synchronized with Active Directory and Proxmox to ensure consistent access control.
                </p>
              </div>

              {/* Alert for Usernames and Passwords */}
              <Alert className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950/50 dark:to-blue-900/50 dark:border-blue-800 p-6">
                <Info className="h-4 w-4" />
                <div className="ml-2">
                  <strong className="text-lg">Info</strong>
                  <AlertDescription className="mt-3 space-y-4">
                    <div>
                      <p className="font-bold text-base mb-2">Usernames</p>
                      <ul className="list-disc list-inside space-y-1 text-base leading-relaxed">
                        <li>Must be unique across the entire Active Directory domain</li>
                        <li>Must be between 3-20 characters long</li>
                        <li>Can include letters and numbers</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-base mb-2">Passwords</p>
                      <ul className="list-disc list-inside space-y-1 text-base leading-relaxed">
                        <li>Must be between 8-128 characters long</li>
                        <li>Must include at least one letter and number</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
              
              <div className="space-y-10">
                <div className="space-y-6">
                  <h3 className="scroll-m-20 text-2xl lg:text-3xl font-semibold tracking-tight flex items-center gap-3">
                    <Plus className="h-5 w-5 text-green-400" />
                    Creating Users
                  </h3>
                  <ol className="ml-6 list-decimal space-y-4 text-lg leading-relaxed">
                    <li>
                      <strong>Create New User:</strong> Click &ldquo;Add User&rdquo; and fill in required details. There are two methods of user creation:
                      <ul className="list-disc list-inside mt-3 ml-4 space-y-2 text-base">
                        <li><strong>Single:</strong> Create a single user with a simple username and password</li>
                        <li><strong>Bulk:</strong> Input a comma and newline separated list of usernames and passwords</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <div className="space-y-6">
                  <h3 className="scroll-m-20 text-2xl lg:text-3xl font-semibold tracking-tight flex items-center gap-3">
                    <Settings className="h-5 w-5 text-blue-400" />
                    Modifying Users
                  </h3>
                  <ol className="ml-6 list-decimal space-y-4 text-lg leading-relaxed">
                    <li><strong>Group Membership:</strong> Add or remove the user from groups to change access permissions. Groups that contain &ldquo;Kamino&rdquo; or &ldquo;Admin&rdquo; cannot be modified</li>
                  </ol>
                </div>

                <div className="space-y-6">
                  <h3 className="scroll-m-20 text-2xl lg:text-3xl font-semibold tracking-tight flex items-center gap-3">
                    <Minus className="h-5 w-5 text-red-400" />
                    Removing Users
                  </h3>
                  <ol className="ml-6 list-decimal space-y-4 text-lg leading-relaxed">
                    <li><strong>Disable Account:</strong> Disable the account to prevent access</li>
                    <li><strong>Delete Account:</strong> Remove the account from Active Directory and all connected systems</li>
                  </ol>
                </div>

              </div>
            </section>

            {/* Group Management Section */}
            <section className="space-y-8">
              <div className="space-y-6">
                <h2 className="scroll-m-20 border-b pb-4 text-3xl lg:text-4xl font-semibold tracking-tight">
                  Group Management
                </h2>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  Groups are created, modified, and removed through the <strong><Link href="/admin/groups" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">Groups</Link></strong> Kamino admin panel page. All changes are synchronized with Active Directory and Proxmox to ensure consistent access control.
                </p>
              </div>

              <Alert className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950/50 dark:to-blue-900/50 dark:border-blue-800 p-6">
                <Info className="h-4 w-4" />
                <div className="ml-2">
                  <strong className="text-lg">Info</strong>
                  <AlertDescription className="mt-3">
                    <div>
                      <p className="font-bold text-base mb-2">Group Names</p>
                      <ul className="list-disc list-inside space-y-1 text-base leading-relaxed">
                        <li>Must be unique across the entire Active Directory domain</li>
                        <li>Must be between 3-63 characters long</li>
                        <li>Can include letters, numbers, hyphens, and underscores</li>
                        <li>Groups containing &ldquo;Kamino&rdquo; or &ldquo;Admin&rdquo; cannot be modified or removed</li>
                      </ul>
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
              
              <div className="space-y-10">
                <div className="space-y-6">
                  <h3 className="scroll-m-20 text-2xl lg:text-3xl font-semibold tracking-tight flex items-center gap-3">
                    <Plus className="h-5 w-5 text-green-400" />
                    Creating Groups 
                  </h3>
                  <ol className="ml-6 list-decimal space-y-4 text-lg leading-relaxed">
                    <li>
                      <strong>Create New Group:</strong> Click &ldquo;Add Group&rdquo; and specify the group name. There are three methods of group creation:
                      <ul className="list-disc list-inside mt-3 ml-4 space-y-2 text-base">
                        <li><strong>Single:</strong> Create a single group with a unique name</li>
                        <li><strong>Bulk:</strong> Input a newline separated list of group names</li>
                        <li><strong>Prefix:</strong> Create multiple groups with a common prefix and a numbered suffix</li>
                      </ul>
                    </li>
                  </ol>
                </div>
                
                <div className="space-y-6">
                  <h3 className="scroll-m-20 text-2xl lg:text-3xl font-semibold tracking-tight flex items-center gap-3">
                    <Settings className="h-5 w-5 text-blue-400" />
                    Modifying Groups 
                  </h3>
                  <ol className="ml-6 list-decimal space-y-4 text-lg leading-relaxed">
                    <li><strong>Edit Properties:</strong> Rename the group</li>
                  </ol>
                </div>

                <div className="space-y-6">
                  <h3 className="scroll-m-20 text-2xl lg:text-3xl font-semibold tracking-tight flex items-center gap-3">
                    <Minus className="h-5 w-5 text-red-400" />
                    Removing Groups 
                  </h3>
                  <ol className="ml-6 list-decimal space-y-4 text-lg leading-relaxed">
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
