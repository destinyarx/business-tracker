'use client'

import type { Customer } from './customers.types'
import { useApi } from '@/hooks/useApi'
import { useToast } from '@/hooks/useToast'
import { toast } from 'sonner'

export function useCustomerService() {
  const api = useApi()
  const appToast = useToast()

  return {
    async getAll() {
      try {
        const result = await api.get('/customers')
        console.log(result.data.data)
        return result?.data.data ?? []
      } catch (err) {
        console.log(err)
        return []
      }
    },

    async create(data: Customer) {
      try {
        const id = appToast.loading({
          title: "Saving customer...",
          description: "Please wait."
        })
        
        await api.post('/customers', data)

        toast.dismiss(id)
        appToast.success({
          title: "Customer added",
          description: "The new record has been saved."
        })

      } catch (err) {
        console.log(err)

        appToast.error({
          title: "Failed to save",
          description: "Please try again."
        })
      }
    },

    async update(id: number, data: Customer) {
      try {
        const toastId = appToast.loading({
          title: "Updating customer...",
          description: "Please wait."
        })

        await api.patch(`/customers/${id}`, data)

        toast.dismiss(toastId)
        appToast.success({
          title: "Customer added",
          description: "The new record has been saved."
        })
      } catch (err) {
        console.log(err)

        appToast.error({
          title: "Failed to update customer record",
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

        await api.delete(`/customers/${id}`)

        toast.dismiss(toastId)
        appToast.success({
          title: "Customer added",
          description: "The new record has been saved."
        })
      } catch (err) {
        console.log(err)

        appToast.error({
          title: "Failed to delete customer record",
          description: "Please try again."
        })
      }
    }
  }
}
