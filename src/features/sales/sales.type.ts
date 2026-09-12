export type SaleState = 'active' | 'reverted'

export type SalesRange = 'today' | 'yesterday' | 'this_week' | 'this_month'

export type SaleStateFilter = SaleState | 'all'

export type SalesSortDirection = 'asc' | 'desc'

export type SalesParams = {
  range: SalesRange
  state?: SaleStateFilter
  sort: SalesSortDirection
}

export type SaleOrderItem = {
  id: number
  productId: number | null
  quantity: number
  priceAtPurchase: string
  subtotal: string
  product: {
    id: number
    title: string | null
  } | null
}

export type SaleRecord = {
  id: number
  orderId: number
  orderName: string | null
  customerId: number | null
  customerName: string | null
  totalAmount: string
  totalProfit: string | null
  profitInaccurate: boolean
  notes: string | null
  state: SaleState
  recognizedAt: string
  recognizedBy: string
  revertedAt: string | null
  revertedBy: string | null
  reversalReason: string | null
  createdAt: string
  updatedAt: string | null
  orderItems: SaleOrderItem[]
}
