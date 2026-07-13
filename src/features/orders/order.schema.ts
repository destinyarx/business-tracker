import { z } from 'zod'
import { customerResponseSchema } from '@/features/customers/customers.schema'
import { productResponseSchema } from '@/features/products/products.schema'

const orderStatusSchema = z.enum(['pending', 'in_progress', 'completed', 'cancelled', 'failed'])

export const orderLineItemResponseSchema = z.object({
  id: z.number().int().positive().optional(),
  quantity: z.coerce.number().int().nonnegative(),
  priceAtPurchase: z.coerce.number().nonnegative(),
  product: productResponseSchema.optional(),
  profit: z.coerce.number().nullish().transform((profit) => profit ?? undefined),
})

export const orderResponseSchema = z.object({
  id: z.number().int().positive(),
  customerId: z.number().int().positive().nullable(),
  orderName: z.string().nullish().transform((orderName) => orderName ?? undefined),
  status: orderStatusSchema,
  notes: z.string().nullish().transform((notes) => notes ?? undefined),
  orderItems: z.array(orderLineItemResponseSchema).optional().default([]),
  items: z.array(orderLineItemResponseSchema),
  totalAmount: z.coerce.number().optional(),
  totalProfit: z.coerce.number().optional(),
  customer: customerResponseSchema.nullish().transform((customer) => customer ?? undefined),
  createdAt: z.string().min(1),
  statusUpdatedAt: z.string().optional(),
  profitInaccurate: z.boolean().optional(),
})

export const paginatedOrdersResponseSchema = z.object({
  data: z.object({
    orders: z.array(orderResponseSchema),
    hasNext: z.boolean(),
    hasPrev: z.boolean().optional(),
  }),
})
