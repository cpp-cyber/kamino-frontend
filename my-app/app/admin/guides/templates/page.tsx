"use client"

import { AuthGuard } from "@/components/auth-guard"
import { PageLayout } from "@/app/admin/admin-page-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Server,
  Settings,
  Info,
  TriangleAlert,
  List,
  Link2,
  PenBox,
  LucideMousePointerClick,
  FileText,
  User,
  Boxes,
  ImageIcon,
  Eye,
  Tag,
  Network,
  Search,
  Upload,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

const breadcrumbs = [{ label: "Template Creation & Management Guide", href: "/admin/guides/templates" }]

// Table of Contents structure
const tableOfContents = [
  { id: "step-1", title: "Step 1: Create Template", level: 1 },
  { id: "pool-creation", title: "1.1 Create Template Pool", level: 2 },
  { id: "vnet-creation", title: "1.2 Create Template Virtual Network (VNet)", level: 2 },
  { id: "vm-creation", title: "1.3 Create and Configure Virtual Machines", level: 2 },
  { id: "vm-preparation", title: "1.4 Prepare VMs for Template Conversion", level: 2 },
  { id: "step-2", title: "Step 2: Publish Template", level: 1 },
  { id: "publishing-wizard", title: "2.1 Navigate to Publishing Wizard", level: 2 },
  { id: "configure-details", title: "2.2 Configure Template Details", level: 2 },
  { id: "select-template", title: "2.2.1 Select Template", level: 3 },
  { id: "description", title: "2.2.2 Description", level: 3 },
  { id: "authors", title: "2.2.3 Authors", level: 3 },
  { id: "vm-count", title: "2.2.4 VM Count", level: 3 },
  { id: "image", title: "2.2.5 Image", level: 3 },
  { id: "preview-template", title: "2.2.6 Preview Template", level: 3 },
  { id: "visibility", title: "2.2.7 Visibility", level: 3 },
  { id: "step-3", title: "Step 3: Manage Template", level: 1 }
]

