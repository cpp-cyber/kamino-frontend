import { useEffect, useState } from "react"

interface UseApiStateOptions<T> {
  fetchFn: () => Promise<T>
  deps?: React.DependencyList
  enabled?: boolean
}

interface UseApiStateReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useApiState<T>({ fetchFn, deps = [], enabled = true }: UseApiStateOptions<T>): UseApiStateReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!enabled) {
      setLoading(true)
      return
    }
    fetchData()
  }, deps)

  return { data, loading, error, refetch: fetchData }
}
