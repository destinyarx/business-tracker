import type { AxiosInstance } from 'axios'
import type {
  CreateOrderCommand,
  OrderParams,
  UpdateOrderCommand,
  UpdateOrderStatusCommand,
} from './order.type'

export function createOrdersApi(api: AxiosInstance) {
  return {
    async getAll(params?: OrderParams): Promise<object> {
      const orderParams = new URLSearchParams()

      if (typeof params?.limit === 'number') orderParams.set('limit', String(params.limit))
      if (typeof params?.offset === 'number') orderParams.set('offset', String(params.offset))
      if (params?.filter) orderParams.set('filter', params.filter)
      if (params?.searchKey) orderParams.set('searchKey', params.searchKey)
      if (params?.timePeriod) orderParams.set('timePeriod', params.timePeriod)
      if (params?.sort) orderParams.set('sort', params.sort)
      if (params?.sortByStatus) orderParams.set('sortByStatus', params.sortByStatus)

      const response = await api.get<object>('/orders', { params: orderParams })
      return response.data
    },

    async create(order: CreateOrderCommand): Promise<void> {
      await api.post('/orders', order)
    },

    async update(orderId: number, order: UpdateOrderCommand): Promise<void> {
      await api.put(`/orders/${orderId}`, order)
    },

    async delete(orderId: number): Promise<void> {
      await api.delete(`/orders/${orderId}`)
    },

    async updateStatus(orderId: number, command: UpdateOrderStatusCommand): Promise<void> {
      await api.patch(`/orders/${orderId}/status`, command)
    },
  }
}
