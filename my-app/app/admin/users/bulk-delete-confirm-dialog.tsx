"use client"

import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
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
          <AlertDialogTitle>Delete Users</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {selectedUsersCount} user{selectedUsersCount === 1 ? '' : 's'}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <strong>Users to be deleted:</strong>
            <ul className="list-disc list-inside mt-2 max-h-32 overflow-y-auto">
              {usernames.map((username) => (
                <li key={username} className="text-sm">{username}</li>
              ))}
            </ul>
          </div>
          
          <div className="text-destructive font-medium">
            This action cannot be undone.
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete {selectedUsersCount} User{selectedUsersCount === 1 ? '' : 's'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
