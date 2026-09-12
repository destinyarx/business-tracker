import type {
  OrderStatus,
  UpdateOrderStatusCommand,
} from './order.type'

export function toUpdateOrderStatusCommand(
  status: OrderStatus,
  reversalReason?: string,
): UpdateOrderStatusCommand {
  return {
    status,
    ...(reversalReason?.trim()
      ? { reversalReason: reversalReason.trim() }
      : {}),
  }
}
