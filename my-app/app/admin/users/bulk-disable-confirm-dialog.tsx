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

interface BulkDisableConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  selectedUsersCount: number
  usernames: string[]
}

export function BulkDisableConfirmDialog({ 
  open, 
  onOpenChange, 
  onConfirm,
  selectedUsersCount,
  usernames
}: BulkDisableConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Disable Users</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to disable {selectedUsersCount} user{selectedUsersCount === 1 ? '' : 's'}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <strong>Users to be disabled:</strong>
            <ul className="list-disc list-inside mt-2 max-h-32 overflow-y-auto">
              {usernames.map((username) => (
                <li key={username} className="text-sm">{username}</li>
              ))}
            </ul>
          </div>
          
          <div className="text-amber-600 dark:text-amber-400 font-medium">
            Disabled users will not be able to log in until re-enabled.
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
          >
            Disable {selectedUsersCount} User{selectedUsersCount === 1 ? '' : 's'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
