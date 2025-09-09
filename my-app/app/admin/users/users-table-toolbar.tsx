"use client"

import React from 'react'
import { SearchIcon, RefreshCcw, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UsersTableToolbarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  itemsPerPage: number
  onItemsPerPageChange: (value: number) => void
  showEnabledUsers: boolean
  onShowEnabledUsersChange: (value: boolean) => void
  showDisabledUsers: boolean
  onShowDisabledUsersChange: (value: boolean) => void
  onRefresh: () => void
  isRefreshing: boolean
}

export function UsersTableToolbar({
  searchTerm,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange,
  showEnabledUsers,
  onShowEnabledUsersChange,
  showDisabledUsers,
  onShowDisabledUsersChange,
  onRefresh,
  isRefreshing
}: UsersTableToolbarProps) {
  // Calculate active filters count
  const getActiveFiltersCount = () => {
    let count = 0
    
    // Status filters - count each checked filter
    if (showEnabledUsers) count++
    if (showDisabledUsers) count++
    
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="bg-muted p-4 border-b rounded-t-md">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search usernames or groups..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 bg-background"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={`${itemsPerPage}`}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[65px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent side="bottom">
              {[10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <Badge
                  className="min-w-5 px-1 bg-blue-600 text-white dark:bg-blue-700"
                  variant="secondary"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showEnabledUsers}
              onCheckedChange={onShowEnabledUsersChange}
              onSelect={(e) => e.preventDefault()}
            >
              Enabled
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showDisabledUsers}
              onCheckedChange={onShowDisabledUsersChange}
              onSelect={(e) => e.preventDefault()}
            >
              Disabled
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center space-x-2 ml-auto">
          <Button 
            onClick={onRefresh} 
            variant="outline"
            disabled={isRefreshing}
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="hidden lg:inline">Refresh</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
