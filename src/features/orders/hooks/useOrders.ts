'use client'

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useOrderService } from '@/features/orders/orderService.service'
import type { OrderData, OrderStatus } from '@/features/orders/order.type'

export function useOrders() {
    const qc = useQueryClient()
    const orderService = useOrderService()

    const ordersQuery = useQuery({
        queryKey: ['orders'],
        queryFn: orderService.getAll
    })

    const addOrder = useMutation({
        // TODO: add strict type here
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
        mutationFn: ({id, status}: { id: number, status: string}) => orderService.updateOrderStatus(id, status),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['orders']})
        }
    })

    return {
        ordersQuery,
        addOrder,
        updateOrder,
        deleteOrder,
        updateOrderStatus
    }
}

