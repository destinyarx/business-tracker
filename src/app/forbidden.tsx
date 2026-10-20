import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ErrorStatusPage,
  errorPrimaryActionClassName,
} from '@/features/errors/components/ErrorStatusPage'

export default function Forbidden() {
  return (
    <ErrorStatusPage
      statusCode={403}
      label="Forbidden"
      title="You don't have access to this page"
      description="Your account doesn't have permission to view this area. If you think this is a mistake, ask your business owner or admin to grant you access."
      primaryAction={
        <Button asChild size="lg" className={errorPrimaryActionClassName}>
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      }
    />
  )
}
