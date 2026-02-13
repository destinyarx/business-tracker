'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { ConfirmationProvider } from '@/app/provider/ConfirmationProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    const qc = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 30,
          refetchOnWindowFocus: false,
        },
      },
    })

    // 🔎 fingerprint
    ;(globalThis as any).__QUERY_CLIENT__ = qc

    return qc
  })
  

  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmationProvider>
        {children}

        {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
        )}
      </ConfirmationProvider>
    </QueryClientProvider>
  )
}
