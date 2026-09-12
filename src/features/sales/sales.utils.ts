import type { SaleRecord } from './sales.type'

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

export const getSaleTotal = (sale: SaleRecord): number =>
  Number(sale.totalAmount) || 0

export const getSaleProfit = (sale: SaleRecord): number =>
  Number(sale.totalProfit) || 0

export const getSaleUnits = (sale: SaleRecord): number =>
  sale.orderItems.reduce(
    (total, orderItem) => total + orderItem.quantity,
    0,
  )

export const getSalesSummary = (sales: SaleRecord[]): SalesSummary => {
  const customerSales = new Map<string, number>()
  let totalSales = 0
  let unitsSold = 0
  let profitInaccurate = false

  sales.forEach((sale) => {
    const saleTotal = getSaleTotal(sale)
    const customerName = sale.customerName?.trim() || 'Guest customer'

    totalSales += saleTotal
    unitsSold += getSaleUnits(sale)
    profitInaccurate ||= sale.profitInaccurate
    customerSales.set(
      customerName,
      (customerSales.get(customerName) ?? 0) + saleTotal,
    )
  })

  const bestCustomer = Array.from(customerSales.entries()).sort(
    ([, firstTotal], [, secondTotal]) => secondTotal - firstTotal,
  )[0]?.[0] ?? '—'

  return {
    totalSales,
    averageSale: sales.length ? totalSales / sales.length : 0,
    unitsSold,
    bestCustomer,
    profitInaccurate,
  }
}

export const getFilteredSales = (
  sales: SaleRecord[],
  searchQuery: string,
  sort: 'asc' | 'desc',
): SaleRecord[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  return sales
    .filter((sale) => {
      if (!normalizedQuery) return true

      return [sale.orderName, sale.customerName, sale.notes]
        .filter((searchPart): searchPart is string => Boolean(searchPart))
        .some((searchPart) =>
          searchPart.toLowerCase().includes(normalizedQuery),
        )
    })
    .sort((firstSale, secondSale) => {
      const difference =
        new Date(firstSale.recognizedAt).getTime() -
        new Date(secondSale.recognizedAt).getTime()
      return sort === 'asc' ? difference : -difference
    })
}
