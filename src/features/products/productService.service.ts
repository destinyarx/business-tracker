'use client'

import type { Product } from './products.types'
import { useApi } from '@/hooks/useApi'
import { useToast } from '@/hooks/useToast'
import { toast } from 'sonner'

type UploadProductImageResponse = {
  data: {
    data: {
      publicUrl: string;
    };
  };
};

export function useProductService() {
  const api = useApi()
  const appToast = useToast()

  async function uploadProductImage(file: File): Promise<UploadProductImageResponse> {
    const buffer = await file.arrayBuffer();
   
    return await api.post(`files/upload/product-image`, buffer, {
      headers: { 
        'Content-Type': file.type,
        'X-Filename': file.name,
       }
    });
  }

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

    async create(form: Product, file: any) {
      try {
        const toastId = appToast.loading({
          title: "Adding product...",
          description: "Please wait."
        })

        if (file && !form.imageUrl) {
          const productImage = await uploadProductImage(file.file)
          form.imageUrl = productImage.data.data.publicUrl
        }

        await api.post('/products', form)
      
        toast.dismiss(toastId)
        appToast.success({
          title: "Product added",
          description: "The new product has been saved."
        })
      } catch (err) {
        console.log(err)

        appToast.error({
          title: "Failed to create product",
          description: "Please try again."
        })
      }
    },

    async update(id: number, data: Product) {
      try {
        const toastId = appToast.loading({
          title: "Updating customer...",
          description: "Please wait."
        })

        await api.patch(`/products/${id}`, data)

        toast.dismiss(toastId)
        appToast.success({
          title: "Product updated",
          description: "The product has been updated."
        })
      } catch (err) {
        console.log(err)

        appToast.error({
          title: "Failed to update product details",
          description: "Please try again."
        })
      }
    },

    async delete(id: number) {
      try {
        const toastId = appToast.loading({
          title: "Deleting customer...",
          description: "Please wait."
        })

        await api.delete(`/products/${id}`)
      
        toast.dismiss(toastId)
        appToast.success({
          title: "Product deleted",
          description: "The product has been deleted."
        })
      } catch (err) {
        console.log(err)
        appToast.error({
          title: "Failed to delete product",
          description: "Please try again."
        })
      }
    },
  }
}
