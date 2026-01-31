'use client'

import type { ExpensesFormData } from '@/features/expenses/expenses.types'
import { useApi } from '@/hooks/useApi'
import { useToast } from '@/hooks/useToast'
import { toast } from 'sonner'

export function useExpensesService() {
    const api = useApi()
    const appToast = useToast()

    return {
        async getPaginated(limit: number, offset: number, category?: string, filterPaymentMethod?: string) {
            try {
                const params = new URLSearchParams({
                    limit: String(limit),
                    offset: String(offset)
                })

                if (category) params.append('category', category)

                if (filterPaymentMethod) params.append('filter', filterPaymentMethod)

                return await api.get(`/expenses/paginated?${params.toString()}`)
            } catch (error) {
                console.log(error)
                appToast.error({
                    title: "Failed to fetch expenses data",
                    description: "Please try again."
                }) 
            }
        },

        async getAll() {
            try {
                await api.get('/expenses')
            } catch (error) {
                console.log(error)
                appToast.error({
                    title: "Failed to fetch expenses data",
                    description: "Please try again."
                }) 
            }
        },

        async create(form: ExpensesFormData) {
            const toastId = appToast.loading({
                title: 'Adding expense\'s details',
                description: 'Please wait...'
            })

            try {
                await api.post('/expenses', form)

                toast.dismiss(toastId)
                appToast.success({
                    title: "Expenses created",
                    description: "The expenses has been added on the list."
                })
            } catch (error) {
                console.log(error)
                toast.dismiss(toastId)

                appToast.error({
                    title: "Failed to create expenses",
                    description: "Please try again."
                }) 
            }
        },

        async update(form: ExpensesFormData) {
            const toastId = appToast.loading({
                title: 'Updating expense\'s details',
                description: 'Please wait...'
            })

            try {
                await api.patch(`/expenses/${form.id}`, form)

                toast.dismiss(toastId)
                appToast.success({
                    title: "Expenses updated",
                    description: "The expense's details has been updated."
                })
            } catch (error) {
                console.log(error)
                toast.dismiss(toastId)

                appToast.error({
                    title: "Failed to update expenses",
                    description: "Please try again."
                }) 
            }
        },

        async delete(id: number) {
            const toastId = appToast.loading({
                title: 'Deleting expense\'s record',
                description: 'Please wait...'
            })

            try {
                await api.delete(`/expenses/${id}`)

                toast.dismiss(toastId)
                appToast.success({
                    title: "Expenses deleted",
                    description: "The expenses has been deleted on the list."
                })
            } catch (error) {
                console.log(error)
                toast.dismiss(toastId)

                appToast.error({
                    title: "Failed to delete expenses",
                    description: "Please try again."
                }) 
            }
        }
    }
}