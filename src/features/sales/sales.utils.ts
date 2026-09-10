import type { OrderData, OrderLineItem } from '@/features/orders/order.type'

const philippinePesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
})

export type SalesSummary = {
  totalSales: number
  averageSale: number
  unitsSold: number
  bestCustomer: string
  profitInaccurate: boolean
}

export const formatSalesCurrency = (amount: number): string =>
  philippinePesoFormatter.format(amount)

export const getSaleDate = (order: OrderData): string =>
  order.statusUpdatedAt ?? order.createdAt

export const getOrderItems = (order: Pick<OrderData, 'items' | 'orderItems'>): OrderLineItem[] =>
  order.items.length ? order.items : order.orderItems

export const getOrderUnits = (order: Pick<OrderData, 'items' | 'orderItems'>): number =>
  getOrderItems(order).reduce((total, orderItem) => total + orderItem.quantity, 0)

export const getOrderTotal = (order: OrderData): number => {
  if (typeof order.totalAmount === 'number') {
    return order.totalAmount
  }

  return getOrderItems(order).reduce(
    (total, orderItem) => total + orderItem.priceAtPurchase * orderItem.quantity,
    0,
  )
}

export const getSalesSummary = (orders: OrderData[]): SalesSummary => {
  const customerSales = new Map<string, number>()
  let totalSales = 0
  let unitsSold = 0
  let profitInaccurate = false

  orders.forEach((order) => {
    const orderTotal = getOrderTotal(order)
    const customerName = order.customer?.name?.trim() || 'Guest customer'

    totalSales += orderTotal
    unitsSold += getOrderUnits(order)
    profitInaccurate ||= Boolean(order.profitInaccurate)
    customerSales.set(customerName, (customerSales.get(customerName) ?? 0) + orderTotal)
  })

  const bestCustomer = Array.from(customerSales.entries()).sort(
    ([, firstTotal], [, secondTotal]) => secondTotal - firstTotal,
  )[0]?.[0] ?? '—'

  return {
    totalSales,
    averageSale: orders.length ? totalSales / orders.length : 0,
    unitsSold,
    bestCustomer,
    profitInaccurate,
  }
}

export const getFilteredSales = (
  orders: OrderData[],
  searchQuery: string,
  sort: 'asc' | 'desc',
): OrderData[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  return orders
    .filter((order) => {
      if (!normalizedQuery) {
        return true
      }

      const searchableText = [
        order.id,
        order.orderName,
        order.customer?.name,
        ...getOrderItems(order).map((orderItem) => orderItem.product?.title),
      ]
        .filter((searchPart) => searchPart !== undefined)
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedQuery)
    })
    .sort((firstOrder, secondOrder) => {
      const difference = new Date(getSaleDate(firstOrder)).getTime() - new Date(getSaleDate(secondOrder)).getTime()
      return sort === 'asc' ? difference : -difference
    })
}
