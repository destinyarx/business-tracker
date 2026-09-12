import type { OrderStatus } from './order.type'

const philippinePesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
})

export const formatOrderCurrency = (amount: number): string =>
  philippinePesoFormatter.format(amount)

const allowedStatusTargets: Record<OrderStatus, readonly OrderStatus[]> = {
  pending: ['in_progress', 'cancelled', 'failed'],
  in_progress: ['completed', 'cancelled', 'failed'],
  completed: ['in_progress', 'cancelled', 'failed'],
  cancelled: ['in_progress'],
  failed: ['in_progress'],
}

export const getAllowedOrderStatusTargets = (
  currentStatus: OrderStatus,
): readonly OrderStatus[] => allowedStatusTargets[currentStatus]
