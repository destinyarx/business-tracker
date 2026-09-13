import type { Product } from '@/features/products/products.types'
import type { InventorySummary } from '@/features/inventory/inventory.types'

const philippinePesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
})

export const formatInventoryCurrency = (amount: number): string =>
  philippinePesoFormatter.format(amount)

export const createInventorySummary = (products: Product[]): InventorySummary => {
  const outOfStockProducts: Product[] = []
  const lowStockProducts: Product[] = []
  let stockValue = 0
  let unitsOnHand = 0

  products.forEach((product) => {
    const stock = product.stock
    stockValue += product.price * stock
    unitsOnHand += stock

    if (stock === 0) {
      outOfStockProducts.push(product)
    } else if (stock < 10) {
      lowStockProducts.push(product)
    }
  })

  return {
    stockValue,
    unitsOnHand,
    productCount: products.length,
    outOfStockProducts,
    lowStockProducts,
  }
}
