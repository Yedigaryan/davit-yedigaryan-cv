"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RouteFixer() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to homepage on any hard reload
    const browserPath = window.location.pathname
    
    if (browserPath !== "/") {
      router.replace("/");
      window.location.replace('/');
    }
  }, [router])

  return null
}
