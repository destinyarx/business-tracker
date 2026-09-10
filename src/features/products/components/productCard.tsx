'use client'

import Image from 'next/image'
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'
import type { Product } from '@/features/products/products.types'
import { useProductFormStore } from '@/features/products/store/useProductFormStore'
import { useProducts } from '@/features/products/hooks/useProducts'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useConfirmation } from '@/app/provider/ConfirmationProvider'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount)

export default function ProductCard({ product }: ProductCardProps) {
  const { deleteProduct, deleteProductImage } = useProducts()
  const { editForm, viewForm, closeForm } = useProductFormStore()
  const confirmation = useConfirmation()
  const appToast = useToast()

  const handleDelete = async (productId: number | undefined, imageName: string | null | undefined) => {
    if (!productId) return

    const confirmed = await confirmation('Delete this product?', `${product.title} will be permanently removed.`)
    if (!confirmed) return

    try {
      await appToast.loadingPromise(
        (async () => {
          if (imageName) await deleteProductImage.mutateAsync(imageName)
          await deleteProduct.mutateAsync(productId)
        })(),
        {
          loadingTitle: 'Deleting product...',
          successTitle: 'Product deleted',
          errorTitle: 'Failed to delete product',
          errorDescription: 'Please try again.',
        },
      )
      closeForm()
    } catch {
      return
    }
  }

  const stockLabel = product.stock === 0 ? 'Out of stock' : product.stock <= 10 ? `Low · ${product.stock} left` : `${product.stock} in stock`

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[18px] border border-[#e3e9e8] bg-white transition-[border-color,box-shadow] hover:border-[#c2e7e2] hover:shadow-[0_18px_34px_-28px_rgba(12,75,71,0.5)] dark:border-[#243936] dark:bg-[#12201f] dark:hover:border-[#2f625d]">
      <div className="relative aspect-[4/3] bg-[#f2f5f4] dark:bg-[#1b2e2c]">
        <Image
          src={product.imageUrl ?? '/default-product-image.png'}
          alt={product.title}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 258px"
          fill
          className="object-cover"
        />
        <span
          className={cn(
            'absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold backdrop-blur-sm',
            product.stock === 0 && 'bg-red-600 text-white',
            product.stock > 0 && product.stock <= 10 && 'bg-[#fff7e0]/95 text-[#8a6100]',
            product.stock > 10 && 'bg-white/90 text-[#00706a]',
          )}
        >
          {stockLabel}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" aria-label={`Actions for ${product.title}`} className="absolute right-2.5 top-2.5 grid size-[30px] place-items-center rounded-[9px] border border-white/70 bg-white/85 text-[#3f5254] backdrop-blur-sm hover:border-[#00beaa] hover:bg-white">
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-xl p-1.5">
            <DropdownMenuItem onClick={() => viewForm(product)} className="rounded-lg text-[12.5px]">
              <Eye className="size-3.5" />
              View Product
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editForm(product)} className="rounded-lg text-[12.5px]">
              <Pencil className="size-3.5" />
              Edit Product
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(product.id, product.image)} className="rounded-lg text-[12.5px] text-red-600 focus:text-red-600">
              <Trash2 className="size-3.5" />
              Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-4 pb-4 pt-3.5">
        <div>
          <h2 className="line-clamp-2 text-[13.5px] font-semibold leading-[1.35] text-[#16292b] dark:text-[#eaf3f1]">{product.title}</h2>
          <p className="mt-1 font-mono text-[11px] text-[#93a5a5]">{product.sku || 'No SKU'}</p>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-[-0.02em] text-[#16292b] dark:text-[#eaf3f1]">{formatCurrency(product.price)}</span>
          {product.profitPercentage != null && <span className="text-[11px] font-medium text-[#007f78] dark:text-[#5eebdd]">{product.profitPercentage}% margin</span>}
        </div>
        <p className="mt-auto line-clamp-2 border-t border-[#edf1f0] pt-2.5 text-[11.5px] leading-[1.45] text-[#5f7273] dark:border-[#1e322f] dark:text-[#9fb3b0]">
          {product.description?.trim() || 'No description added.'}
        </p>
      </div>
    </article>
  )
}
