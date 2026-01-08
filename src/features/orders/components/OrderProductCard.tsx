import { cn } from '@/lib/utils'
import type { Product } from '@/features/products/products.types'

interface Props {
  product: Product
  isSelected?: boolean
  onClick?: () => void
}


export default function OrderProductCard({ product, isSelected, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex cursor-pointer gap-3 rounded-lg border bg-white p-2 shadow-sm transition',
        'hover:border-teal-500 hover:bg-teal-50 hover:shadow-xl',
        isSelected && 'border-teal-600 bg-teal-50',
      )}
    >
      {/* Image */}
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
          alt="Product image"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="truncate text-sm font-medium text-slate-900">
          {product.title}
        </div>

        <div className="text-xs text-slate-500">
          {product.category}
        </div>

        <div className="mt-0.5 text-sm font-semibold text-teal-600">
          ₱{product.price}
        </div>
      </div>
    </div>
  )
}
