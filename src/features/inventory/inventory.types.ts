import type { Product } from '@/features/products/products.types'

export interface InventorySummary {
  stockValue: number
  unitsOnHand: number
  productCount: number
  outOfStockProducts: Product[]
  lowStockProducts: Product[]
}
