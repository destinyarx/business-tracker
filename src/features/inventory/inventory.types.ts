import type { Product } from '@/features/products/products.types'

export type StockOverrides = Record<number, number>

export interface InventorySummary {
  stockValue: number
  unitsOnHand: number
  productCount: number
  outOfStockProducts: Product[]
  lowStockProducts: Product[]
}
