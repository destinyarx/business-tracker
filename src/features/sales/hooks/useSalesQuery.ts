'use client'

import { useQuery } from '@tanstack/react-query'
import { businessKeys, useBusinessScope } from '@/lib/business-scope'
import { useSalesService } from '@/features/sales/sales.service'
import type { SalesParams } from '@/features/sales/sales.type'

export function useSalesQuery(params: SalesParams) {
  const salesService = useSalesService()
  const { ready, userId } = useBusinessScope()
  const state = params.state ?? 'active'

  const salesQuery = useQuery({
    queryKey: businessKeys.sales(userId, params.range, state, params.sort),
    queryFn: () => salesService.getAll(params),
    enabled: ready,
  })

  return { salesQuery }
}

export function useSaleQuery(saleId?: number) {
  const salesService = useSalesService()
  const { ready, userId } = useBusinessScope()

  const saleQuery = useQuery({
    queryKey: businessKeys.sale(userId, saleId ?? 0),
    queryFn: () => salesService.getById(saleId ?? 0),
    enabled: ready && Boolean(saleId),
  })

  return { saleQuery }
}
