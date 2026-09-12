'use client'

import { useApi } from '@/hooks/useApi'
import { ensureFeatureError } from '@/lib/feature-error'
import { createSalesApi } from './sales.api'
import {
  saleDetailResponseSchema,
  salesResponseSchema,
} from './sales.schema'
import type { SaleRecord, SalesParams } from './sales.type'

export function useSalesService() {
  const api = useApi()
  const salesApi = createSalesApi(api)

  return {
    async getAll(params: SalesParams): Promise<SaleRecord[]> {
      try {
        const response = await salesApi.getAll(params)
        return salesResponseSchema.parse(response).data
      } catch (error) {
        throw ensureFeatureError('sales', error instanceof Error ? error : null)
      }
    },

    async getById(saleId: number): Promise<SaleRecord> {
      if (!Number.isInteger(saleId) || saleId <= 0) {
        throw ensureFeatureError('sale', new Error('Sale ID is required.'))
      }

      try {
        const response = await salesApi.getById(saleId)
        return saleDetailResponseSchema.parse(response).data
      } catch (error) {
        throw ensureFeatureError('sale', error instanceof Error ? error : null)
      }
    },
  }
}
