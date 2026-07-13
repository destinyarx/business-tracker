import { z } from 'zod'

export const customerResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  status: z.number().optional(),
  customerType: z.enum(['normal', 'loyal', 'deluxe', 'premium', 'VIP']),
  phone: z.string().nullish().transform((phone) => phone ?? undefined),
  email: z.string().nullish().transform((email) => email ?? undefined),
  notes: z.string().nullish().transform((notes) => notes ?? undefined),
  createdAt: z.coerce.date(),
})

export const customersResponseSchema = z.object({
  data: z.array(customerResponseSchema),
})
