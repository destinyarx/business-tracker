import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ErrorStatusPage,
  errorPrimaryActionClassName,
} from '@/features/errors/components/ErrorStatusPage'

export default function NotFound() {
  return (
    <ErrorStatusPage
      statusCode={404}
      label="Not found"
      title="This page doesn't exist"
      description="The link may be broken, or the page may have been moved or removed. Check the address or head back to your workspace."
      primaryAction={
        <Button asChild size="lg" className={errorPrimaryActionClassName}>
          <Link href="/dashboard">Open your workspace</Link>
        </Button>
      }
    />
  )
}
