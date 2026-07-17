import type {
  OrderData,
  OrderStatus,
  UpdateOrderStatusCommand,
} from './order.type'

export function toUpdateOrderStatusCommand(
  order: OrderData,
  status: OrderStatus,
): UpdateOrderStatusCommand {
  return {
    orderItems: order.items.map((orderItem) => {
      if (!orderItem.product) {
        throw new Error('Order item product is required to update its status.')
      }

      return {
        priceAtPurchase: String(orderItem.priceAtPurchase),
        quantity: orderItem.quantity,
        subtotal: String(orderItem.priceAtPurchase * orderItem.quantity),
        product: {
          id: orderItem.product.id,
          title: orderItem.product.title,
          price: orderItem.product.price,
        },
      }
    }),
    status,
  }
}
