import type { Product } from '@/features/products/products.types'

export interface CartItem extends Product {
  quantity?: number
}