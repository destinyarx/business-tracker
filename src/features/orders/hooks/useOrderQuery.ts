'use client'

import { useQuery  } from "@tanstack/react-query"
import { useOrderService } from '@/features/orders/orderService.service'
import { OrderParams } from '@/features/orders/order.type'

export function useOrderQuery({ filter, searchKey, timePeriod, offset, limit, sort, sortByStatus }: OrderParams) {
    const orderService = useOrderService()
    
    const params = {
        ...(filter ? { filter } : {}),
        ...(searchKey ? { searchKey } : {}),
        ...(timePeriod ? { timePeriod } : {}),
        ...(sort ? { sort } : {}),
        ...(sortByStatus ? { sortByStatus } : {}),
        ...(typeof offset === 'number' ? { offset } : {}),
        ...(typeof limit === 'number' ? { limit } : {}),
    }

    const ordersQuery = useQuery({
        queryKey: ['orders', params],
        queryFn: () => orderService.getAll(params)
    })

    return { ordersQuery }
}