import { z } from 'zod'

export const productFormSchema = z.object({
  id: z.preprocess(
    (productId) =>
      productId === '' || productId === undefined || productId === null
        ? undefined
        : Number(productId),
    z.number().optional(),
  ),
  title: z.string().min(2, 'Title is required'),
  description: z.string().nullable(),
  sku: z.string().nullish(),
  barcode: z.string().nullish(),
  supplier: z.string().nullish(),
  price: z.preprocess(
    (price) => Number(price),
    z.number().min(1, 'Price must greater than 0'),
  ),
  stock: z.preprocess(
    (stock) => Number(stock),
    z.number().min(0, 'Stock must be 0 or greater'),
  ),
  profitPercentage: z.preprocess(
    (profitPercentage) =>
      profitPercentage === '' ||
      profitPercentage === undefined ||
      profitPercentage === null
        ? null
        : Number(profitPercentage),
    z.number().max(90, 'Profit must not be more than 90% of the price').nullable(),
  ),
  profit: z.preprocess(
    (profit) =>
      profit === '' || profit === undefined || profit === null
        ? null
        : Number(profit),
    z.number().nullable(),
  ),
  category: z.string().min(1, 'Category is required'),
  image: z.string().nullish(),
  imageUrl: z
    .string()
    .trim()
    .refine(
      (imageUrl) => {
        if (imageUrl === '') return true

        try {
          const parsedImageUrl = new URL(imageUrl)
          return (
            (parsedImageUrl.protocol === 'https:' ||
              parsedImageUrl.protocol === 'http:') &&
            Boolean(parsedImageUrl.hostname)
          )
        } catch {
          return false
        }
      },
      'Enter a valid HTTP or HTTPS image URL',
    )
    .nullish(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
export type ProductFormInput = z.input<typeof productFormSchema>

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
