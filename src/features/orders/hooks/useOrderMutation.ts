'use client'

import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useOrderService } from '@/features/orders/orderService.service'
import type { OrderData, OrderStatus, OrderForm } from '@/features/orders/order.type'

export function useOrderMutation() {
    const qc = useQueryClient()
    const orderService = useOrderService()

    const addOrder = useMutation({
        mutationFn: (data: any) => orderService.create(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['orders'] })
        }
    })

    const updateOrder = useMutation({
        mutationFn: ({id, data}: {id: number, data: OrderData}) => orderService.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['orders'] })
        }
    })

    const deleteOrder = useMutation({
        mutationFn: (id: number) => orderService.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['orders'] })
        }
    })

    const updateOrderStatus = useMutation({
        mutationFn: ({data, status}: {data: OrderData, status: OrderStatus}) => orderService.updateOrderStatus(data, status),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['orders']})
            qc.invalidateQueries({ queryKey: ['products']})
        }
    })

    return {
        addOrder,
        updateOrder,
        deleteOrder,
        updateOrderStatus
    }
}

