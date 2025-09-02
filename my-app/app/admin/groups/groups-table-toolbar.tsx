"use client"

import React from 'react'
import { SearchIcon, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface GroupsTableToolbarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  itemsPerPage: number
  onItemsPerPageChange: (value: number) => void
  onRefresh: () => void
  totalItems: number
}

export function GroupsTableToolbar({
  searchTerm,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange,
  onRefresh,
  totalItems
}: GroupsTableToolbarProps) {
  return (
    <div className="bg-muted p-4 border-b rounded-t-md">
      <div className="flex items-center justify-between space-x-2">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups by name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 bg-background"
          />
        </div>
        {searchTerm && (
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {totalItems} result{totalItems !== 1 ? 's' : ''}
          </div>
        )}
        <Select
          value={`${itemsPerPage}`}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-[65px]">
            <SelectValue placeholder={itemsPerPage} />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2 ml-auto">
          <Button onClick={onRefresh} variant="outline">
            <RefreshCcw className="h-4 w-4" />
            <span className="hidden lg:inline">Refresh</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
