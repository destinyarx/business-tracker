'use client'

import { useMemo } from 'react'
import { createProductsApi } from './products.api'
import { productImageUploadResponseSchema, productsResponseSchema } from './products.schema'
import type {
  CreateProductCommand,
  Product,
  ProductImageSelection,
  UpdateProductCommand,
} from './products.types'
import { useApi } from '@/hooks/useApi'
import { ensureFeatureError } from '@/lib/feature-error'

export function useProductService() {
  const api = useApi()
  const productsApi = useMemo(() => createProductsApi(api), [api])

  return {
    async getAll(): Promise<Product[]> {
      try {
        const response = await productsApi.getAll()
        return productsResponseSchema.parse(response).data
      } catch (error) {
        throw ensureFeatureError('product', error instanceof Error ? error : null)
      }
    },

    async create(
      product: CreateProductCommand,
      imageSelection: ProductImageSelection | null,
    ): Promise<void> {
      try {
        const command: CreateProductCommand = { ...product }

        if (imageSelection && !command.imageUrl) {
          const response = await productsApi.uploadImage(imageSelection.file)
          const uploadedImage = productImageUploadResponseSchema.parse(response).data
          command.imageUrl = uploadedImage.publicUrl
          command.image = uploadedImage.imageName
          command.imageSource = 'upload'
        } else if (command.imageUrl) {
          command.imageSource = 'url'
        }

        await productsApi.create(command)
      } catch (error) {
        throw ensureFeatureError('product', error instanceof Error ? error : null)
      }
    },

    async update(productId: number, product: UpdateProductCommand): Promise<void> {
      try {
        await productsApi.update(productId, product)
      } catch (error) {
        throw ensureFeatureError('product', error instanceof Error ? error : null)
      }
    },

    async delete(productId: number): Promise<void> {
      try {
        await productsApi.delete(productId)
      } catch (error) {
        throw ensureFeatureError('product', error instanceof Error ? error : null)
      }
    },

    async deleteImage(imageName: string): Promise<void> {
      try {
        await productsApi.deleteImage(imageName)
      } catch (error) {
        throw ensureFeatureError('product image', error instanceof Error ? error : null)
      }
    },
  }
}
