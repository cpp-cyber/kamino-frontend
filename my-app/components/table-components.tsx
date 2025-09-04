"use client"

import React from "react"

/**
 * Excel-style sorting icon component with triangular indicators
 */
export interface SortingIconProps {
  sortDirection: false | "asc" | "desc"
}

export const SortingIcon = ({ sortDirection }: SortingIconProps) => {
  return (
    <div className="relative ml-1 flex flex-col items-center justify-center w-4 h-5">
      {/* Up arrow */}
      <div className={`absolute -top-0.5 transition-colors ${
        sortDirection === 'asc' 
          ? 'text-blue-600 dark:text-blue-600' 
          : sortDirection === 'desc' 
            ? 'text-muted-foreground/40' 
            : 'text-muted-foreground/50'
      }`}>
        <svg width="10" height="7" viewBox="0 0 8 5" fill="currentColor">
          <path d="M4 0L8 5H0L4 0Z" />
        </svg>
      </div>
      {/* Down arrow */}
      <div className={`absolute -bottom-0.5 transition-colors ${
        sortDirection === 'desc' 
          ? 'text-blue-600 dark:text-blue-600' 
          : sortDirection === 'asc' 
            ? 'text-muted-foreground/40' 
            : 'text-muted-foreground/50'
      }`}>
        <svg width="10" height="7" viewBox="0 0 8 5" fill="currentColor">
          <path d="M4 5L0 0H8L4 5Z" />
        </svg>
      </div>
    </div>
  )
}

/**
 * Sortable table header component with consistent styling and behavior
 */
export interface SortableHeaderProps {
  children: React.ReactNode
  sortDirection: false | "asc" | "desc"
  onSort: () => void
  className?: string
}

export const SortableHeader = ({ 
  children, 
  sortDirection, 
  onSort, 
  className = "" 
}: SortableHeaderProps) => {
  return (
    <div 
      className={`flex items-center justify-between py-3 cursor-pointer hover:bg-muted/50 ${className}`}
      onClick={onSort}
    >
      <span>{children}</span>
      <SortingIcon sortDirection={sortDirection} />
    </div>
  )
}

/**
 * Non-sortable table header component with consistent styling
 */
export interface NonSortableHeaderProps {
  children: React.ReactNode
  className?: string
}

export const NonSortableHeader = ({ children, className = "" }: NonSortableHeaderProps) => {
  return (
    <div className={`py-3 ${className}`}>
      <span>{children}</span>
    </div>
  )
}
