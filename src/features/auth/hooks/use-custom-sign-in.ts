'use client'

import { useSignIn } from '@clerk/nextjs'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { SignInFields } from '../auth.schema'

export function useCustomSignIn() {
  const router = useRouter()
  const { isLoaded, setActive, signIn } = useSignIn()
  const [authError, setAuthError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const signInWithPassword = async (fields: SignInFields): Promise<void> => {
    if (!isLoaded) return

    setAuthError(null)
    setIsSubmitting(true)

    try {
      const attempt = await signIn.create({
        strategy: 'password',
        identifier: fields.emailAddress,
        password: fields.password,
      })

      if (attempt.status === 'complete' && attempt.createdSessionId) {
        await setActive({ session: attempt.createdSessionId })
        router.replace('/dashboard')
        return
      }

      if (attempt.status === 'needs_second_factor') {
        router.push('/sign-in')
        return
      }

      setAuthError('Clerk needs another verification step to finish signing in.')
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        setAuthError(
          error.errors[0]?.longMessage ??
            error.errors[0]?.message ??
            'Clerk could not sign you in.',
        )
      } else if (error instanceof Error) {
        setAuthError(error.message)
      } else {
        setAuthError('Clerk could not sign you in.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const signInWithGoogle = async (): Promise<void> => {
    if (!isLoaded) return

    setAuthError(null)
    setIsGoogleLoading(true)

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      })
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        setAuthError(
          error.errors[0]?.longMessage ??
            error.errors[0]?.message ??
            'Google sign-in could not start.',
        )
      } else if (error instanceof Error) {
        setAuthError(error.message)
      } else {
        setAuthError('Google sign-in could not start.')
      }
      setIsGoogleLoading(false)
    }
  }

  return {
    authError,
    isClerkLoaded: isLoaded,
    isGoogleLoading,
    isSubmitting,
    signInWithGoogle,
    signInWithPassword,
  }
}
