"use client"

import { AuthGuard } from "@/components/auth-guard"
import { PageLayout } from "@/app/admin/admin-page-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Server, Package, Settings, Upload, Info, TriangleAlert } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const breadcrumbs = [{ label: "Template Management Guide", href: "/admin/guides/templates" }]

export default function AdminTemplatesGuide() {

  return (
    <AuthGuard adminOnly>
      <PageLayout
        breadcrumbs={breadcrumbs}
      >
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
            <div className="flex flex-col gap-6 py-4 md:gap-8 md:py-6">
              <div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">Template Creation & Management</h1>
                <p className="text-muted-foreground text-xl leading-7 [&:not(:first-child)]:mt-6">
                  Complete guide for creating, publishing, and managing VM templates in Kamino through Proxmox integration
                </p>
              </div>

              {/* Template Workflow Infographic */}
              <Card>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg">
                    <div className="text-center">
                      <Server className="h-8 w-8 mx-auto mb-2 text-orange-400" />
                      <div className="font-medium">Proxmox</div>
                      <div className="text-base text-muted-foreground">Create Template</div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="border-t-2 border-dashed border-muted-foreground/30"></div>
                    </div>
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-green-400" />
                      <div className="font-medium">Admin Panel</div>
                      <div className="text-base text-muted-foreground">Publish Template</div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="border-t-2 border-dashed border-muted-foreground/30"></div>
                    </div>
                    <div className="text-center">
                      <Settings className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                      <div className="font-medium">Admin Panel</div>
                      <div className="text-base text-muted-foreground">Manage Template</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Creating Templates Section */}
              <section>
                <div className="space-y-8">
                  <div className="pt-4">
                    <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-4 flex items-center gap-2">
                      <Server className="h-5 w-5 text-blue-400" />
                      Step 1: Create Template Infrastructure in Proxmox
                    </h3>
                    
                    <div className="space-y-6">
                      {/* Pool Creation */}
                      <div>
                        <h4 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          1.1 Create Template Pool
                        </h4>
                        <p className="text-base text-muted-foreground mb-3">
                          Pools in Proxmox help organize and manage related VMs. All template VMs must be placed in a designated pool with the correct naming convention.
                        </p>
                        <ol className="ml-6 list-decimal space-y-2 text-base">
                          <li>Navigate to <strong>Datacenter → Pools</strong> in the Proxmox web interface</li>
                          <li>Click <strong>&ldquo;Create&rdquo;</strong> to add a new pool</li>
                          <li>Use the naming convention: <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">kamino_template_[template_name]</code></li>
                          <li>Example: <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">kamino_template_ubuntu_lab</code> → Template name will be &ldquo;ubuntu lab&rdquo;</li>
                        </ol>
                        
                        <div className="mt-4">
                          <Image 
                            src="/1-Kamino-Template-Pool.png" 
                            alt="Proxmox Create Pool - Shows the pool creation dialog with naming convention" 
                            width={800} 
                            height={400} 
                            className="rounded-lg border my-2" 
                            unoptimized 
                          />
                        </div>
                      </div>

                      {/* VNet Creation */}
                      <div>
                        <h4 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          1.2 Create Template Virtual Network (VNet)
                        </h4>
                        <p className="text-base text-muted-foreground mb-3">
                          Each template requires its own isolated network to prevent conflicts and ensure proper network segmentation.
                        </p>
                        <ol className="ml-6 list-decimal space-y-2 text-base">
                          <li>Navigate to <strong>Datacenter → SDN → VNets</strong></li>
                          <li>Click <strong>&ldquo;Create&rdquo;</strong> to add a new virtual network</li>
                          <li>Next, Name the VNet. Keep in mind the name has a limit of just 8 characters</li>
                          <li>Choose a unique VLAN tag <strong>above 1000</strong> (e.g., 1001, 1002, etc.)</li>
                          <li><strong>Important:</strong> After creating the VNet, go to <strong>Datacenter → SDN</strong> and click <strong>&ldquo;Apply&rdquo;</strong> to activate the changes</li>
                        </ol>

                        <Alert className="mt-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-950/50 dark:to-red-900/50 dark:border-red-800">
                          <TriangleAlert className="h-4 w-4" />
                          <strong>Warning</strong><br />
                          <AlertDescription className="text-base mt-2">
                            Ensure your VLAN tag is unique across all templates and above 1000 to avoid conflicts with system networks.
                          </AlertDescription>
                        </Alert>

                        <div className="grid gap-4 mt-4">
                          <div>
                            <Image 
                              src="/2-Creating-VNET.png" 
                              alt="Proxmox Create VNet - Main VNet creation interface" 
                              width={800} 
                              height={400} 
                              className="rounded-lg border" 
                              unoptimized 
                            />
                            <p className="text-sm text-muted-foreground mt-1">VNet creation interface in Proxmox SDN</p>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Image 
                                src="/3-VNET-Dialog.png" 
                                alt="Proxmox VNet Dialog - Configuration options for the virtual network" 
                                width={400} 
                                height={300} 
                                className="rounded-lg border w-full" 
                                unoptimized 
                              />
                              <p className="text-sm text-muted-foreground mt-1">VNet configuration dialog</p>
                            </div>
                            <div>
                              <Image 
                                src="/4-SDN-Apply.png" 
                                alt="Proxmox Apply SDN Changes - Applying network configuration changes" 
                                width={400} 
                                height={300} 
                                className="rounded-lg border w-full" 
                                unoptimized 
                              />
                              <p className="text-sm text-muted-foreground mt-1">Applying SDN configuration changes</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* VM Creation */}
                      <div>
                        <h4 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          1.3 Create and Configure Virtual Machines
                        </h4>
                        <p className="text-base text-muted-foreground mb-3">
                          Set up all VMs within the created pool with your desired operating systems and configurations. Follow the specific steps below for different OS types.
                        </p>

                        {/* ISO Upload */}
                        <div className="mb-6">
                          <h5 className="font-medium text-xl mb-2">Uploading ISO Files</h5>

                          <Alert className="mt-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950/50 dark:to-blue-900/50 dark:border-blue-800 mb-2">
                            <Info />
                            <strong>Info</strong>
                            <AlertDescription>
                              Prior to uploading an ISO, check if your OS is not already a template in the Templates pool in Proxmox these templates should have VmIDs in the range of the 4000s. To use these, simply clone the desired template into your pool.
                            </AlertDescription>
                          </Alert>
                          
                          <p className="text-base text-muted-foreground mb-2">
                            Upload the necessary ISO files to your mufasa-proxmox.
                          </p>
                          <Image 
                            src="/1-Uploading-ISO.png" 
                            alt="Proxmox Uploading ISO - Process for uploading ISO files to Proxmox storage" 
                            width={800} 
                            height={400} 
                            className="rounded-lg border my-2" 
                            unoptimized 
                          />
                          <p className="text-sm text-muted-foreground">Uploading ISO files to Proxmox storage</p>
                        </div>
                        
                        {/* Linux VM Configuration */}
                        <div className="mb-6">
                          <h5 className="font-medium text-xl mb-2 text-green-600 dark:text-green-400">Linux VM Configuration</h5>
                          <p className="text-base text-muted-foreground mb-3">
                            Follow these steps to create a Linux-based virtual machine. Ensure you select the appropriate settings for optimal performance.
                          </p>
                          <div className="grid gap-3">
                            <div>
                              <Image 
                                src="/2-Linux-VM-Via-ISO.png" 
                                alt="Linux VM Creation - Initial VM creation from ISO" 
                                width={800} 
                                height={400} 
                                className="rounded-lg border" 
                                unoptimized 
                              />
                              <p className="text-sm text-muted-foreground mt-1">Creating a new Linux VM from ISO</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                              <div>
                                <Image 
                                  src="/3-Linux-VM-General.png" 
                                  alt="Linux VM General Settings - Basic VM configuration options" 
                                  width={400} 
                                  height={300} 
                                  className="rounded-lg border w-full" 
                                  unoptimized 
                                />
                                <p className="text-sm text-muted-foreground mt-1">General VM settings and pool assignment</p>
                              </div>
                              <div>
                                <Image 
                                  src="/4-Linux-VM-OS.png" 
                                  alt="Linux VM OS Settings - Operating system configuration" 
                                  width={400} 
                                  height={300} 
                                  className="rounded-lg border w-full" 
                                  unoptimized 
                                />
                                <p className="text-sm text-muted-foreground mt-1">Operating system selection and configuration</p>
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                              <div>
                                <Image 
                                  src="/5-Linux-VM-Disks.png" 
                                  alt="Linux VM Disk Settings - Storage configuration for the VM" 
                                  width={400} 
                                  height={300} 
                                  className="rounded-lg border w-full" 
                                  unoptimized 
                                />
                                <p className="text-sm text-muted-foreground mt-1">Disk configuration and storage allocation</p>
                              </div>
                              <div>
                                <Image 
                                  src="/6-Linux-VM-Network.png" 
                                  alt="Linux VM Network Settings - Network configuration using the created VNet" 
                                  width={400} 
                                  height={300} 
                                  className="rounded-lg border w-full" 
                                  unoptimized 
                                />
                                <p className="text-sm text-muted-foreground mt-1">Network configuration with the template VNet</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Windows VM Configuration */}
                        <div className="mb-6">
                          <h5 className="font-medium text-xl mb-2 text-blue-600 dark:text-blue-400">Windows VM Configuration</h5>
                          <p className="text-base text-muted-foreground mb-3">
                            Windows VMs require specific drivers and configurations for optimal performance in a virtualized environment. Pay attention to driver selection and hardware compatibility.
                          </p>
                          <div className="grid gap-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Image 
                                  src="/1-Windows-VM-OS.png" 
                                  alt="Windows VM OS Selection - Choosing Windows operating system type" 
                                  width={400} 
                                  height={300} 
                                  className="rounded-lg border w-full" 
                                  unoptimized 
                                />
                                <p className="text-sm text-muted-foreground mt-1">Windows OS type selection</p>
                              </div>
                              <div>
                                <Image 
                                  src="/2-Windows-VM-Load-Driver.png" 
                                  alt="Windows VM Driver Loading - Loading VirtIO drivers for better performance" 
                                  width={400} 
                                  height={300} 
                                  className="rounded-lg border w-full" 
                                  unoptimized 
                                />
                                <p className="text-sm text-muted-foreground mt-1">Loading VirtIO drivers during installation</p>
                              </div>
                              <div>
                                <Image 
                                  src="/3-Windows-VM-AMD64.png" 
                                  alt="Windows VM Architecture - Selecting appropriate architecture" 
                                  width={400} 
                                  height={300} 
                                  className="rounded-lg border w-full" 
                                  unoptimized 
                                />
                                <p className="text-sm text-muted-foreground mt-1">Architecture and system type selection</p>
                              </div>
                              <div>
                                <Image 
                                  src="/4-Windows-VM-Virtio.png" 
                                  alt="Windows VM VirtIO Configuration - Final VirtIO driver configuration" 
                                  width={400} 
                                  height={300} 
                                  className="rounded-lg border w-full" 
                                  unoptimized 
                                />
                                <p className="text-sm text-muted-foreground mt-1">VirtIO driver configuration for optimal performance</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* VM Preparation */}
                      <div>
                        <h4 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          1.4 Prepare VMs for Template Conversion
                        </h4>
                        <p className="text-base text-muted-foreground mb-3">
                          Before converting VMs to templates, proper cleanup and optimization ensures better performance and smaller template sizes.
                        </p>
                        <ol className="ml-6 list-decimal space-y-2 text-base">
                          <li><strong>Complete Shutdown:</strong> Ensure all VMs are completely shut down before proceeding</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-4 flex items-center gap-2">
                      <Upload className="h-5 w-5 text-green-400" />
                      Step 2: Publish Template in Kamino Admin Panel
                    </h3> 

                    <p className="text-base text-muted-foreground mb-4">
                      Once your VMs are properly configured and prepared, use the Kamino admin panel to convert them into deployable templates. This process will convert the VMs to Proxmox templates and make them available for users to deploy.
                    </p>

                    <Alert className="mb-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-950/50 dark:to-red-900/50 dark:border-red-800">
                      <TriangleAlert className="h-4 w-4" />
                      <strong>Warning</strong><br />
                      <AlertDescription className="text-base mt-2">
                        Publishing a template will automatically:
                        <ul className="ml-8 list-disc text-base space-y-1">
                          <li>Remove all snapshots from VMs in the Proxmox pool</li>
                          <li>Convert VMs to read-only VM templates in Proxmox</li>
                          <li>Make future VM modifications extremely difficult</li>
                        </ul>
                        <strong>Ensure all configurations are finalized before proceeding.</strong>
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <h4 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Publishing Process
                      </h4>
                      
                      <ol className="ml-6 list-decimal space-y-3 text-base">
                        <li>
                          <strong>Navigate to Publishing Interface:</strong> In the Kamino admin panel, go to{' '}
                          <Link href="/admin/pods/templates/publish" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">
                            Publish Templates
                          </Link>{' '}
                          section
                        </li>
                        <li>
                          <strong>Configure Template Details:</strong> Complete all required information fields:
                          <ul className="mt-2 ml-4 list-disc space-y-1">
                            <li><strong>Template Name:</strong> Descriptive name for the template (auto-generated from pool name)</li>
                            <li><strong>Description:</strong> Detailed explanation of what the template contains and its intended use</li>
                            <li><strong>Template Image:</strong> Upload a representative image or logo for the template</li>
                            <li><strong>Authors:</strong> List of template creators or maintainers</li>
                            <li><strong>VM Count:</strong> Number of virtual machines included in the template</li>
                            <li><strong>Visibility:</strong> Set initial visibility (Public or Private)</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Review Template Preview:</strong> Carefully review all template information and settings in the preview
                        </li>
                        <li>
                          <strong>Confirm Creation:</strong> Click &ldquo;Publish Template&rdquo; to finalize the process
                        </li>
                      </ol>
                    </div>
                  </div>

                  <div>
                    <h3 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-4 flex items-center gap-2">
                      <Settings className="h-5 w-5 text-blue-400" />
                      Step 3: Manage and Maintain Templates
                    </h3>

                    <Alert className="mt-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950/50 dark:to-blue-900/50 dark:border-blue-800 mb-2">
                      <Info />
                      <strong>Info</strong>
                      <AlertDescription>
                        Deleting a template will not delete the underlying VMs in Proxmox. You must manually delete the VMs from Proxmox if you wish to remove them.
                      </AlertDescription>
                    </Alert>

                    <ol className="my-4 ml-6 list-decimal [&>li]:mt-2">
                      <li><strong>Admin Panel:</strong> In the Kamino admin panel, navigate to the <strong><Link href="/admin/pods/templates">All Templates</Link></strong> section</li>
                      <li><strong>Manage:</strong> Click on the actions dropdown menu on the far right of the table row. You can edit all of the template details, quickly toggle the visibility of the template, or delete the template.</li>
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
