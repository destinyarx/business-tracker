import { AuthShell } from '@/features/auth/components/AuthShell'
import { CustomSignUpForm } from '@/features/auth/components/CustomSignUpForm'

export default function RegisterPage() {
  return (
    <AuthShell
      heading="Create your account"
      description="Set up your workspace, with sales, stock and expenses in one place from day one."
      asideHeading="Set up once, run your whole shop from here."
      asideDescription="Orders, stock and expenses stay in sync from your first day, without separate spreadsheets or apps."
    >
      <CustomSignUpForm />
    </AuthShell>
  )
}
