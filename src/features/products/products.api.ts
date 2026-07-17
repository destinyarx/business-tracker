import type { AxiosInstance } from 'axios'
import type { CreateProductCommand, UpdateProductCommand } from './products.types'

export function createProductsApi(api: AxiosInstance) {
  return {
    async getAll(): Promise<object> {
      const response = await api.get<object>('/products')
      return response.data
    },

    async uploadImage(file: File): Promise<object> {
      const formData = new FormData()
      formData.append('image', file)

      const response = await api.post<object>('/files/upload/product-image', formData)
      return response.data
    },

    async create(product: CreateProductCommand): Promise<void> {
      await api.post('/products', product)
    },

    async update(productId: number, product: UpdateProductCommand): Promise<void> {
      await api.patch(`/products/${productId}`, product)
    },

    async delete(productId: number): Promise<void> {
      await api.delete(`/products/${productId}`)
    },

    async deleteImage(imageName: string): Promise<void> {
      await api.delete(`/files/delete/product-image/${encodeURIComponent(imageName)}`)
    },
  }
}
