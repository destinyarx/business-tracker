'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInSchema, type SignInFields } from '../auth.schema'
import { useCustomSignIn } from '../hooks/use-custom-sign-in'
import { AuthSocialButtons } from './AuthSocialButtons'

export function CustomSignInForm() {
  const {
    authError,
    isClerkLoaded,
    isGoogleLoading,
    isSubmitting,
    signInWithGoogle,
    signInWithPassword,
  } = useCustomSignIn()
  const form = useForm<SignInFields>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      emailAddress: '',
      password: '',
      rememberMe: true,
    },
  })

  return (
    <div>
      <AuthSocialButtons
        disabled={!isClerkLoaded || isSubmitting}
        isGoogleLoading={isGoogleLoading}
        onGoogleClick={() => void signInWithGoogle()}
      />

      <form
        noValidate
        onSubmit={form.handleSubmit(signInWithPassword)}
        className="space-y-3.5"
      >
        <div>
          <Label htmlFor="emailAddress" className="mb-1.5 text-[12.5px]">
            Email address
          </Label>
          <Input
            id="emailAddress"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(form.formState.errors.emailAddress)}
            className="h-12 rounded-xl border-[#DCE3E2] bg-white px-3.5 text-sm shadow-none focus-visible:border-[#00BEAA] focus-visible:ring-[#00BEAA]/20 dark:border-[#2B4340] dark:bg-[#12201F]"
            {...form.register('emailAddress')}
          />
          {form.formState.errors.emailAddress && (
            <p className="mt-1.5 text-xs text-red-600" role="alert">
              {form.formState.errors.emailAddress.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="mb-1.5 text-[12.5px]">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(form.formState.errors.password)}
            className="h-12 rounded-xl border-[#DCE3E2] bg-white px-3.5 text-sm shadow-none focus-visible:border-[#00BEAA] focus-visible:ring-[#00BEAA]/20 dark:border-[#2B4340] dark:bg-[#12201F]"
            {...form.register('password')}
          />
          {form.formState.errors.password && (
            <p className="mt-1.5 text-xs text-red-600" role="alert">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-0.5">
          <label className="inline-flex cursor-pointer items-center gap-2 text-[12.5px] text-[#3F5254] dark:text-[#C3D4D1]">
            <input
              type="checkbox"
              className="size-[15px] accent-[#00A899]"
              {...form.register('rememberMe')}
            />
            Keep me signed in
          </label>
          <Link
            href="/sign-in#/forgot-password"
            className="ml-auto text-[12.5px] text-[#007F78] hover:text-[#00A899] dark:text-[#5EEBDD]"
          >
            Forgot password?
          </Link>
        </div>

        {authError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-700 dark:bg-red-950/40 dark:text-red-300" role="alert">
            {authError}
          </p>
        )}

        <Button
          type="submit"
          disabled={!isClerkLoaded || isSubmitting || isGoogleLoading}
          className="h-[52px] w-full rounded-xl bg-[#0C4B47] text-[15px] font-semibold text-white shadow-[0_14px_30px_-18px_rgba(12,75,71,0.85)] hover:bg-[#007F78]"
        >
          {isSubmitting ? <LoaderCircle className="animate-spin" /> : 'Sign in'}
          {!isSubmitting && <ArrowRight className="size-4" />}
        </Button>
      </form>

      <p className="mt-5 text-center text-[13px] text-[#5F7273] dark:text-[#9FB3B0]">
        New here?{' '}
        <Link href="/register" className="text-[#007F78] hover:text-[#00A899] dark:text-[#5EEBDD]">
          Create an account
        </Link>
      </p>
    </div>
  )
}
