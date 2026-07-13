import { z } from 'zod'

export const productResponseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string().nullable(),
  sku: z.string().nullish().transform((sku) => sku ?? undefined),
  barcode: z.string().nullish().transform((barcode) => barcode ?? undefined),
  supplier: z.string().nullish().transform((supplier) => supplier ?? undefined),
  price: z.number(),
  stock: z.number(),
  profitPercentage: z.number().nullish().transform((profitPercentage) => profitPercentage ?? undefined),
  profit: z.number().nullish().transform((profit) => profit ?? undefined),
  category: z.string().nullish().transform((category) => category ?? undefined),
  image: z.string().nullish().transform((image) => image ?? undefined),
  imageUrl: z.string().nullish().transform((imageUrl) => imageUrl ?? undefined),
  imageSource: z.enum(['url', 'upload']).nullish().transform((imageSource) => imageSource ?? undefined),
})

export const productsResponseSchema = z.object({
  data: z.array(productResponseSchema),
})

export const productImageUploadResponseSchema = z.object({
  data: z.object({
    publicUrl: z.url(),
    imageName: z.string().min(1),
  }),
})
