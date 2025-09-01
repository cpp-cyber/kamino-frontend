import React from 'react'
import { ChevronDownIcon, ChevronRightIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeployedPod, VirtualMachine } from "@/lib/types"
import { formatUptime } from "@/lib/utils"
import { VMTable } from "./vm-table"
import Link from "next/link"

interface PodsTableCoreProps {
  pods: DeployedPod[]
  searchTerm: string
  expandedRows: Set<string>
  onToggleRow: (podName: string) => void
  onToggleAllRows: () => void
  onDelete: (pod: DeployedPod, event: React.MouseEvent) => void
  onVMAction: (vmid: number, node: string, action: 'start' | 'shutdown' | 'reboot') => void
  selectedPods: Set<string>
  onSelectionChange: (selectedPods: Set<string>) => void
}

export function PodsTableCore({
  pods,
  searchTerm,
  expandedRows,
  onToggleRow,
  onToggleAllRows,
  onDelete,
  onVMAction,
  selectedPods,
  onSelectionChange
}: PodsTableCoreProps) {
  const isAllSelected = pods.length > 0 && selectedPods.size === pods.length
  const isSomeSelected = selectedPods.size > 0 && selectedPods.size < pods.length
  const isAllExpanded = pods.length > 0 && expandedRows.size >= pods.length

  // Selection handlers
  const handleSelectPod = React.useCallback((podName: string, checked: boolean) => {
    const newSelectedPods = new Set(selectedPods)
    if (checked) {
      newSelectedPods.add(podName)
    } else {
      newSelectedPods.delete(podName)
    }
    onSelectionChange(newSelectedPods)
  }, [selectedPods, onSelectionChange])

  const handleSelectAll = React.useCallback(() => {
    if (isAllSelected) {
      // If all are selected, deselect all
      onSelectionChange(new Set())
    } else {
      // If none or some are selected, select all
      onSelectionChange(new Set(pods.map(pod => pod.name)))
    }
  }, [isAllSelected, pods, onSelectionChange])

  const getLongestUptime = (vms: VirtualMachine[]) => {
    const runningVMs = vms.filter(vm => vm.status === 'running')
    if (runningVMs.length === 0) return null
    
    const longestUptimeVM = runningVMs.reduce((longest, current) => {
      return (current.uptime || 0) > (longest.uptime || 0) ? current : longest
    })
    
    return longestUptimeVM.uptime
  }

  return (
    <Table>
      <TableHeader className="bg-muted text-muted-foreground">
        <TableRow>
          <TableHead className="w-[20px]">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={onToggleAllRows}
              title={isAllExpanded ? "Collapse all" : "Expand all"}
            >
              {isAllExpanded ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </Button>
          </TableHead>
          <TableHead className="w-[20px]">
            <Checkbox
              checked={isSomeSelected ? "indeterminate" : isAllSelected}
              onCheckedChange={handleSelectAll}
              aria-label="Select all pods"
            />
          </TableHead>
          <TableHead className="min-w-[200px]">Pod Name</TableHead>
          <TableHead className="min-w-[80px]">Running</TableHead>
          <TableHead className="min-w-[80px]">Stopped</TableHead>
          <TableHead className="min-w-[150px]">Longest Uptime</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pods.length === 0 && (
          <TableRow key="empty-state">
            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No pods found matching your search.' : 'No deployed pods found.'}
            </TableCell>
          </TableRow>
        )}
        {pods.map((pod) => (
          <React.Fragment key={pod.name}>
            <TableRow 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onToggleRow(pod.name)}
            >
              <TableCell className="w-[50px]">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    {expandedRows.has(pod.name) ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="w-[50px]" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedPods.has(pod.name)}
                    onCheckedChange={(checked) => handleSelectPod(pod.name, checked as boolean)}
                    aria-label={`Select ${pod.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Button variant="link" size="sm" className="p-0">
                    <Link 
                        href={`https://gonk.sdc.cpp:8006/#v1:0:=%2Fpool%2F${pod.name}:4::::30:::`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className="truncate">{pod.name}</div>
                    </Link>
                  </Button>
                </TableCell>
                <TableCell>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {(pod.vms || []).filter(vm => vm.status === 'running').length}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {(pod.vms || []).filter(vm => vm.status !== 'running').length}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="truncate">
                    {(() => {
                      const longestUptime = getLongestUptime(pod.vms || [])
                      return longestUptime ? formatUptime(longestUptime) : 'N/A'
                    })()}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => onDelete(pod, e)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              {expandedRows.has(pod.name) && (
                <TableRow>
                  <TableCell colSpan={7} className="p-0 border-0">
                    <div className="w-full px-6 py-4">
                      <VMTable vms={pod.vms} onVMAction={onVMAction} />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
      </TableBody>
    </Table>
  )
}
