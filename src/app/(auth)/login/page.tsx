import { CustomSignInForm } from '@/features/auth/components/CustomSignInForm'
import { AuthShell } from '@/features/auth/components/AuthShell'

export default function LoginPage() {
  return (
    <AuthShell
      heading="Welcome back"
      description="Pick up where you left off, your orders, stock and expenses are waiting."
      asideHeading="Everything your shop did yesterday, in one screen today."
      asideDescription="Orders, stock, customers and expenses stay in sync, with no double entry and no lost records."
    >
      <CustomSignInForm />
    </AuthShell>
  )
}
