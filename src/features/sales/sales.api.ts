import type { AxiosInstance } from 'axios'
import type { SalesParams } from './sales.type'

export function createSalesApi(api: AxiosInstance) {
  return {
    async getAll(params: SalesParams): Promise<object> {
      const salesParams = new URLSearchParams({
        range: params.range,
        sort: params.sort,
      })
      if (params.state) salesParams.set('state', params.state)
      const response = await api.get<object>('/sales', { params: salesParams })
      return response.data
    },

    async getById(saleId: number): Promise<object> {
      const response = await api.get<object>(`/sales/${saleId}`)
      return response.data
    },
  }
}
