import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string | undefined
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // Handle undefined or null status
  if (!status) {
    return (
      <Badge>
        Unknown
      </Badge>
    )
  }

  switch (status.toLowerCase()) {
    case "running":
      return (
        <Badge
            variant="secondary"
            className="bg-green-600 text-white dark:bg-green-700"
        >
          Running
        </Badge>
      )
    case "stopped":
      return (
        <Badge variant="destructive">
          Stopped
        </Badge>
      )
    default:
      return (
        <Badge>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
  }
}

export function PodTemplateStatusBadge({ status }: StatusBadgeProps) {
  // Handle undefined or null status
  if (!status) {
    return (
      <Badge variant="secondary" className="bg-gray-600 text-white dark:bg-gray-700">
        Unknown
      </Badge>
    )
  }

  switch (status.toLowerCase()) {
    case "public":
      return (
        <Badge variant="secondary" className="bg-blue-600 text-white dark:bg-blue-700">
          Public
        </Badge>
      )
    case "hidden":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Hidden
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary" className="bg-gray-600 text-white dark:bg-gray-700">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
  }
}