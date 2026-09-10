import { ImageIcon, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRODUCT_CATEGORY } from '@/constants'
import type { Product } from '@/features/products/products.types'
import { formatOrderCurrency } from '@/features/orders/order.utils'

interface OrderProductCardProps {
  product: Product
  isSelected?: boolean
  onClick?: () => void
}

export default function OrderProductCard({
  product,
  isSelected = false,
  onClick,
}: OrderProductCardProps) {
  const categoryLabel =
    PRODUCT_CATEGORY.find((category) => category.value === product.category)?.name ??
    product.category ??
    'Uncategorized'

  return (
    <article
      className={cn(
        'flex flex-col gap-2.5 rounded-[15px] border bg-[#fbfcfc] p-3 transition-[border-color,background-color,transform] duration-200 dark:bg-[#16292b]',
        isSelected
          ? 'border-[#12cdbe] bg-[#f3fbf8] dark:border-[#12cdbe] dark:bg-[#173331]'
          : 'border-[#e3e9e8] hover:-translate-y-0.5 hover:border-[#00beaa] hover:bg-white dark:border-[#2b4340] dark:hover:bg-[#12201f]',
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-[#f2f5f4] dark:bg-[#0b1615]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="size-full object-cover"
          />
        ) : (
          <div className="grid size-full place-items-center text-[#93a5a5]">
            <ImageIcon className="size-6" strokeWidth={1.6} />
          </div>
        )}
        {isSelected && (
          <span className="absolute right-2 top-2 rounded-full bg-[#0c4b47] px-2 py-1 text-[9.5px] font-semibold text-white">
            In order
          </span>
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-[12.5px] font-semibold leading-snug text-[#16292b] dark:text-[#eaf3f1]">
          {product.title}
        </p>
        <p className="mt-0.5 truncate text-[10.5px] text-[#93a5a5]">
          {categoryLabel}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold text-[#007f78] dark:text-[#55ddd0]">
          {formatOrderCurrency(product.price)}
        </span>
        <span className="ml-auto text-[10.5px] text-[#7c8e8e] dark:text-[#9fb3b0]">
          {product.stock} left
        </span>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-[10px] border border-[#dce3e2] bg-white text-xs font-semibold text-[#16292b] transition-colors hover:border-[#16292b] hover:bg-[#16292b] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12cdbe] dark:border-[#2b4340] dark:bg-[#12201f] dark:text-[#eaf3f1] dark:hover:bg-[#eaf3f1] dark:hover:text-[#16292b]"
      >
        <Plus className="size-3.5" />
        Add to order
      </button>
    </article>
  )
}
