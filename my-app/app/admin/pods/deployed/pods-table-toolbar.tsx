import React from 'react'
import { SearchIcon, Trash2Icon, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PodsTableToolbarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  itemsPerPage: number
  onItemsPerPageChange: (value: number) => void
  selectedPodsCount: number
  onBulkDelete: () => void
  onRefresh: () => void
  isRefreshing: boolean
}

export function PodsTableToolbar({
  searchTerm,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange,
  selectedPodsCount,
  onBulkDelete,
  onRefresh,
  isRefreshing
}: PodsTableToolbarProps) {
  return (
    <div className="bg-muted p-4 border-b rounded-t-md">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pods or VMs..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 bg-background"
          />
        </div>
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
        <div className="flex items-center space-x-2 ml-auto">
          <Button
            variant="destructive"
            onClick={onBulkDelete}
            disabled={selectedPodsCount === 0}
          >
            <Trash2Icon className="h-4 w-4" />
            <span>({selectedPodsCount})</span>
          </Button>
          <Button 
            onClick={onRefresh} 
            variant="outline"
            disabled={isRefreshing}
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
