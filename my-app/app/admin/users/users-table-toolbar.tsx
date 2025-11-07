"use client";

import React from "react";
import { SearchIcon, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UsersTableToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function UsersTableToolbar({
  searchTerm,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange,
  onRefresh,
  isRefreshing,
}: UsersTableToolbarProps) {
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
        <div className="flex items-center space-x-2 ml-auto">
          <Button onClick={onRefresh} variant="outline" disabled={isRefreshing}>
            <RefreshCcw className="h-4 w-4" />
            <span className="hidden lg:inline">Refresh</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
