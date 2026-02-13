'use client'

import { useQuery, useQueryClient  } from "@tanstack/react-query"
import { useOrderService } from '@/features/orders/orderService.service'
import { OrderParams } from '@/features/orders/order.type'

export function useOrderQuery({ filter, searchKey, offset, limit }: OrderParams) {
    const qc = useQueryClient()
    const orderService = useOrderService()

    console.log('Eto sya: ', searchKey)
    
    const params = {
        ...(filter ? { filter } : {}),
        ...(searchKey ? { searchKey } : {}),
        ...(typeof offset === 'number' ? { offset } : {}),
        ...(typeof limit === 'number' ? { limit } : {}),
    }

    const ordersQuery = useQuery({
        queryKey: ['orders', params],
        queryFn: () => orderService.getAll(params)
    })

    return { ordersQuery }
}