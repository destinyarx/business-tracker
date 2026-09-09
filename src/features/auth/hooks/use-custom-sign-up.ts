'use client'

import { useSignUp } from '@clerk/nextjs'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type {
  EmailVerificationFields,
  SignUpFields,
} from '../auth.schema'

export function useCustomSignUp() {
  const router = useRouter()
  const { isLoaded, setActive, signUp } = useSignUp()
  const [authError, setAuthError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false)

  const createAccount = async (fields: SignUpFields): Promise<void> => {
    if (!isLoaded) return

    setAuthError(null)
    setIsSubmitting(true)

    try {
      const attempt = await signUp.create({
        firstName: fields.ownerName,
        emailAddress: fields.emailAddress,
        password: fields.password,
        legalAccepted: fields.acceptsTerms,
      })

      if (attempt.status === 'complete' && attempt.createdSessionId) {
        await setActive({ session: attempt.createdSessionId })
        router.replace('/dashboard')
        return
      }

      if (attempt.unverifiedFields.includes('email_address')) {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
        setNeedsEmailVerification(true)
        return
      }

      setAuthError('Clerk needs more account information to continue.')
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        setAuthError(
          error.errors[0]?.longMessage ??
            error.errors[0]?.message ??
            'Clerk could not create the account.',
        )
      } else if (error instanceof Error) {
        setAuthError(error.message)
      } else {
        setAuthError('Clerk could not create the account.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const verifyEmailAddress = async (
    fields: EmailVerificationFields,
  ): Promise<void> => {
    if (!isLoaded) return

    setAuthError(null)
    setIsSubmitting(true)

    try {
      const attempt = await signUp.attemptEmailAddressVerification({
        code: fields.code,
      })

      if (attempt.status === 'complete' && attempt.createdSessionId) {
        await setActive({ session: attempt.createdSessionId })
        router.replace('/dashboard')
        return
      }

      setAuthError('The account still needs another verification step.')
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        setAuthError(
          error.errors[0]?.longMessage ??
            error.errors[0]?.message ??
            'Clerk could not verify that code.',
        )
      } else if (error instanceof Error) {
        setAuthError(error.message)
      } else {
        setAuthError('Clerk could not verify that code.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const signUpWithGoogle = async (): Promise<void> => {
    if (!isLoaded) return

    setAuthError(null)
    setIsGoogleLoading(true)

    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      })
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        setAuthError(
          error.errors[0]?.longMessage ??
            error.errors[0]?.message ??
            'Google sign-up could not start.',
        )
      } else if (error instanceof Error) {
        setAuthError(error.message)
      } else {
        setAuthError('Google sign-up could not start.')
      }
      setIsGoogleLoading(false)
    }
  }

  return {
    authError,
    createAccount,
    isClerkLoaded: isLoaded,
    isGoogleLoading,
    isSubmitting,
    needsEmailVerification,
    signUpWithGoogle,
    verifyEmailAddress,
  }
}
