'use client'

import { useQuery  } from "@tanstack/react-query"
import { useOrderService } from '@/features/orders/orderService.service'
import { OrderParams } from '@/features/orders/order.type'
import { businessKeys, useBusinessScope } from '@/lib/business-scope'

export function useOrderQuery({ filter, searchKey, timePeriod, offset, limit, sort, sortByStatus }: OrderParams) {
    const orderService = useOrderService()
    const { ready, userId } = useBusinessScope()

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
        queryKey: businessKeys.orders(userId, params),
        queryFn: () => orderService.getAll(params),
        enabled: ready,
    })

    return { ordersQuery }
}
