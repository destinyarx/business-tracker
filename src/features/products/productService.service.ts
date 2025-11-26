'use client'

import type { Product } from './products.types'
import { useApi } from '@/hooks/useApi'
import { useNotify } from '@/hooks/useNotification'

export function useProductService() {
  const api = useApi()
  const { success, error, loading } = useNotify()

  return {
    async getAll() {
      try {
        const result = await api.get('/products')
        console.log(result.data.data)
        return result?.data.data ?? []
      } catch (err) {
        console.log(err)
        return []
      }
    },

    async create(data: Product) {
      try {
        const request = api.post('/products', data)
        await loading(request, 'Products successfully created!', 'Creating product...')
      } catch (err) {
        console.log(err)
      }
    },

    async update(id: number, data: Product) {
      try {
        const request = api.patch(`/products/${id}`, data)
        await loading(request, 'Products successfully updated!', 'Updating product...')
      } catch (err) {
        console.log(err)
      }
    },

    async delete(id: number) {
      try {
        const request = api.delete(`/products/${id}`)
        await loading(request, 'Products successfully deleted!', 'Deleting product...')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
