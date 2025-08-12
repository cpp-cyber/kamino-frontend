"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/nav-mode"
import { useAuth } from "@/contexts/auth-context"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Rocket, FileQuestion, UserCircle2, LogOut, Settings, Copy } from "lucide-react"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"

// Type definitions for navigation links
interface NavigationChild {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavigationLink {
  href: string
  label: string
  active: boolean
  icon?: React.ComponentType<{ className?: string }>
  children?: NavigationChild[]
}

export default function TopNav() {
  const pathname = usePathname()
  const { authState, logout } = useAuth()

  // Navigation links array to be used in both desktop and mobile menus
  const getNavigationLinks = () => [
    { href: "/", label: "Home", active: false },
    { 
      href: "#", 
      label: "Pods", 
      active: false,
      children: [
        { href: "/pods/deployed", label: "Deployed", icon: Rocket },
        { href: "/pods/templates", label: "Templates", icon: Copy }
      ]
    },
    { href: "/info", label: "Info", icon: FileQuestion, active: pathname === "/info" },
  ]

  // Logout function using auth context
  const handleLogout = async () => {
    try {
      await logout()
      // Redirect to login page
      window.location.href = '/login'
    } catch (error) {
      console.error('Failed to logout:', error)
      // Still redirect on error to ensure user is logged out
      window.location.href = '/login'
    }
  }

  // Update active state based on current path
  const getActiveState = (link: NavigationLink) => {
    if (link.children) {
      return link.children.some((child: NavigationChild) => pathname === child.href)
    }
    return pathname === link.href
  }

  return (
    <header className="border-b">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16 xl:px-24">
        <div className="flex h-16 justify-between gap-4">
        {/* Left side */}
        <div className="flex gap-2">
          <div className="flex items-center md:hidden">
            {/* Mobile menu trigger */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="group size-8" variant="ghost" size="icon">
                  <svg
                    className="pointer-events-none"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12L20 12"
                      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                    />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-37 p-1 md:hidden">
                <NavigationMenu>
                  <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                    <NavigationMenuItem className="w-full">
                      <NavigationMenuLink
                        href="/pods/templates"
                        active={pathname === "/pods/templates"}
                      >
                        <div className="flex gap-2 py-2.5">
                          <Copy className="size-5" />
                          Pod Templates
                        </div>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="w-full">
                      <NavigationMenuLink
                        href="/pods/deployed"
                        active={pathname === "/pods/deployed"}
                      >
                        <div className="flex gap-2 py-2.5">
                          <Rocket className="size-5" />
                          Deployed Pods
                        </div>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="w-full">
                      <NavigationMenuLink
                        href="/info"
                        active={pathname === "/info"}
                      >
                        <div className="flex gap-2 py-2.5">
                          <FileQuestion className="size-4" />
                          Info
                        </div>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>
          </div>
          {/* Main nav */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-primary hover:text-primary/90 flex items-center gap-2">
              <Image src="/kaminoLogo.svg" alt="Kamino Logo" width={32} height={32} className="size-8" />
              <span className="text-lg font-bold">Kamino</span>
            </Link>
            {/* Navigation menu */}
            <NavigationMenu className="h-full *:h-full max-md:hidden">
              <NavigationMenuList className="h-full gap-2">
                {getNavigationLinks().map((link, index) => {
                  if (link.children) {
                    return (
                      <NavigationMenuItem key={index} className="h-full">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <NavigationMenuLink
                              className={`text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                                getActiveState(link) ? 'border-b-primary text-primary' : ''
                              }`}
                            >
                              {link.label}
                              {/* <ChevronDown className="size-3 ml-1" /> */}
                            </NavigationMenuLink>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="-mt-1 bg-background border-0 rounded-none rounded-b-lg">
                            {link.children.map((child, childIndex) => (
                              <DropdownMenuItem key={childIndex} asChild>
                                <a href={child.href} className="flex items-center gap-2">
                                  <child.icon className="size-4 text-foreground" />
                                  <span className="font-medium text-muted-foreground">{child.label}</span>
                                </a>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </NavigationMenuItem>
                    )
                  }
                  return (
                    <NavigationMenuItem key={index} className="h-full">
                      <NavigationMenuLink
                        active={getActiveState(link)}
                        href={link.href}
                        className="text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent data-[active]:bg-transparent!"
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center gap-2">
          {authState.isAdmin && (
            <>
              <Button variant="ghost" asChild className="flex items-center gap-2 px-3 py-2 h-auto">
                <a href="/admin/dashboard" className="flex items-center gap-2">
                  <Settings className="size-4 text-muted-foreground" />
                  <span className="text-sm bg-linear-65 from-kamino-green to-kamino-yellow bg-clip-text text-transparent font-medium">Admin</span>
                </a>
              </Button>
              <Separator orientation="vertical" className="max-h-6"/>
            </>
          )}
          <ModeToggle />
          <Separator orientation="vertical" className="max-h-6"/>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 h-auto">
                <UserCircle2 className="size-5 text-muted-foreground" />
                <span className="text-sm">{authState.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-28">
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut/>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        </div>
      </div>
    </header>
  )
}
