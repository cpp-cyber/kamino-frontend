import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

interface ErrorDisplayProps {
  error: string
  title?: string
}

export function ErrorDisplay({ error, title = "Error" }: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center h-32 max-w-md mx-auto">
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle className="text-lg">{title}</AlertTitle>
        <AlertDescription>
          <p className="text-lg">{error}</p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
