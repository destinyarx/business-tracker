import { SignUp } from '@clerk/nextjs'
import { AuthShell } from '@/features/auth/components/AuthShell'

export default function SignUpPage() {
  return (
    <AuthShell
      heading="Create your workspace"
      description="Start with the free tier. No credit card required."
      asideHeading="Put every moving part of your business in one place."
      asideDescription="Create the account once, then manage customers, orders, stock, sales and expenses from one workspace."
    >
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        forceRedirectUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: 'w-full',
            cardBox: 'w-full shadow-none',
            card: 'w-full border-0 bg-transparent p-0 shadow-none',
            headerTitle: 'sr-only',
            headerSubtitle: 'sr-only',
            footer: 'bg-transparent',
          },
        }}
      />
    </AuthShell>
  )
}
