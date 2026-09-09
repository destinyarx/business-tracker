'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { useForm, type UseFormRegisterReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  emailVerificationSchema,
  type EmailVerificationFields,
  signUpSchema,
  type SignUpFields,
} from '../auth.schema'
import { useCustomSignUp } from '../hooks/use-custom-sign-up'
import { AuthSocialButtons } from './AuthSocialButtons'

export function CustomSignUpForm() {
  const {
    authError,
    createAccount,
    isClerkLoaded,
    isGoogleLoading,
    isSubmitting,
    needsEmailVerification,
    signUpWithGoogle,
    verifyEmailAddress,
  } = useCustomSignUp()
  const signUpForm = useForm<SignUpFields>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      ownerName: '',
      emailAddress: '',
      password: '',
      acceptsTerms: false,
    },
  })
  const verificationForm = useForm<EmailVerificationFields>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: { code: '' },
  })

  if (needsEmailVerification) {
    return (
      <form
        noValidate
        onSubmit={verificationForm.handleSubmit(verifyEmailAddress)}
        className="space-y-4"
      >
        <p className="text-sm leading-6 text-[#5F7273] dark:text-[#9FB3B0]">
          Clerk sent a verification code to your email address.
        </p>
        <div>
          <Label htmlFor="verificationCode" className="mb-1.5 text-[12.5px]">
            Verification code
          </Label>
          <Input
            id="verificationCode"
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-invalid={Boolean(verificationForm.formState.errors.code)}
            className="h-12 rounded-xl border-[#DCE3E2] bg-white px-3.5 text-center font-mono text-lg tracking-[0.3em] shadow-none focus-visible:border-[#00BEAA] focus-visible:ring-[#00BEAA]/20 dark:border-[#2B4340] dark:bg-[#12201F]"
            {...verificationForm.register('code')}
          />
          {verificationForm.formState.errors.code && (
            <p className="mt-1.5 text-xs text-red-600" role="alert">
              {verificationForm.formState.errors.code.message}
            </p>
          )}
        </div>
        {authError && <AuthError message={authError} />}
        <Button
          type="submit"
          disabled={!isClerkLoaded || isSubmitting}
          className="h-[52px] w-full rounded-xl bg-[#0C4B47] text-[15px] font-semibold text-white hover:bg-[#007F78]"
        >
          {isSubmitting ? <LoaderCircle className="animate-spin" /> : 'Verify email'}
          {!isSubmitting && <ArrowRight className="size-4" />}
        </Button>
      </form>
    )
  }

  return (
    <div>
      <AuthSocialButtons
        disabled={!isClerkLoaded || isSubmitting}
        isGoogleLoading={isGoogleLoading}
        onGoogleClick={() => void signUpWithGoogle()}
      />

      <form noValidate onSubmit={signUpForm.handleSubmit(createAccount)} className="space-y-3.5">
        <AuthField
          id="ownerName"
          label="Store / owner name"
          error={signUpForm.formState.errors.ownerName?.message}
          inputProps={signUpForm.register('ownerName')}
          autoComplete="name"
        />
        <AuthField
          id="emailAddress"
          label="Email address"
          error={signUpForm.formState.errors.emailAddress?.message}
          inputProps={signUpForm.register('emailAddress')}
          autoComplete="email"
          type="email"
        />
        <AuthField
          id="password"
          label="Password"
          error={signUpForm.formState.errors.password?.message}
          inputProps={signUpForm.register('password')}
          autoComplete="new-password"
          type="password"
        />

        <div>
          <label className="inline-flex cursor-pointer items-start gap-2 text-[12.5px] text-[#3F5254] dark:text-[#C3D4D1]">
            <input type="checkbox" className="mt-0.5 size-[15px] accent-[#00A899]" {...signUpForm.register('acceptsTerms')} />
            I agree to the Terms and Privacy Policy
          </label>
          {signUpForm.formState.errors.acceptsTerms && (
            <p className="mt-1.5 text-xs text-red-600" role="alert">
              {signUpForm.formState.errors.acceptsTerms.message}
            </p>
          )}
        </div>

        {authError && <AuthError message={authError} />}
        <div id="clerk-captcha" />

        <Button
          type="submit"
          disabled={!isClerkLoaded || isSubmitting || isGoogleLoading}
          className="h-[52px] w-full rounded-xl bg-[#0C4B47] text-[15px] font-semibold text-white shadow-[0_14px_30px_-18px_rgba(12,75,71,0.85)] hover:bg-[#007F78]"
        >
          {isSubmitting ? <LoaderCircle className="animate-spin" /> : 'Create account'}
          {!isSubmitting && <ArrowRight className="size-4" />}
        </Button>
      </form>

      <p className="mt-5 text-center text-[13px] text-[#5F7273] dark:text-[#9FB3B0]">
        Already have an account?{' '}
        <Link href="/login" className="text-[#007F78] hover:text-[#00A899] dark:text-[#5EEBDD]">
          Sign in
        </Link>
      </p>
    </div>
  )
}

interface AuthFieldProps {
  id: string
  label: string
  error?: string
  inputProps: UseFormRegisterReturn
  autoComplete: string
  type?: 'email' | 'password' | 'text'
}

function AuthField({
  id,
  label,
  error,
  inputProps,
  autoComplete,
  type = 'text',
}: AuthFieldProps) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 text-[12.5px]">{label}</Label>
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className="h-12 rounded-xl border-[#DCE3E2] bg-white px-3.5 text-sm shadow-none focus-visible:border-[#00BEAA] focus-visible:ring-[#00BEAA]/20 dark:border-[#2B4340] dark:bg-[#12201F]"
        {...inputProps}
      />
      {error && <p className="mt-1.5 text-xs text-red-600" role="alert">{error}</p>}
    </div>
  )
}

function AuthError({ message }: { message: string }) {
  return (
    <p className="rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-700 dark:bg-red-950/40 dark:text-red-300" role="alert">
      {message}
    </p>
  )
}
