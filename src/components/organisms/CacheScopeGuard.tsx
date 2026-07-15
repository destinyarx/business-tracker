'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useQueryClient } from '@tanstack/react-query'

// Drops all cached business data when the active Clerk account changes or the
// user signs out, so a failed refetch can't leave the previous account's rows
// on screen (SEC-002). Query keys are already scoped by userId; this frees the
// old account's memory instead of keeping it around for 30m gcTime.
export function CacheScopeGuard() {
  const { userId } = useAuth()
  const qc = useQueryClient()
  const prev = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    if (prev.current !== undefined && prev.current !== userId) {
      qc.clear()
    }
    prev.current = userId
  }, [userId, qc])

  return null
}
