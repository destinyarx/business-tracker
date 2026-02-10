'use client'

import type { OrderData, CartItem, OrderStatus } from './order.type'
import { useApi } from '@/hooks/useApi'
import { useToast } from '@/hooks/useToast'
import { toast } from 'sonner'
import { useOrderStore } from '@/features/orders/useOrderStore'


export function useOrderService() {
    const api = useApi()
    const appToast = useToast()
    const { orderState, setOrderState } = useOrderStore()

    return {
        async getAll() {
            try {
                const result = await api.get('/orders') 
                return result?.data.data ?? []
            } catch (error) {
                console.log(error)

                appToast.error({
                    title: "Failed to create product",
                    description: "Please try again."
                })
            }
        },

        async create(data: any) {
            const toastId = appToast.loading({
                title: 'Creating Order',
                description: 'Please wait...'
            })

            try {
                await api.post('/orders', data)
                
                toast.dismiss(toastId)
                appToast.success({
                    title: "Orders created",
                    description: "The order has been placed."
                })
            } catch (error) {
                console.log(error)

                toast.dismiss(toastId)
                appToast.error({
                    title: "Failed to create new order",
                    description: "Please try again."
                })
            }
        },

        async update(id: number, data: any) {
            const toastId = appToast.loading({
                title: 'Updating Order',
                description: 'Please wait...'
            })

            try {
                await api.put(`orders/${id}`, data) 
                
                setOrderState('show_orders')
                toast.dismiss(toastId)
                appToast.success({
                    title: "Order updated",
                    description: "The order details has been updated."
                })
            } catch (error) {
                console.log(error)

                toast.dismiss(toastId)
                appToast.error({
                    title: "Failed to update order",
                    description: "Please try again."
                })
            }
        },

        async delete(id: number) {
            const toastId = appToast.loading({
                title: 'Deleting Order',
                description: 'Please wait...'
            })

            try {
                await api.delete(`orders/${id}`) 
                
                setOrderState('show_orders')
                toast.dismiss(toastId)
                appToast.success({
                    title: "Order deleted",
                    description: "The order details has been deleted."
                })
            } catch (error) {
                console.log(error)

                toast.dismiss(toastId)
                appToast.error({
                    title: "Failed to delete order",
                    description: "Please try again."
                })
            }
        },

        async updateOrderStatus(orderDetails: OrderData, status: OrderStatus) {
            const toastId = appToast.loading({
                title: 'Updating Order Status',
                description: 'Please wait...'
            })

            const { id, items } = orderDetails

            const payload = {
                orderItems: items,
                status
            }

            try {
                await api.patch(`/orders/${id}/status`, payload)
                toast.dismiss(toastId)
            } catch (error) {
                console.log(error)

                toast.dismiss(toastId)
                appToast.error({
                    title: "Failed to update order status",
                    description: "Please try again."
                })
            }
        }
    }
}


