import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUptime(uptime: number): React.ReactNode {
  if (!uptime || uptime === 0) return 'N/A'
  const days = Math.floor(uptime / 86400)
  const hours = Math.floor((uptime % 86400) / 3600)
  const minutes = Math.floor((uptime % 3600) / 60)
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

export function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Calculate resource utilization percentage
export function calculateUtilization(used: number, total: number): number {
  if (total === 0) return 0
  return Math.round((used / total) * 100)
}

export const formatRelativeTime = (dateString: string) => {
  try {
    // Parse UTC timestamp and convert to local time
    const date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z')
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    
    // Convert to different time units
    const seconds = Math.floor(diffInMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)
    
    if (years > 0) {
      return years === 1 ? '1 year ago' : `${years} years ago`
    } else if (months > 0) {
      return months === 1 ? '1 month ago' : `${months} months ago`
    } else if (weeks > 0) {
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
    } else if (days > 0) {
      return days === 1 ? '1 day ago' : `${days} days ago`
    } else if (hours > 0) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`
    } else if (minutes > 0) {
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`
    } else {
      return seconds <= 30 ? 'Just now' : `${seconds} seconds ago`
    }
  } catch {
    return dateString // Return original string if parsing fails
  }
}

export const formatDateTime = (dateString: string) => {
  try {
    // Parse UTC timestamp and convert to local time
    const date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z')
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  } catch {
    return dateString // Return original string if parsing fails
  }
}