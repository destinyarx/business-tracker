import type { Product } from '@/features/products/products.types'
import type { Customer } from '@/features/customers/customers.types'

export type OrderProductSummary = Required<Pick<Product, 'id'>> &
  Pick<Product, 'title' | 'price' | 'profit'>
export type OrderCustomerSummary = Pick<Customer, 'name'>

export interface CartItem extends Product {
  quantity?: number
}

export type OrderLineItem = {
  id?: number
  quantity: number
  priceAtPurchase: number
  product?: OrderProductSummary
  profit?: number
}

export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed'

export type OrderState = 'show_orders' | 'add_order' | 'update_order' 

export type OrderForm = {
  customerId: number | null,
  orderName?: string,
  status: OrderStatus,
  notes?: string | undefined,
}

export type OrderData = OrderForm & {
  id?: number,
  orderName?: string,
  orderItems: OrderLineItem[],
  totalAmount?: number,
  totalProfit?: number,
  status?: OrderStatus,
  items: OrderLineItem[],
  quantity?: number
  priceAtPurchase?: number,
  customer?: OrderCustomerSummary,
  createdAt: string,
  statusUpdatedAt?: string,
  profitInaccurate?: boolean
} 

export type CreateOrderItemCommand = {
  id?: number
  price: number
  quantity: number
  profit?: number | null
}

export type CreateOrderCommand = {
  customerId: number | null
  orderName: string | null
  notes: string | null
  orderItems: CreateOrderItemCommand[]
  totalAmount: string
  status: 'pending'
}

export type UpdateOrderCommand = Pick<OrderData, 'orderName' | 'customerId' | 'notes'>

export type UpdateOrderStatusCommand = {
  status: OrderStatus
  reversalReason?: string
}

export type PaginatedOrders = {
  orders: OrderData[]
  hasNext: boolean
  hasPrev?: boolean
}

export type Period = 'today' | 'yesterday' | 'week' | 'last_week' | 'month'

export type OrderParams = {
  filter?: string,
  searchKey?: string,
  offset?: number,
  limit?: number,
  timePeriod?: Period,
  sort?: 'asc' | 'desc'
  sortByStatus?: 'asc' | 'desc'
}
