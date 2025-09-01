"use client"

import * as React from "react"
import Image from "next/image"
import { NavUser } from "@/components/nav-user"
import { useAuth } from "@/contexts/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Camera, Copy, CopyPlusIcon, Edit, LayoutDashboard, Rocket, Server, User } from "lucide-react"
import { IconUsersGroup } from "@tabler/icons-react"

const data = {
  navMain: [
    {
      title: "Navigation",
      url: "#",
      items: [
        {
          title: "User Panel",
          url: "/",
          isActive: false,
          icon: LayoutDashboard
        }
      ],
    },
    {
      title: "Resources",
      url: "#",
      items: [
        {
          title: "Users",
          url: "/admin/users",
          isActive: false,
          icon: User
        },
        {
          title: "Groups",
          url: "/admin/groups",
          isActive: false,
          icon: IconUsersGroup
        },
        {
          title: "Deployed Pods",
          url: "/admin/pods/deployed",
          isActive: false,
          icon: Rocket
        },
        // {
        //   title: "Pod Templates",
        //   url: "/admin/pods/templates",
        //   isActive: false,
        //   icon: Copy
        // },
        {
          title: "Virtual Machines",
          url: "/admin/vms",
          isActive: false,
          icon: Server
        }
      ],
    },
    {
      title: "Templates",
      url: "#",
      items: [
        {
          title: "All Templates",
          url: "/admin/pods/templates",
          isActive: false,
          icon: Copy
        },
        {
          title: "Publish Templates",
          url: "/admin/pods/templates/publish",
          isActive: false,
          icon: Edit
        },
        {
          title: "Create Templates",
          url: "/admin/pods/templates/create",
          isActive: false,
          icon: CopyPlusIcon
        }
      ],
    },
    {
      title: "Guides",
      url: "#",
      items: [
        {
          title: "Users",
          url: "/admin/guides/users",
          isActive: false,
          icon: User
        },
        {
          title: "Templates",
          url: "/admin/guides/templates",
          isActive: false,
          icon: CopyPlusIcon
        },
        {
          title: "Snapshots",
          url: "/admin/guides/snapshots",
          isActive: false,
          icon: Camera
        }
      ],
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { authState } = useAuth()

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="mb-4" asChild>
              <a href="/admin/dashboard">
                <Image src="/kaminoLogo.svg" alt="Logo" width={40} height={40} className="size-10" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-lg font-bold">Kamino</span>
                  <span className="truncate text-xs text-muted-foreground">Admin Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-lg text-muted-foreground">{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <a href={item.url}>
                        <item.icon className="size-4" />
                        <span className="text-base">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        {authState.username && <NavUser user={{ name: authState.username, isAdmin: authState.isAdmin }} />}
      </SidebarFooter>
    </Sidebar>
  )
}
