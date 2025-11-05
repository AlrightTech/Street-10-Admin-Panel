'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    // Always redirect to select-role page first
    // This ensures users can always see and change their role selection
    router.push('/select-role')
  }, [router])
  
  return null
}

