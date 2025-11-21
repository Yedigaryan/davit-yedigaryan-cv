"use client"

import { useEffect, useState } from "react"

export default function PageLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const hasVisited = localStorage.getItem("pageLoaderShown")

    if (hasVisited) {
      // Already shown loader before, skip it
      setIsLoading(false)
    } else {
      // First time, show loader for 987ms then mark as visited
      const timer = setTimeout(() => {
        setIsLoading(false)
        localStorage.setItem("pageLoaderShown", "true")
      }, 987)

      return () => clearTimeout(timer)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
