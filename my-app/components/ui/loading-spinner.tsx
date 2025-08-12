interface LoadingSpinnerProps {
  message?: string
}

export function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-muted border-t-primary"></div>
      <div className="text-muted-foreground text-lg">{message}</div>
    </div>
  )
}

export function LoadingSpinnerSmall() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="h-4 w-4 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"></div>
      <div className="h-4 w-4 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.13s]"></div>
      <div className="h-4 w-4 animate-bounce rounded-full bg-muted-foreground"></div>
    </div>
  )
}
