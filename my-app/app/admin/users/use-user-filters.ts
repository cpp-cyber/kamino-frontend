import { useMemo } from "react"
import { User } from "@/lib/types"

interface UseUserFiltersProps {
  users: User[]
  searchTerm: string
}

export function useUserFilters({ users, searchTerm }: UseUserFiltersProps) {
  return useMemo(() => {
    if (!searchTerm) return users

    const lowercaseSearch = searchTerm.toLowerCase()
    
    return users.filter(user => {
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
  }, [users, searchTerm])
}
