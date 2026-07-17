'use client'

import { createOrdersApi } from './order.api'
import { toUpdateOrderStatusCommand } from './order.mapper'
import { paginatedOrdersResponseSchema } from './order.schema'
import type {
  CreateOrderCommand,
  OrderData,
  OrderParams,
  OrderStatus,
  PaginatedOrders,
  UpdateOrderCommand,
} from './order.type'
import { useApi } from '@/hooks/useApi'
import { ensureFeatureError } from '@/lib/feature-error'

export function useOrderService() {
  const api = useApi()
  const ordersApi = createOrdersApi(api)

  return {
    async getAll(params?: OrderParams): Promise<PaginatedOrders> {
      try {
        const response = await ordersApi.getAll(params)
        return paginatedOrdersResponseSchema.parse(response).data
      } catch (error) {
        throw ensureFeatureError('order', error instanceof Error ? error : null)
      }
    },

    async create(order: CreateOrderCommand): Promise<void> {
      try {
        await ordersApi.create(order)
      } catch (error) {
        throw ensureFeatureError('order', error instanceof Error ? error : null)
      }
    },

    async update(orderId: number, order: UpdateOrderCommand): Promise<void> {
      try {
        await ordersApi.update(orderId, order)
      } catch (error) {
        throw ensureFeatureError('order', error instanceof Error ? error : null)
      }
    },

    async delete(orderId: number): Promise<void> {
      try {
        await ordersApi.delete(orderId)
      } catch (error) {
        throw ensureFeatureError('order', error instanceof Error ? error : null)
      }
    },

    async updateOrderStatus(order: OrderData, status: OrderStatus): Promise<void> {
      if (!order.id) {
        throw ensureFeatureError('order', new Error('Order ID is required.'))
      }

      try {
        await ordersApi.updateStatus(order.id, toUpdateOrderStatusCommand(order, status))
      } catch (error) {
        throw ensureFeatureError('order', error instanceof Error ? error : null)
      }
    },
  }
}
