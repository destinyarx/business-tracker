'use client'

import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useOrderService } from '@/features/orders/orderService.service'
import type { CreateOrderCommand, OrderData, OrderStatus, UpdateOrderCommand } from '@/features/orders/order.type'
import { businessKeys, useBusinessScope } from '@/lib/business-scope'

export function useOrderMutation() {
    const qc = useQueryClient()
    const orderService = useOrderService()
    const { userId } = useBusinessScope()

    const addOrder = useMutation({
        mutationFn: (order: CreateOrderCommand) => orderService.create(order),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['orders'] })
        }
    })

    const updateOrder = useMutation({
        mutationFn: ({ id, data }: { id: number, data: UpdateOrderCommand }) => orderService.update(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['orders'] })
            qc.invalidateQueries({ queryKey: businessKeys.dashboardRoot(userId) })
            qc.invalidateQueries({ queryKey: ['sales'] })
            qc.invalidateQueries({ queryKey: businessKeys.dashboardRoot(userId) })
        }
    })

    const deleteOrder = useMutation({
        mutationFn: (id: number) => orderService.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['orders'] })
            qc.invalidateQueries({ queryKey: businessKeys.dashboardRoot(userId) })
        }
    })

    const updateOrderStatus = useMutation({
        mutationFn: ({ data, status, reversalReason }: { data: OrderData, status: OrderStatus, reversalReason?: string }) => orderService.updateOrderStatus(data, status, reversalReason),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['orders']})
            qc.invalidateQueries({ queryKey: ['products']})
            qc.invalidateQueries({ queryKey: ['sales'] })
            qc.invalidateQueries({ queryKey: businessKeys.dashboardRoot(userId) })
        }
    })

    return {
        addOrder,
        updateOrder,
        deleteOrder,
        updateOrderStatus
    }
}

