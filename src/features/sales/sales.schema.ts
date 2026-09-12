import { z } from 'zod'

const saleOrderItemResponseSchema = z.object({
  id: z.number().int().positive(),
  productId: z.number().int().positive().nullable(),
  quantity: z.number().int().nonnegative(),
  priceAtPurchase: z.string(),
  subtotal: z.string(),
  product: z
    .object({
      id: z.number().int().positive(),
      title: z.string().nullable(),
    })
    .nullable(),
})

export const saleResponseSchema = z.object({
  id: z.number().int().positive(),
  orderId: z.number().int().positive(),
  orderName: z.string().nullable(),
  customerId: z.number().int().positive().nullable(),
  customerName: z.string().nullable(),
  totalAmount: z.string(),
  totalProfit: z.string().nullable(),
  profitInaccurate: z.boolean(),
  notes: z.string().nullable(),
  state: z.enum(['active', 'reverted']),
  recognizedAt: z.string().min(1),
  recognizedBy: z.string().min(1),
  revertedAt: z.string().nullable(),
  revertedBy: z.string().nullable(),
  reversalReason: z.string().nullable(),
  createdAt: z.string().min(1),
  updatedAt: z.string().nullable(),
  orderItems: z.array(saleOrderItemResponseSchema),
})

export const salesResponseSchema = z.object({
  data: z.array(saleResponseSchema),
})

export const saleDetailResponseSchema = z.object({
  data: saleResponseSchema,
})
