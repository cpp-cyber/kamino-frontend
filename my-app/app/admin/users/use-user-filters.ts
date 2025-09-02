import { useMemo } from "react"
import { User } from "@/lib/types"

interface UseUserFiltersProps {
  users: User[]
  searchTerm: string
  showEnabledUsers: boolean
  showDisabledUsers: boolean
}

export function useUserFilters({ 
  users, 
  searchTerm, 
  showEnabledUsers, 
  showDisabledUsers 
}: UseUserFiltersProps) {
  return useMemo(() => {
    let filteredUsers = users

    // Apply status filters
    filteredUsers = filteredUsers.filter(user => {
      if (user.enabled && !showEnabledUsers) return false
      if (!user.enabled && !showDisabledUsers) return false
      return true
    })

    // Apply search filter
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase()
      
      filteredUsers = filteredUsers.filter(user => {
        // Search in username
        if (user.name.toLowerCase().includes(lowercaseSearch)) {
          return true
        }
        
        // Search in groups
        if (user.groups.some(group => group.name.toLowerCase().includes(lowercaseSearch))) {
          return true
        }
        
        return false
      })
    }

    return filteredUsers
  }, [users, searchTerm, showEnabledUsers, showDisabledUsers])
}
