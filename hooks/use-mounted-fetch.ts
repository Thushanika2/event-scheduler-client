import { useEffect } from "react"

export function useMountedFetch(fetcher: () => void | Promise<void>) {
  useEffect(() => {
    let cancelled = false

    void Promise.resolve().then(() => {
      if (!cancelled) {
        void fetcher()
      }
    })

    return () => {
      cancelled = true
    }
  }, [fetcher])
}
