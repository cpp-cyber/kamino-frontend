import React from "react";
import { PlayIcon, SquareIcon, MoreVertical, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortingIcon } from "@/components/table-components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VirtualMachine } from "@/lib/types";
import { StatusBadge } from "@/components/status-badges";
import { formatBytes, formatUptime } from "@/lib/utils";
import { SortingState } from "@tanstack/react-table";
import Link from "next/link";

interface VMsTableCoreProps {
  vms: VirtualMachine[];
  searchTerm: string;
  onVMAction: (
    vmid: number,
    node: string,
    action: "start" | "shutdown" | "reboot",
  ) => void;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
}

export function VMsTableCore({
  vms,
  searchTerm,
  onVMAction,
  sorting,
  onSortingChange,
}: VMsTableCoreProps) {
  const handleSortingChange = (columnId: string) => {
    const currentSort = sorting.find((s) => s.id === columnId);
    if (!currentSort) {
      // Not currently sorted, sort ascending
      onSortingChange([{ id: columnId, desc: false }]);
    } else if (!currentSort.desc) {
      // Currently sorted ascending, sort descending
      onSortingChange([{ id: columnId, desc: true }]);
    } else {
      // Currently sorted descending, remove sort
      onSortingChange([]);
    }
  };

  const getSortDirection = (columnId: string): false | "asc" | "desc" => {
    const currentSort = sorting.find((s) => s.id === columnId);
    if (!currentSort) return false;
    return currentSort.desc ? "desc" : "asc";
  };

  return (
    <Table>
      <TableHeader className="bg-muted text-muted-foreground">
        <TableRow>
          <TableHead className="w-[45px] px-4 py-3">
            <div className="flex items-center justify-between pr-2 group">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSortingChange("vmid")}
                className="-ml-3 flex-1 justify-start hover:bg-muted transition-colors"
              >
                <span className="font-medium">ID</span>
              </Button>
              <SortingIcon sortDirection={getSortDirection("vmid")} />
            </div>
          </TableHead>
          <TableHead className="">
            <span className="font-medium">Node</span>
          </TableHead>
          <TableHead className="">
            <div className="flex items-center justify-between pr-2 group">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSortingChange("name")}
                className="-ml-3 flex-1 justify-start hover:bg-muted transition-colors"
              >
                <span className="font-medium">Name</span>
              </Button>
              <SortingIcon sortDirection={getSortDirection("name")} />
            </div>
          </TableHead>
          <TableHead className="">
            <div className="flex items-center justify-between pr-2 group">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSortingChange("pool")}
                className="-ml-3 flex-1 justify-start hover:bg-muted transition-colors"
              >
                <span className="font-medium">Pool</span>
              </Button>
              <SortingIcon sortDirection={getSortDirection("pool")} />
            </div>
          </TableHead>
          <TableHead className="">
            <div className="flex items-center justify-between pr-2 group">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSortingChange("cpu")}
                className="-ml-3 flex-1 justify-start hover:bg-muted transition-colors"
              >
                <span className="font-medium">CPU</span>
              </Button>
              <SortingIcon sortDirection={getSortDirection("cpu")} />
            </div>
          </TableHead>
          <TableHead className="">
            <div className="flex items-center justify-between pr-2 group">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSortingChange("mem")}
                className="-ml-3 flex-1 justify-start hover:bg-muted transition-colors"
              >
                <span className="font-medium">Memory</span>
              </Button>
              <SortingIcon sortDirection={getSortDirection("mem")} />
            </div>
          </TableHead>
          <TableHead className="">
            <div className="flex items-center justify-between pr-2 group">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSortingChange("maxdisk")}
                className="-ml-3 flex-1 justify-start hover:bg-muted transition-colors"
              >
                <span className="font-medium">Disk</span>
              </Button>
              <SortingIcon sortDirection={getSortDirection("maxdisk")} />
            </div>
          </TableHead>
          <TableHead className="">
            <span className="font-medium">Status</span>
          </TableHead>
          <TableHead className="">
            <div className="flex items-center justify-between pr-2 group">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSortingChange("uptime")}
                className="-ml-3 flex-1 justify-start hover:bg-muted transition-colors"
              >
                <span className="font-medium">Uptime</span>
              </Button>
              <SortingIcon sortDirection={getSortDirection("uptime")} />
            </div>
          </TableHead>
          <TableHead className="w-[75px]">
            <span className="font-medium">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vms.length === 0 && (
          <TableRow key="empty-state">
            <TableCell
              colSpan={10}
              className="text-center py-8 text-muted-foreground"
            >
              {searchTerm
                ? "No VMs found matching your search."
                : "No VMs found."}
            </TableCell>
          </TableRow>
        )}
        {vms.map((vm) => (
          <TableRow key={`${vm.vmid}-${vm.node}`} className="hover:bg-muted/50">
            <TableCell className="font-mono text-sm">
              <div className="truncate text-muted-foreground px-2">
                {vm.vmid}
              </div>
            </TableCell>
            <TableCell className="font-mono text-sm">
              <div className="truncate text-muted-foreground">{vm.node}</div>
            </TableCell>
            <TableCell className="font-medium">
              <Button variant="link" className="p-0">
                <Link
                  href={`https://${process.env.NEXT_PUBLIC_PROXMOX_HOST}/#v1:0:=qemu%2F${vm.vmid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate block"
                >
                  {vm.name}
                </Link>
              </Button>
            </TableCell>
            <TableCell>
              <div className="truncate text-muted-foreground">
                {vm.pool || "N/A"}
              </div>
            </TableCell>
            <TableCell>
              <div className="truncate text-muted-foreground">
                {vm.maxcpu > 0
                  ? `${((vm.cpu || 0) * 100).toFixed(1)}% (${vm.maxcpu} cores)`
                  : `0.0% (${vm.maxcpu || 0} cores)`}
              </div>
            </TableCell>
            <TableCell>
              <div className="truncate text-muted-foreground">
                {vm.maxmem > 0
                  ? `${formatBytes(vm.mem || 0)} / ${formatBytes(vm.maxmem)} (${(((vm.mem || 0) / vm.maxmem) * 100).toFixed(1)}%)`
                  : "N/A"}
              </div>
            </TableCell>
            <TableCell>
              <div className="truncate text-muted-foreground">
                {formatBytes(vm.maxdisk)}
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={vm.status} />
            </TableCell>
            <TableCell>
              <div className="truncate text-muted-foreground">
                {formatUptime(vm.uptime)}
              </div>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onVMAction(vm.vmid, vm.node, "start")}
                    disabled={vm.status === "running"}
                    className="cursor-pointer"
                  >
                    <PlayIcon className="mr-2 h-4 w-4 text-green-600" />
                    Start
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onVMAction(vm.vmid, vm.node, "shutdown")}
                    disabled={vm.status !== "running"}
                    className="cursor-pointer"
                  >
                    <SquareIcon className="mr-2 h-4 w-4 text-destructive" />
                    Shutdown
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onVMAction(vm.vmid, vm.node, "reboot")}
                    className="cursor-pointer"
                  >
                    <RotateCcw className="mr-2 h-4 w-4 text-blue-600" />
                    Reboot
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
