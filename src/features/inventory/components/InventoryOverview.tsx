'use client'

import { Boxes, CircleDollarSign, PackageX, TriangleAlert } from 'lucide-react'
import { ModuleMetricCard } from '@/components/molecules/ModuleMetricCard'
import type { InventorySummary } from '@/features/inventory/inventory.types'
import { formatInventoryCurrency } from '@/features/inventory/inventory.utils'

interface InventoryOverviewProps {
  summary: InventorySummary
}

const createProductHint = (productNames: string[], fallback: string): string => {
  if (!productNames.length) return fallback
  if (productNames.length === 1) return productNames[0]
  return `${productNames[0]} +${productNames.length - 1} more`
}

export function InventoryOverview({ summary }: InventoryOverviewProps) {
  const outOfStockNames = summary.outOfStockProducts.map((product) => product.title)
  const lowStockNames = summary.lowStockProducts.map((product) => product.title)

  return (
    <section
      aria-label="Inventory overview"
      className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4"
    >
      <ModuleMetricCard
        label="Stock value"
        value={formatInventoryCurrency(summary.stockValue)}
        hint="Price × stock"
        icon={CircleDollarSign}
        accent="#12cdbe"
        iconClassName="bg-[#e4f7f4] text-[#007f78]"
        chartValues={[9, 10, 9.5, 11, 11.6, 12.1]}
      />
      <ModuleMetricCard
        label="Out of stock"
        value={String(summary.outOfStockProducts.length)}
        hint={createProductHint(outOfStockNames, 'All products available')}
        icon={PackageX}
        accent="#dc2626"
        iconClassName="bg-[#fdecec] text-[#b01c1c]"
        chartValues={[6, 5, 4, 4, 2, 1]}
      />
      <ModuleMetricCard
        label="Low stock (<10)"
        value={String(summary.lowStockProducts.length)}
        hint={createProductHint(lowStockNames, 'No low-stock products')}
        icon={TriangleAlert}
        accent="#ffb018"
        iconClassName="bg-[#fff7e0] text-[#8a6100]"
        chartValues={[2, 3, 2, 4, 3, 2]}
      />
      <ModuleMetricCard
        label="Units on hand"
        value={String(summary.unitsOnHand)}
        hint={`Across ${summary.productCount} products`}
        icon={Boxes}
        accent="#16292b"
        iconClassName="bg-[#f2f5f4] text-[#3f5254]"
        chartValues={[520, 505, 540, 528, 512, 493]}
      />
    </section>
  )
}
