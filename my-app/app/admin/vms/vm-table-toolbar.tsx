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

interface VMTableToolbarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  itemsPerPage: number
  onItemsPerPageChange: (value: number) => void
  showRunningOnly: boolean
  onShowRunningOnlyChange: (value: boolean) => void
  showStoppedVMs: boolean
  onShowStoppedVMsChange: (value: boolean) => void
  selectedNodes: string[]
  onSelectedNodesChange: (nodes: string[]) => void
  availableNodes: string[]
  onRefresh: () => void
}

export function VMTableToolbar({
  searchTerm,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange,
  showRunningOnly,
  onShowRunningOnlyChange,
  showStoppedVMs,
  onShowStoppedVMsChange,
  selectedNodes,
  onSelectedNodesChange,
  availableNodes,
  onRefresh
}: VMTableToolbarProps) {
  // Calculate active filters count
  const getActiveFiltersCount = () => {
    let count = 0
    
    // Status filters - count each checked filter
    if (showRunningOnly) count++
    if (showStoppedVMs) count++
    
    // Node filters - count each selected node
    count += selectedNodes.length
    
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="bg-muted p-4 border-b rounded-t-md">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search VMs by name, node, ID, pool, or status..."
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
              checked={showRunningOnly}
              onCheckedChange={onShowRunningOnlyChange}
              onSelect={(e) => e.preventDefault()}
            >
              Running
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showStoppedVMs}
              onCheckedChange={onShowStoppedVMsChange}
              onSelect={(e) => e.preventDefault()}
            >
              Stopped
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Node</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableNodes.map((node) => (
              <DropdownMenuCheckboxItem
                key={node}
                checked={selectedNodes.includes(node)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectedNodesChange([...selectedNodes, node])
                  } else {
                    onSelectedNodesChange(selectedNodes.filter(n => n !== node))
                  }
                }}
                onSelect={(e) => e.preventDefault()}
              >
                {node.charAt(0).toUpperCase() + node.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={onRefresh} variant="outline" className="ml-auto">
          <RefreshCcw className="h-4 w-4" />
          <span className="hidden lg:inline">Refresh</span>
        </Button>
      </div>
    </div>
  )
}
