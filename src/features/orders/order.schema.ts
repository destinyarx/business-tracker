import { z } from 'zod'

export const orderStatusSchema = z.enum(['pending', 'in_progress', 'completed', 'cancelled', 'failed'])

export const orderFormSchema = z.object({
  customerId: z.number().int().positive().nullable(),
  orderName: z.string().max(50, 'Order name must be 50 characters or fewer.').optional(),
  status: orderStatusSchema,
  notes: z.string().max(500, 'Notes must be 500 characters or fewer.').optional(),
})

export type OrderFormValues = z.infer<typeof orderFormSchema>

const orderProductSummaryResponseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  price: z.coerce.number().nonnegative(),
  profit: z.coerce.number().nullish().transform((profit) => profit ?? undefined),
})

const orderCustomerSummaryResponseSchema = z.object({
  name: z.string(),
})

export const orderLineItemResponseSchema = z.object({
  id: z.number().int().positive().optional(),
  quantity: z.coerce.number().int().nonnegative(),
  priceAtPurchase: z.coerce.number().nonnegative(),
  product: orderProductSummaryResponseSchema.nullish().transform((product) => product ?? undefined),
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
  customer: orderCustomerSummaryResponseSchema.nullish().transform((customer) => customer ?? undefined),
  createdAt: z.string().min(1),
  statusUpdatedAt: z.string().nullish().transform((statusUpdatedAt) => statusUpdatedAt ?? undefined),
  profitInaccurate: z.boolean().optional(),
})

export const paginatedOrdersResponseSchema = z.object({
  data: z.object({
    orders: z.array(orderResponseSchema),
    hasNext: z.boolean(),
    hasPrev: z.boolean().optional(),
  }),
})
