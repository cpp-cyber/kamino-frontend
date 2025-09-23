"use client"

import { PageLayout } from "@/components/user-page-layout"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Server, Users, GitBranch, Cloud, Star, ChartColumnBigIcon, Rocket, Copy, ExternalLink, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"

export default function Page() {
  const pageHeader = (
    <div className="flex flex-col items-center justify-center min-h-[125px] text-center space-y-4">
      <div className="flex items-center space-x-3">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">Kamino</h1>
      </div>
    </div>
  )

  const features = [
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Pod Cloning",
      description: "Easily clone and interact with pods of VMs"
    },
    {
      icon: <Copy className="h-6 w-6" />,
      title: "Template Library",
      description: "Access a library of pre-defined templates made by students and faculty"
    },
    {
      icon: <Server className="h-6 w-6" />,
      title: "Resource Management",
      description: "Monitor the status of pod VMs or interact with them directly in Proxmox"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "User-Friendly Interface",
      description: "Intuitive UI that simplifies VM pod management"
    }
  ]

  const timeline = [
  {
    id: 1,
    date: "Aug 2023",
    title: "Project Kickoff",
    description:
      "Idea conception and initial implementation for VMware vSphere.",
    contributors: ["Gabriel Fok", "Evan Deters", "Dylan Tran"],
  },
  {
    id: 2,
    date: "Mar 2025",
    title: "Proxmox Rebuild",
    description:
      "Planning and implementation to make cloning work with Proxmox, enhancing compatibility and performance.",
    contributors: ["Dylan Michalak", "Luke Kimes"],
  },
  {
    id: 3,
    date: "Jul 2025",
    title: "New Kamino",
    description:
      "Complete backend and frontend rewrite to support Proxmox, Users, and Groups management.",
    contributors: ["Maxwell Caron", "Marshall Ung"],
  }
]

  return (
    <AuthGuard>
      <PageLayout header={pageHeader} showGradientBackground={true}>
        {/* Grid Layout */}
        <div className="grid grid-cols-12 gap-6 auto-rows-auto">
          
          {/* What is Kamino */}
          <Card id="what-is-kamino" className="col-span-12 bg-gradient-to-br from-primary/5 to-kamino-green/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Image src="/kaminoLogo.svg" alt="Kamino Logo" width={40} height={40} />
                <CardTitle className="text-2xl">What is Kamino?</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Kamino is a modern platform that allows users to deploy and manage pods of virtual machines (VMs) with ease. 
                It provides a user-friendly interface to clone, destroy, and monitor VM pods, making it ideal for users with 
                any level of expertise who want to quickly get hands on with a variety of different virtualized environments.
              </p>
            </CardContent>
          </Card>

          {/* Features  */}
          <Card id="features" className="col-span-12 lg:col-span-8 row-span-2 bg-gradient-to-br from-primary/5 to-kamino-green/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <Star className="h-6 w-6 text-kamino-green" />
                Features
              </CardTitle>
              <CardDescription className="mb-2">
                Powerful tools and capabilities to streamline your VM management workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6 h-full">
                {features.map((feature, index) => (
                  <div key={index} className="p-6 rounded-lg bg-muted/30 border shadow transition-colors flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0 text-primary p-3 rounded-lg bg-primary/10">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card id="stats" className="col-span-12 lg:col-span-4 row-span-2 bg-gradient-to-br from-primary/5 to-kamino-green/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <ChartColumnBigIcon className="h-6 w-6 text-kamino-yellow" />
                Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-kamino-green">200+</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              <Separator />
              <div className="text-center">
                <div className="text-3xl font-bold text-kamino-yellow">50+</div>
                <div className="text-sm text-muted-foreground">Deployed Pods</div>
              </div>
              <Separator />
              <div className="text-center">
                <div className="text-3xl font-bold text-kamino-green">600+</div>
                <div className="text-sm text-muted-foreground">Deployed VMs</div>
              </div>
              <Separator />
              <div className="text-center">
                <div className="text-3xl font-bold text-kamino-yellow">New</div>
                <div className="text-sm text-muted-foreground">Weekly Templates</div>
              </div>
            </CardContent>  
          </Card>

          {/* Lifetime */}
          <Card id="lifetime" className="col-span-12 lg:col-span-4 row-span-2 bg-gradient-to-br from-primary/5 to-kamino-green/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <Calendar className="h-6 w-6 text-kamino-yellow" />
                Lifetime
              </CardTitle>
              <CardDescription className="mb-2">
                A quick look at Kamino&rsquo;s milestones along with the students who made it possible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Timeline defaultValue={3}>
                {timeline.map((item) => (
                  <TimelineItem key={item.id} step={item.id}>
                    <TimelineHeader>
                      <TimelineSeparator />
                      <TimelineDate>{item.date}</TimelineDate>
                      <TimelineTitle>{item.title}</TimelineTitle>
                      <TimelineIndicator />
                    </TimelineHeader>
                    <TimelineContent>
                      <div className="space-y-3">
                        <p>{item.description}</p>
                        {item.contributors && item.contributors.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {item.contributors.map((contributor, index) => (
                              <Badge key={index} variant="secondary" className="text-xs shadow">
                                {contributor}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>

          {/* Infrastructure */}
          <Card id="infrastructure" className="col-span-12 lg:col-span-8 row-span-2 bg-gradient-to-br from-primary/5 to-kamino-green/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                <GitBranch className="h-6 w-6 text-kamino-green" />
                Infrastructure
              </CardTitle>
              <CardDescription>
                Understanding Kamino&rsquo;s distributed microservices architecture and technology stack
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Repository Cards */}
                <div className="grid gap-6">
                  <Link href="https://github.com/cpp-cyber/kamino-frontend" target="_blank" rel="noopener noreferrer">
                    <div className="p-4 rounded-lg border bg-gradient-to-r from-kamino-yellow/5 to-kamino-yellow/10 dark:from-kamino-yellow/5 dark:to-kamino-yellow/10 border-kamino-yellow/20 dark:border-kamino-yellow/20 hover:shadow-lg hover:scale-[1.02] hover:border-kamino-yellow/40 transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-kamino-yellow/10">
                          <Users className="h-5 w-5 text-kamino-yellow" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">kamino-frontend</h3>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">React-based user interface</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        Provides the complete user experience with dashboards, VM management interfaces, and real-time monitoring. 
                        Built with Next.js and shadcn/ui for a modern, responsive interface.
                      </p>
                      <div className="flex flex-wrap gap-1.5 [&>*]:text-xs [&>*]:shadow">
                        <Badge variant="secondary">
                          React
                        </Badge>
                        <Badge variant="secondary">
                          Next.js
                        </Badge>
                        <Badge variant="secondary">
                          shadcn/ui
                        </Badge>
                      </div>
                    </div>
                  </Link>

                  <Link href="https://github.com/cpp-cyber/proclone" target="_blank" rel="noopener noreferrer">
                    <div className="p-4 rounded-lg border bg-gradient-to-r from-kamino-green/5 to-kamino-green/10 dark:from-kamino-green/5 dark:to-kamino-green/10 border-kamino-green/20 dark:border-kamino-green/20 hover:shadow-lg hover:scale-[1.02] hover:border-kamino-green/40 transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-kamino-green/10">
                          <Server className="h-5 w-5 text-kamino-green" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">proclone</h3>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">Core backend API</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        Handles all VM lifecycle operations, resource allocation, and API endpoints. Manages pod creation, template processing, 
                        and communicates with underlying virtualization infrastructure.
                      </p>
                      <div className="flex flex-wrap gap-1.5 [&>*]:text-xs [&>*]:shadow">
                        <Badge variant="secondary">
                          Golang
                        </Badge>
                        <Badge variant="secondary">
                          Proxmox
                        </Badge>
                        <Badge variant="secondary">
                          MariaDB
                        </Badge>
                      </div>
                    </div>
                  </Link>

                  <Link href="https://github.com/cpp-cyber/proclone-deployment" target="_blank" rel="noopener noreferrer">
                    <div className="p-4 rounded-lg border bg-gradient-to-r from-stone-150 to-stone-200 dark:from-stone-500/15 dark:to-stone-600/20 border-stone-300 dark:border-stone-500/25 hover:shadow-lg hover:scale-[1.02] hover:border-stone-200 dark:hover:border-stone-700/40 transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-stone-200 dark:bg-stone-500/15">
                          <Cloud className="h-5 w-5 text-stone-500 dark:text-stone-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">proclone-deployment</h3>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">Infrastructure automation</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        Contains Kubernetes manifests and ArgoCD configurations for automated deployment and scaling. 
                        Ensures consistent environments across development and production.
                      </p>
                      <div className="flex flex-wrap gap-1.5 [&>*]:text-xs [&>*]:shadow">
                        <Badge variant="secondary">
                          Docker
                        </Badge>
                        <Badge variant="secondary">
                          Kubernetes
                        </Badge>
                        <Badge variant="secondary">
                          ArgoCD
                        </Badge>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </PageLayout>
    </AuthGuard>
  )
}
