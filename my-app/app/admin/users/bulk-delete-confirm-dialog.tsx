"use client"

import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface BulkDeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  selectedUsersCount: number
  usernames: string[]
}

export function BulkDeleteConfirmDialog({ 
  open, 
  onOpenChange, 
  onConfirm,
  selectedUsersCount,
  usernames
}: BulkDeleteConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {selectedUsersCount === 1
              ? `Are you sure you want to delete "${usernames[0]}"?`
              : `Are you sure you want to delete these ${selectedUsersCount} users?`}
          </AlertDialogTitle>
        </AlertDialogHeader>
        {selectedUsersCount > 1 && (
          <div className="max-h-40 overflow-y-auto mb-2 text-sm text-muted-foreground">
            {usernames.map((username) => (
              <div key={username} className="truncate">{username}</div>
            ))}
          </div>
        )}
        <div className="text-destructive font-medium mb-2">
          This action cannot be undone.
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive hover:bg-destructive/90"
          >
            {selectedUsersCount === 1
              ? "Delete"
              : `Delete (${selectedUsersCount})`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
