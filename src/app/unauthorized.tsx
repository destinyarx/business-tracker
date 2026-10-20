import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ErrorStatusPage,
  errorPrimaryActionClassName,
} from '@/features/errors/components/ErrorStatusPage'

export default function Unauthorized() {
  return (
    <ErrorStatusPage
      statusCode={401}
      label="Unauthorized"
      title="Please log in to continue"
      description="You need to be signed in to view this page. Log in to your NegosyoTracker account and we'll get you back on track."
      primaryAction={
        <Button asChild size="lg" className={errorPrimaryActionClassName}>
          <Link href="/login">Log in</Link>
        </Button>
      }
    />
  )
}