// Table of Contents Component
function TableOfContents() {
  const [maxHeight, setMaxHeight] = useState('calc(100vh - 2rem)')

  useEffect(() => {
    const updateHeight = () => {
      setMaxHeight(`${window.innerHeight - 32}px`) // 32px for top/bottom padding
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)

    return () => {
      window.removeEventListener('resize', updateHeight)
    }
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Account for any fixed headers
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="fixed top-14 right-4 z-50 w-80 invisible 2xl:visible">
      <Card className="bg-transparent border-none">
        <CardHeader className="-mb-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <List className="h-4 w-4" />
            Table of Contents
          </div>
        </CardHeader>
        <CardContent className="pt-0 overflow-y-auto" style={{ maxHeight }}>
          <nav className="space-y-1">
            {tableOfContents.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left text-xs hover:text-primary transition-colors duration-200 block py-1 ${
                  item.level === 1 ? 'font-medium' : 
                  item.level === 2 ? 'ml-3 text-muted-foreground' : 
                  'ml-6 text-muted-foreground'
                }`}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>
    </div>
  )
}

const markdownExampleText = `## Headers

# This is a Heading h1
## This is a Heading h2
### This is a Heading h3

## Emphasis

*This text will be italic*  
_This will also be italic_

**This text will be bold**  
__This will also be bold__

_You **can** combine them_

## Lists

### Unordered

* Item 1
* Item 2
* Item 2a
* Item 2b
    * Item 3a
    * Item 3b

### Ordered

1. Item 1
2. Item 2
3. Item 3
    1. Item 3a
    2. Item 3b

## Images

![This is an alt text.](/2-Linux-VM-Via-ISO.png)

## Links

Wow look at [Cheese dot com](https://cheese.com).

## Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

## Tables

| Left columns  | Right columns |
| ------------- |:-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |

## Blocks of code

${'```'}typescript
// 3. Wait for running VMs to be stopped
// If a VM cannot be verified as stopped, this function will error out
for _, vm := range runningVMs {
	if err := cs.ProxmoxService.WaitForStopped(vm.NodeName, vm.VmId); err != nil {
		log.Printf("Error waiting for VM %d to stop: %v", vm.VmId, err)
		return fmt.Errorf("failed to confirm VM %d is stopped: %w", vm.VmId, err)
	}
}
${'```'}

## Inline code

This code is ${'`'}inline${'`'}.`

export default function AdminTemplatesGuide() {

  return (
    <AuthGuard adminOnly>
      <TableOfContents />
      <PageLayout
        breadcrumbs={breadcrumbs}
      >
        <div className="@container/main flex flex-1 flex-col">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="flex flex-col gap-8 py-6 md:gap-12 md:py-8 lg:py-10">
              <div className="space-y-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance leading-tight">
                  Template Creation & Management
                </h1>
                <p className="text-muted-foreground text-xl leading-relaxed max-w-4xl">
                  Complete guide for creating, publishing, and managing VM templates in Kamino through Proxmox integration
                </p>
              </div>

              {/* Template Workflow Infographic */}
              <Card className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <Server className="h-10 w-10 mx-auto mb-3 text-orange-400" />
                      <div className="font-semibold text-lg mb-1">Proxmox</div>
                      <div className="text-sm text-muted-foreground">Create Template</div>
                    </div>
                    <div className="flex-1 mx-8">
                      <div className="border-t-2 border-dashed border-muted-foreground/30"></div>
                    </div>
                    <div className="text-center flex-1">
                      <Upload className="h-10 w-10 mx-auto mb-3 text-green-400" />
                      <div className="font-semibold text-lg mb-1">Admin Panel</div>
                      <div className="text-sm text-muted-foreground">Publish Template</div>
                    </div>
                    <div className="flex-1 mx-8">
                      <div className="border-t-2 border-dashed border-muted-foreground/30"></div>
                    </div>
                    <div className="text-center flex-1">
                      <Settings className="h-10 w-10 mx-auto mb-3 text-blue-400" />
                      <div className="font-semibold text-lg mb-1">Admin Panel</div>
                      <div className="text-sm text-muted-foreground">Manage Template</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Creating Templates Section */}
              <section className="space-y-10">
                <div className="space-y-12">
                  <div className="space-y-8">
                    <h3 id="step-1" className="scroll-m-20 text-3xl lg:text-4xl font-semibold tracking-tight flex items-center gap-3">
                      Step 1: Create Template
                    </h3>
                    
                    <div className="space-y-10">
                      {/* Pool Creation */}
                      <div className="space-y-6">
                        <h4 id="pool-creation" className="text-2xl lg:text-3xl font-semibold flex items-center gap-3 text-foreground">
                          <Tag className="h-5 w-5 text-blue-500" />
                          1.1 Create Template Pool
                        </h4>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          Pools in Proxmox help organize and manage related VMs. All template VMs must be placed in a designated pool with the correct naming convention.
                        </p>
                        <ol className="ml-6 list-decimal space-y-3 text-lg leading-relaxed">
                          <li>Navigate to <strong>Datacenter → Pools</strong> in the Proxmox web interface</li>
                          <li>Click <strong>&ldquo;Create&rdquo;</strong> to add a new pool</li>
                          <li>Use the naming convention: <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">kamino_template_[template_name]</code></li>
                          <li>Example: <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">kamino_template_test_linux</code> → Template name will be &ldquo;Test Linux&rdquo;</li>
                        </ol>
                        
                        <div className="mt-8">
                          <Image 
                            src="/1-Kamino-Template-Pool.png" 
                            alt="Proxmox Create Pool - Shows the pool creation dialog with naming convention" 
                            width={800} 
                            height={400} 
                            className="rounded-lg border shadow-sm w-full" 
                            unoptimized 
                          />
                        </div>
                      </div>

                      {/* VNet Creation */}
                      <div className="space-y-6">
                        <h4 id="vnet-creation" className="text-2xl lg:text-3xl font-semibold flex items-center gap-3 text-foreground">
                          <Network className="h-5 w-5 text-green-500" />
                          1.2 Create Template Virtual Network (VNet)
                        </h4>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          Each template requires its own isolated network to prevent conflicts and ensure proper network segmentation.
                        </p>
                        <ol className="ml-6 list-decimal space-y-3 text-lg leading-relaxed">
                          <li>Navigate to <strong>Datacenter → SDN → VNets</strong></li>
                          <li>Click <strong>&ldquo;Create&rdquo;</strong> to add a new virtual network</li>
                          <li>Next, Name the VNet. Keep in mind the name has a limit of just 8 characters</li>
                          <li>Choose a unique VLAN tag <strong>above 1000</strong> (e.g., 1001, 1002, etc.)</li>
                          <li><strong>Important:</strong> After creating the VNet, go to <strong>Datacenter → SDN</strong> and click <strong>&ldquo;Apply&rdquo;</strong> to activate the changes</li>
                        </ol>

                        <Alert className="my-8 bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-950/50 dark:to-red-900/50 dark:border-red-800 p-6">
                          <TriangleAlert className="h-4 w-4" />
                          <div className="ml-2">
                            <strong className="text-lg">Warning</strong>
                            <AlertDescription className="text-base mt-3 leading-relaxed">
                              Ensure your VLAN tag is unique across all templates and above 1000 to avoid conflicts with system networks.
                            </AlertDescription>
                          </div>
                        </Alert>

                        <div className="space-y-8 mt-8">
                          <div>
                            <Image 
                              src="/2-Creating-VNET.png" 
                              alt="Proxmox Create VNet - Main VNet creation interface" 
                              width={800} 
                              height={400} 
                              className="rounded-lg border shadow-sm w-full" 
                              unoptimized 
                            />
                            <p className="text-sm text-muted-foreground mt-3 text-center">VNet creation interface in Proxmox SDN</p>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <Image 
                                src="/3-VNET-Dialog.png" 
                                alt="Proxmox VNet Dialog - Configuration options for the virtual network" 
                                width={400} 
                                height={300} 
                                className="rounded-lg border shadow-sm w-full" 
                                unoptimized 
                              />
                              <p className="text-sm text-muted-foreground mt-3 text-center">VNet configuration dialog</p>
                            </div>
                            <div>
                              <Image 
                                src="/4-SDN-Apply.png" 
                                alt="Proxmox Apply SDN Changes - Applying network configuration changes" 
                                width={400} 
                                height={300} 
                                className="rounded-lg border shadow-sm w-full" 
                                unoptimized 
                              />
                              <p className="text-sm text-muted-foreground mt-3 text-center">Applying SDN configuration changes</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* VM Creation */}
                      <div className="space-y-8">
                        <h4 id="vm-creation" className="text-2xl lg:text-3xl font-semibold flex items-center gap-3 text-foreground">
                          <Upload className="h-5 w-5 text-purple-500" />
                          1.3 Create and Configure Virtual Machines
                        </h4>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          Set up all VMs within the created pool with your desired operating systems and configurations. Follow the specific steps below for different OS types.
                        </p>

                        {/* ISO Upload */}
                        <div className="space-y-6">
                          <h5 className="font-semibold text-xl lg:text-2xl text-foreground">Uploading ISO Files</h5>

                          <Alert className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950/50 dark:to-blue-900/50 dark:border-blue-800 p-6">
                            <Info className="h-4 w-4" />
                            <div className="ml-2">
                              <strong className="text-lg">Info</strong>
                              <AlertDescription className="mt-3 text-base leading-relaxed">
                                Prior to uploading an ISO, check if your OS is not already a template in the Templates pool in Proxmox these templates should have VmIDs in the range of the 4000s. To use these, simply clone the desired template into your pool.
                              </AlertDescription>
                            </div>
                          </Alert>
                          
                          <p className="text-lg text-muted-foreground leading-relaxed">
                            Upload the necessary ISO files to your mufasa-proxmox.
                          </p>
                          <div className="mt-6">
                            <Image 
                              src="/1-Uploading-ISO.png" 
                              alt="Proxmox Uploading ISO - Process for uploading ISO files to Proxmox storage" 
                              width={800} 
                              height={400} 
                              className="rounded-lg border shadow-sm w-full" 
                              unoptimized 
                            />
                            <p className="text-sm text-muted-foreground mt-3 text-center">Uploading ISO files to Proxmox storage</p>
                          </div>
                        </div>
                        
                        {/* Linux VM Configuration */}
                        <div className="space-y-6">
                          <h5 className="font-semibold text-xl lg:text-2xl text-green-600 dark:text-green-400">Linux VM Configuration</h5>
                          <p className="text-lg text-muted-foreground leading-relaxed">
                            Follow these steps to create a Linux-based virtual machine. Ensure you select the appropriate settings for optimal performance.
                          </p>
                          <div className="space-y-8">
                            <div>
                              <Image 
                                src="/2-Linux-VM-Via-ISO.png" 
                                alt="Linux VM Creation - Initial VM creation from ISO" 
                                width={800} 
                                height={400} 
                                className="rounded-lg border shadow-sm w-full" 
                                unoptimized 
                              />
                              <p className="text-sm text-muted-foreground mt-3 text-center">Creating a new Linux VM from ISO</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <Image 
                                  src="/3-Linux-VM-General.png" 
                                  alt="Linux VM General Settings - Basic VM configuration options" 
                                  width={400} 
                                  height={300} 
                                  className="rounded-lg border shadow-sm w-full" 
                                  unoptimized 
                                />
                                <p className="text-sm text-muted-foreground mt-3 text-center">General VM settings and pool assignment</p>
                              </div>
                              <div>
                                <Image 
                                  src="/4-Linux-VM-OS.png" 
                                  alt="Linux VM OS Settings - Operating system configuration" 
                                  width={400} 
                                  height={300} 
                                  className="rounded-lg border shadow-sm w-full" 
                                  unoptimized 
                                />
                                <p className="text-sm text-muted-foreground mt-3 text-center">Operating system selection and configuration</p>
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <Image 
                                  src="/5-Linux-VM-Disks.png" 
                                  alt="Linux VM Disk Settings - Storage configuration for the VM" 
                                  width={400} 
                                  height={300} 
                                  className="rounded-lg border shadow-sm w-full" 
                                  unoptimized 
                                />
                                <p className="text-sm text-muted-foreground mt-3 text-center">Disk configuration and storage allocation</p>
                              </div>
                              <div>
                                <Image 
                                  src="/6-Linux-VM-Network.png" 
                                  alt="Linux VM Network Settings - Network configuration using the created VNet" 
                                  width={400} 
                                  height={300} 
                                  className="rounded-lg border shadow-sm w-full" 
                                  unoptimized 
                                />
                                <p className="text-sm text-muted-foreground mt-3 text-center">Network configuration with the template VNet</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Windows VM Configuration */}
                        <div className="space-y-6">
                          <h5 className="font-semibold text-xl lg:text-2xl text-blue-600 dark:text-blue-400">Windows VM Configuration</h5>
                          <p className="text-lg text-muted-foreground leading-relaxed">
                            Windows VMs require specific drivers and configurations for optimal performance in a virtualized environment. Pay attention to driver selection and hardware compatibility.
                          </p>
                          <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Image 
                                  src="/1-Windows-VM-OS.png" 
                                  alt="Windows VM OS Selection - Choosing Windows operating system type" 
                                  width={400} 
                                  height={300} 
                                  className="rounded-lg border shadow-sm w-full" 
                                  unoptimized 
                                />
                                <p className="text-sm text-muted-foreground mt-3 text-center">Windows OS type selection</p>
                              </div>
                              <div>
                                <Image 
                                  src="/2-Windows-VM-Load-Driver.png" 
                                  alt="Windows VM Driver Loading - Loading VirtIO drivers for better performance" 
                                  width={400} 
                                  height={300} 
                                  className="rounded-lg border shadow-sm w-full" 
                                  unoptimized 
                                />
                                <p className="text-sm text-muted-foreground mt-3 text-center">Loading VirtIO drivers during installation</p>
                              </div>
                              <div>
                                <Image 
                                  src="/3-Windows-VM-AMD64.png" 
                                  alt="Windows VM Architecture - Selecting appropriate architecture" 
                                  width={400} 
                                  height={300} 
                                  className="rounded-lg border shadow-sm w-full" 
                                  unoptimized 
                                />
                                <p className="text-sm text-muted-foreground mt-3 text-center">Architecture and system type selection</p>
                              </div>
                              <div>
                                <Image 
                                  src="/4-Windows-VM-Virtio.png" 
                                  alt="Windows VM VirtIO Configuration - Final VirtIO driver configuration" 
                                  width={400} 
                                  height={300} 
                                  className="rounded-lg border shadow-sm w-full" 
                                  unoptimized 
                                />
                                <p className="text-sm text-muted-foreground mt-3 text-center">VirtIO driver configuration for optimal performance</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* VM Preparation */}
                      <div className="space-y-6">
                        <h4 id="vm-preparation" className="text-2xl lg:text-3xl font-semibold flex items-center gap-3 text-foreground">
                          <Settings className="h-5 w-5 text-orange-500" />
                          1.4 Prepare VMs for Template Conversion
                        </h4>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          Before converting VMs to templates, proper cleanup and optimization ensures better performance and smaller template sizes.
                        </p>
                        <ol className="ml-6 list-decimal space-y-3 text-lg leading-relaxed">
                          <li><strong>Complete Shutdown:</strong> Ensure all VMs are completely shut down before proceeding</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h3 id="step-2" className="scroll-m-20 text-3xl lg:text-4xl font-semibold tracking-tight flex items-center gap-3">
                      Step 2: Publish Template
                    </h3> 

                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Once your VMs are properly configured and prepared, use the Kamino admin panel to convert them into deployable templates. This process will convert the VMs to Proxmox templates and make them available for users to deploy.
                    </p>

                    <Alert className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-950/50 dark:to-red-900/50 dark:border-red-800 p-6">
                      <TriangleAlert className="h-4 w-4" />
                      <div className="ml-2">
                        <strong className="text-lg">Warning</strong>
                        <AlertDescription className="text-base mt-3 leading-relaxed">
                          Publishing a template will automatically:
                          <ul className="ml-6 list-disc text-base space-y-2 mt-3">
                            <li>Remove all snapshots from VMs in the Proxmox pool</li>
                            <li>Convert VMs to read-only VM templates in Proxmox</li>
                            <li>Make future VM modifications extremely difficult</li>
                          </ul>
                          <strong className="block mt-4">Ensure all configurations are finalized before proceeding.</strong>
                        </AlertDescription>
                      </div>
                    </Alert>

                    <div className="space-y-10">
                      <div className="space-y-6">
                        <h4 id="publishing-wizard" className="text-2xl lg:text-3xl font-semibold flex items-center gap-3 text-foreground">
                          <Link2 className="h-5 w-5 text-blue-500" />
                          2.1 Navigate to Publishing Wizard
                        </h4>

                        <p className="text-lg leading-relaxed">
                          In the Kamino admin panel, go to{' '}
                            <Link href="/admin/pods/templates/publish" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium">
                               Publish Templates
                            </Link>
                        </p>
                      </div>

                      <div className="space-y-6">
                        <h4 id="configure-details" className="text-2xl lg:text-3xl font-semibold flex items-center gap-3 text-foreground">
                          <PenBox className="h-5 w-5 text-green-500" />
                          2.2 Configure Template Details
                        </h4>

                        <div className="space-y-8">
                          <div className="space-y-4">
                            <h3 id="select-template" className="text-xl lg:text-2xl font-semibold flex items-center gap-3">
                              <LucideMousePointerClick className="h-5 w-5" />
                              2.2.1 Select Template
                            </h3>

                            <div className="space-y-4">
                              <p className="text-lg text-muted-foreground leading-relaxed">
                                Choose the Proxmox pool containing the VMs you wish to publish as a template from the dropdown selection. The template name will be auto-generated from the pool name.
                              </p>
                              <Image
                                src="/1-Template-Publish-Select-Pod.png"
                                alt="Select Template Pod"
                                width={600}
                                height={400}
                                className="rounded-lg border shadow-sm w-full max-w-2xl"
                                unoptimized
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 id="description" className="text-xl lg:text-2xl font-semibold flex items-center gap-3">
                              <FileText className="h-5 w-5" />
                              2.2.2 Description
                            </h3>

                            <p className="text-lg text-muted-foreground leading-relaxed">
                              Provide a detailed description or steps to complete this template. This field supports markdown formatting.
                            </p>
                          </div>

                          <Card className="bg-background border-2 shadow-sm p-0">
                            <Tabs defaultValue="plaintext" className="w-full">
                              <CardHeader className="bg-muted rounded-t-lg border-b-2 py-2">
                                <TabsList className="grid w-full grid-cols-2">
                                  <TabsTrigger value="plaintext" className="text-base">Plaintext</TabsTrigger>
                                  <TabsTrigger value="rendered" className="text-base">Rendered Markdown</TabsTrigger>
                                </TabsList>
                              </CardHeader>
                              <CardContent className="p-0 -mt-2 bg-background rounded-b-lg">
                                <TabsContent value="plaintext" className="m-0">
                                  <div className="bg-gradient-to-br from-primary/5 rounded-b-lg p-6">
                                    <pre className="whitespace-pre-wrap text-sm lg:text-base font-mono leading-relaxed overflow-x-auto">
                                      {markdownExampleText}
                                    </pre>
                                  </div>
                                </TabsContent>
                                <TabsContent value="rendered" className="m-0">
                                  <div className="bg-gradient-to-br from-primary/5 rounded-b-lg p-6">
                                    <MarkdownRenderer 
                                      content={markdownExampleText}
                                      variant="compact"
                                    />
                                  </div>
                                </TabsContent>
                              </CardContent>
                            </Tabs>
                          </Card>
                        </div>

                        <div className="space-y-8">
                          <div className="space-y-4">
                            <h3 id="authors" className="text-xl lg:text-2xl font-semibold flex items-center gap-3">
                              <User className="h-5 w-5" />
                              2.2.3 Authors
                            </h3>

                            <p className="text-lg text-muted-foreground leading-relaxed">
                              Specify the authors or creators of the template (max 255 characters). For example if you are part of a club you could put the club name with your name as the author. EX (SWIFT, Maxwell Caron)
                            </p>
                          </div>

                          <div className="space-y-4">
                            <h3 id="vm-count" className="text-xl lg:text-2xl font-semibold flex items-center gap-3">
                              <Boxes className="h-5 w-5" />
                              2.2.4 VM Count
                            </h3>

                            <p className="text-lg text-muted-foreground leading-relaxed">
                              Specify how many VMs the template contains (1-12)
                            </p>
                          </div>

                          <div className="space-y-4">
                            <h3 id="image" className="text-xl lg:text-2xl font-semibold flex items-center gap-3">
                              <ImageIcon className="h-5 w-5" />
                              2.2.5 Image
                            </h3>

                            <div className="space-y-4">
                              <p className="text-lg text-muted-foreground leading-relaxed">
                                Optionally upload an image to represent the template visually (max 10MB). You will be able to crop your image upon upload.
                              </p>
                              <div className="flex flex-col items-center">
                                <Image
                                  src="/2-Template-Publish-Image.png"
                                  alt="Template Publish Image"
                                  width={500}
                                  height={400}
                                  className="rounded-lg border shadow-sm max-w-md"
                                  unoptimized
                                />
                                <p className="text-sm text-muted-foreground mt-3 text-center">Crop pod template image</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 id="preview-template" className="text-xl lg:text-2xl font-semibold flex items-center gap-3">
                              <Search className="h-5 w-5" />
                              2.2.6 Preview Template
                            </h3>

                            <div className="space-y-6">
                              <p className="text-lg text-muted-foreground leading-relaxed">
                                View an exact preview of what your template will look like to users once published. You will be able to view both the small card view and the detailed view.
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <Image
                                    src="/3-Template-Publish-Preview-Small.png"
                                    alt="Template Publish Small Preview"
                                    width={400}
                                    height={300}
                                    className="rounded-lg border shadow-sm w-full"
                                    unoptimized
                                  />
                                  <p className="text-sm text-muted-foreground mt-3 text-center">Small pod template preview</p>
                                </div>
                                <div>
                                  <Image
                                    src="/4-Template-Publish-Preview-Large.png"
                                    alt="Template Publish Large Preview"
                                    width={400}
                                    height={300}
                                    className="rounded-lg border shadow-sm w-full"
                                    unoptimized
                                  />
                                  <p className="text-sm text-muted-foreground mt-3 text-center">Large popup pod template preview</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h3 id="visibility" className="text-xl lg:text-2xl font-semibold flex items-center gap-3">
                              <Eye className="h-5 w-5" />
                              2.2.7 Visibility
                            </h3>

                            <p className="text-lg text-muted-foreground leading-relaxed">
                              The final step is to choose whether the template should be publicly visible to all users or kept private when published. This can be changed later in the template management section.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h3 id="step-3" className="scroll-m-20 text-3xl lg:text-4xl font-semibold tracking-tight flex items-center gap-3">
                      Step 3: Manage Template
                    </h3>

                    <Alert className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-950/50 dark:to-blue-900/50 dark:border-blue-800 p-6">
                      <Info className="h-4 w-4" />
                      <div className="ml-2">
                        <strong className="text-lg">Info</strong>
                        <AlertDescription className="mt-3 text-base leading-relaxed">
                          Deleting a template will not delete the underlying VMs in Proxmox. You must manually delete the VMs from Proxmox if you wish to remove them.
                        </AlertDescription>
                      </div>
                    </Alert>

                    <ol className="ml-6 list-decimal space-y-4 text-lg leading-relaxed">
                      <li><strong>Admin Panel:</strong> In the Kamino admin panel, navigate to the <strong><Link href="/admin/pods/templates" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">All Templates</Link></strong> section</li>
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
