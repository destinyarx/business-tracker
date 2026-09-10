import { z } from 'zod'

export const customerFormSchema = z.object({
  name: z.string().min(1, 'Customer name is required').max(100),
  phone: z.string().max(11, 'Phone number should only be 11 digits').optional(),
  customerType: z.enum(['normal', 'loyal', 'deluxe', 'premium', 'VIP']),
  email: z.string().max(50).optional(),
  notes: z.string().max(500).optional(),
})

export type CustomerFormValues = z.infer<typeof customerFormSchema>

export const customerResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  status: z.string().min(1).optional(),
  customerType: z.enum(['normal', 'loyal', 'deluxe', 'premium', 'VIP']),
  phone: z.string().nullish().transform((phone) => phone ?? undefined),
  email: z.string().nullish().transform((email) => email ?? undefined),
  notes: z.string().nullish().transform((notes) => notes ?? undefined),
  createdAt: z.coerce.date(),
})

export const customersResponseSchema = z.object({
  data: z.array(customerResponseSchema),
})
