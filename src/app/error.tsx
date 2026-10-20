'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  ErrorStatusPage,
  errorPrimaryActionClassName,
} from '@/features/errors/components/ErrorStatusPage'

interface ServerErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ServerError({ error, reset }: ServerErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorStatusPage
      statusCode={500}
      label="Server error"
      title="Something went wrong on our end"
      description="An unexpected error stopped this page from loading. Your data is safe. Try again, and if it keeps happening, come back in a few minutes."
      primaryAction={
        <Button size="lg" className={errorPrimaryActionClassName} onClick={reset}>
          Try again
        </Button>
      }
    />
  )
}
