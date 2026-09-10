import { z } from 'zod'

export const stockAdjustmentSchema = z.object({
  stock: z
    .number({ message: 'Enter a stock quantity.' })
    .int('Stock must be a whole number.')
    .min(0, 'Stock cannot be less than zero.'),
})

export type StockAdjustmentValues = z.infer<typeof stockAdjustmentSchema>
