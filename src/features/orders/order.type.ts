import type { Product } from '@/features/products/products.types'

export interface CartItem extends Product {
  quantity?: number
  priceAtPurchase?: number
}

export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export type OrderState = 'show_orders' | 'add_order' | 'update_order' 

export type OrderForm = {
  customerId: number | null,
  orderName: string | undefined,
  orderStatus: OrderStatus | undefined,
  notes?: string | undefined,
}

export type OrderData = OrderForm & {
  orderItems: CartItem[],
  status?: OrderStatus,
  items: Product[],
  quantity?: number
  priceAtPurchase?: number
}  