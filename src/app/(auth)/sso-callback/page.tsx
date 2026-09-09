import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'
import { ThemeSync } from '@/components/molecules/ThemeSync'

export default function SsoCallbackPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#F2F5F4] px-5 dark:bg-[#0B1615]">
      <ThemeSync />
      <AuthenticateWithRedirectCallback
        signInUrl="/login"
        signUpUrl="/register"
        signInForceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/dashboard"
      />
      <div id="clerk-captcha" />
    </main>
  )
}
