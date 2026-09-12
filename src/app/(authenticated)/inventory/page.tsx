'use client'

import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Loading from '@/components/organisms/Loading'
import { InventoryOverview } from '@/features/inventory/components/InventoryOverview'
import { InventoryTable } from '@/features/inventory/components/InventoryTable'
import { StockAdjustmentDialog } from '@/features/inventory/components/StockAdjustmentDialog'
import type { StockOverrides } from '@/features/inventory/inventory.types'
import {
  createInventorySummary,
  getEffectiveStock,
} from '@/features/inventory/inventory.utils'
import { useProducts } from '@/features/products/hooks/useProducts'
import type { Product } from '@/features/products/products.types'
import { useConfirmation } from '@/app/provider/ConfirmationProvider'
import { useToast } from '@/hooks/useToast'

export default function InventoryPage() {
  const { productsQuery } = useProducts()
  const confirmation = useConfirmation()
  const appToast = useToast()
  const [stockOverrides, setStockOverrides] = useState<StockOverrides>({})
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const products = productsQuery.data ?? []
  const summary = useMemo(
    () => createInventorySummary(products, stockOverrides),
    [products, stockOverrides],
  )
  const selectedStock = selectedProduct
    ? getEffectiveStock(selectedProduct, stockOverrides)
    : 0

  const refreshInventory = async (): Promise<void> => {
    setStockOverrides({})
    await productsQuery.refetch()
  }

  const saveStockPreview = async (stock: number): Promise<void> => {
    const productId = selectedProduct?.id
    if (!selectedProduct || !productId) return

    const confirmed = await confirmation(
      'Preview this stock update?',
      `${selectedProduct.title} will show ${stock} units until this page is refreshed or closed.`,
      { confirmText: 'Update stock' },
    )
    if (!confirmed) return

    setStockOverrides((currentOverrides) => ({
      ...currentOverrides,
      [productId]: stock,
    }))
    setSelectedProduct(null)
    appToast.success({
      title: 'Stock preview updated',
      description: 'This temporary value has not been saved to the backend.',
    })
  }

  if (productsQuery.isLoading) {
    return <Loading message="Fetching inventory, please wait..." />
  }

  if (productsQuery.isError) {
    return (
      <div className="mx-auto flex min-h-[420px] w-full max-w-[1480px] items-center justify-center rounded-[20px] border border-[#e3e9e8] bg-white p-8 text-center dark:border-[#243936] dark:bg-[#12201f]">
        <div>
          <p className="text-[15px] font-semibold">Inventory could not be loaded</p>
          <p className="mt-1 text-xs text-[#93a5a5]">
            Check your connection, then try again.
          </p>
          <Button
            type="button"
            onClick={() => productsQuery.refetch()}
            className="mt-4 rounded-[10px] bg-[#0c4b47] text-white hover:bg-[#007f78]"
          >
            <RefreshCw className="size-4" />
            Try again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1480px] text-[#16292b] dark:text-[#eaf3f1]">
      <InventoryOverview summary={summary} />
      <InventoryTable
        products={products}
        stockOverrides={stockOverrides}
        onAdjustStock={setSelectedProduct}
        onRefresh={refreshInventory}
        isRefreshing={productsQuery.isFetching}
      />
      <StockAdjustmentDialog
        key={`${selectedProduct?.id ?? 'closed'}-${selectedStock}`}
        product={selectedProduct}
        currentStock={selectedStock}
        onClose={() => setSelectedProduct(null)}
        onSave={saveStockPreview}
      />
    </div>
  )
}
