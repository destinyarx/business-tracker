'use client'

import { RefreshCw, X } from 'lucide-react'
import ProductTable from '@/features/products/components/ProductsTable'
import ProductForm from '@/features/products/components/productForm'
import Loading from '@/components/organisms/Loading'
import { useProductFormStore } from '@/features/products/store/useProductFormStore'
import { useProducts } from '@/features/products/hooks/useProducts'
import { FormState } from '@/features/products/products.types'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export default function Products() {
  const { productsQuery } = useProducts()
  const { showForm, formState, product, closeForm } = useProductFormStore()

  if (productsQuery.isLoading) {
    return <Loading message="Fetching products, please wait..." />
  }

  if (productsQuery.isError) {
    return (
      <div className="rounded-[18px] border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/40 dark:bg-red-950/20">
        <p className="text-sm font-medium text-red-800 dark:text-red-300">Something went wrong loading products.</p>
        <Button variant="outline" className="mt-4" onClick={() => productsQuery.refetch()}>
          <RefreshCw className="size-4" />
          Try again
        </Button>
      </div>
    )
  }

  const panelTitle =
    formState === FormState.ADD
      ? 'Add product'
      : formState === FormState.VIEW
        ? 'View product'
        : 'Edit product'
  const crumb =
    formState === FormState.ADD
      ? 'Products / New record'
      : formState === FormState.VIEW
        ? 'Products / View record'
        : 'Products / Edit record'

  return (
    <div className="mx-auto w-full max-w-[1480px] text-[#16292b] dark:text-[#eaf3f1]">
      <ProductTable products={productsQuery.data ?? []} />

      <Sheet open={showForm} onOpenChange={(open) => !open && closeForm()}>
        <SheetContent className="w-[500px] max-w-[94vw] gap-0 border-l-0 bg-white p-0 shadow-[-30px_0_60px_-30px_rgba(11,32,33,0.5)] dark:bg-[#12201f] sm:max-w-[470px] [&>button]:hidden">
          <SheetHeader className="flex-row items-start gap-3 border-b border-[#edf1f0] px-[22px] py-4 text-left dark:border-[#1e322f]">
            <span className="w-1 self-stretch shrink-0 rounded-full bg-gradient-to-b from-[#a8d97c] to-[#12cdbe]" />
            <div className="flex-1">
              <SheetDescription className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[#93a5a5]">{crumb}</SheetDescription>
              <SheetTitle className="text-[19px] font-semibold tracking-[-0.02em]">{panelTitle}</SheetTitle>
              {product && <p className="mt-1 truncate text-[11.5px] text-[#7c8e8e]">{product.title}</p>}
            </div>
            <button type="button" onClick={closeForm} aria-label="Close product form" className="grid size-8 place-items-center rounded-[10px] border border-[#e3e9e8] bg-white hover:border-[#16292b] dark:border-[#2b4340] dark:bg-[#12201f]">
              <X className="size-4" />
            </button>
          </SheetHeader>
          <ProductForm />
        </SheetContent>
      </Sheet>
    </div>
  )
}
