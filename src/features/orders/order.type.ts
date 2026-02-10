import type { Product } from '@/features/products/products.types'
import type { Customer } from '@/features/customers/customers.types'

export interface CartItem extends Product {
  quantity?: number
  priceAtPurchase?: number
  product?: any
  stock: number
}

export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed'

export type OrderState = 'show_orders' | 'add_order' | 'update_order' 

export type OrderForm = {
  customerId: number | null,
  orderName: string | undefined,
  status: OrderStatus | undefined,
  notes?: string | undefined,
}

export type OrderData = OrderForm & {
  id?: number,
  orderItems: CartItem[],
  status?: OrderStatus,
  items: Product[],
  quantity?: number
  priceAtPurchase?: number,
  customer?: Customer,
  createdAt?: string,
}  