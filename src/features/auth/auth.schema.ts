import { z } from 'zod'

export const signInSchema = z.object({
  emailAddress: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
  rememberMe: z.boolean(),
})

export const signUpSchema = z.object({
  ownerName: z.string().trim().min(2, 'Enter your store or owner name.'),
  emailAddress: z.email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
  acceptsTerms: z.boolean().refine((accepted) => accepted, {
    message: 'Accept the legal agreement to continue.',
  }),
})

export const emailVerificationSchema = z.object({
  code: z.string().trim().min(6, 'Enter the verification code.'),
})

export type SignInFields = z.infer<typeof signInSchema>
export type SignUpFields = z.infer<typeof signUpSchema>
export type EmailVerificationFields = z.infer<typeof emailVerificationSchema>
