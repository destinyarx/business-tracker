import { SignIn } from '@clerk/nextjs'
import { AuthShell } from '@/features/auth/components/AuthShell'

export default function SignInPage() {
  return (
    <AuthShell
      heading="Welcome back"
      description="Sign in to your workspace."
      asideHeading="Everything your shop did yesterday, in one screen today."
      asideDescription="Orders, stock, customers and expenses stay in sync. No double entry and no lost records."
    >
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
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
