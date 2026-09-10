import { PackageOpen, Pencil, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { StockOverrides } from '@/features/inventory/inventory.types'
import {
  formatInventoryCurrency,
  getEffectiveStock,
} from '@/features/inventory/inventory.utils'
import type { Product } from '@/features/products/products.types'

interface InventoryTableProps {
  products: Product[]
  stockOverrides: StockOverrides
  onAdjustStock: (product: Product) => void
  onRefresh: () => void | Promise<void>
  isRefreshing: boolean
}

const StockBadge = ({ stock }: { stock: number }) => {
  if (stock === 0) {
    return (
      <span className="rounded-full bg-[#fdecec] px-2.5 py-1 text-[10.5px] font-semibold text-[#b01c1c] dark:bg-[#4a2020] dark:text-[#ff9999]">
        Out of stock
      </span>
    )
  }

  if (stock < 10) {
    return (
      <span className="rounded-full bg-[#fff7e0] px-2.5 py-1 text-[10.5px] font-semibold text-[#8a6100] dark:bg-[#4a3818] dark:text-[#ffd66b]">
        Low stock
      </span>
    )
  }

  return (
    <span className="rounded-full bg-[#e4f7f4] px-2.5 py-1 text-[10.5px] font-semibold text-[#00706a] dark:bg-[#173d39] dark:text-[#55ddd0]">
      In stock
    </span>
  )
}

export function InventoryTable({
  products,
  stockOverrides,
  onAdjustStock,
  onRefresh,
  isRefreshing,
}: InventoryTableProps) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#e3e9e8] bg-white dark:border-[#243936] dark:bg-[#12201f]">
      <div className="flex items-center gap-2.5 border-b border-[#edf1f0] px-[18px] py-[15px] dark:border-[#1e322f]">
        <h2 className="text-[14.5px] font-semibold">Stock on hand</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isRefreshing}
          onClick={onRefresh}
          className="ml-auto h-8 rounded-[10px] border-[#dce3e2] bg-white px-3 text-xs font-medium dark:border-[#2b4340] dark:bg-[#12201f]"
        >
          <RefreshCw className={cn('size-3.5', isRefreshing && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {products.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead className="bg-[#f8fafa] dark:bg-[#16292b]">
              <tr>
                <th className="border-b border-[#edf1f0] px-[18px] py-[11px] text-left text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5] dark:border-[#1e322f]">
                  Product
                </th>
                <th className="border-b border-[#edf1f0] px-3.5 py-[11px] text-left text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5] dark:border-[#1e322f]">
                  Supplier
                </th>
                <th className="border-b border-[#edf1f0] px-3.5 py-[11px] text-left text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5] dark:border-[#1e322f]">
                  Stock
                </th>
                <th className="border-b border-[#edf1f0] px-[18px] py-[11px] text-right text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5] dark:border-[#1e322f]">
                  Stock value
                </th>
                <th className="border-b border-[#edf1f0] px-[18px] py-[11px] text-right text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5] dark:border-[#1e322f]">
                  Update
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const stock = getEffectiveStock(product, stockOverrides)

                return (
                  <tr
                    key={product.id ?? `${product.title}-${product.sku}`}
                    className="border-b border-[#f1f4f3] transition-colors last:border-b-0 hover:bg-[#f8fafa] dark:border-[#1e322f] dark:hover:bg-[#16292b]"
                  >
                    <td className="px-[18px] py-3">
                      <p className="text-[13px] font-medium text-[#16292b] dark:text-[#eaf3f1]">
                        {product.title}
                      </p>
                      <p className="mt-0.5 font-mono text-[10.5px] text-[#93a5a5]">
                        {product.sku || 'No SKU'}
                      </p>
                    </td>
                    <td className="px-3.5 py-3 text-[12.5px] text-[#5f7273] dark:text-[#9fb3b0]">
                      {product.supplier || '—'}
                    </td>
                    <td className="px-3.5 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="min-w-[26px] font-mono text-[13px] font-medium">
                          {stock}
                        </span>
                        <StockBadge stock={stock} />
                      </div>
                    </td>
                    <td className="px-[18px] py-3 text-right font-mono text-[12.5px]">
                      {formatInventoryCurrency(product.price * stock)}
                    </td>
                    <td className="px-[18px] py-3 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!product.id}
                        onClick={() => onAdjustStock(product)}
                        className="h-8 rounded-[10px] border-[#dce3e2] px-3 text-xs font-medium text-[#3f5254] hover:border-[#00beaa] hover:bg-[#f3fbf8] dark:border-[#2b4340] dark:bg-[#12201f] dark:text-[#c3d4d1]"
                      >
                        <Pencil className="size-3.5" />
                        Update stock
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-16 text-center">
          <span className="mx-auto mb-3 grid size-12 place-items-center rounded-[14px] bg-[#f2f5f4] text-[#7c8e8e] dark:bg-[#16292b]">
            <PackageOpen className="size-5" />
          </span>
          <p className="text-[14px] font-semibold">No inventory records</p>
          <p className="mt-1 text-xs text-[#93a5a5]">
            Products appear here when they are added to the catalog.
          </p>
        </div>
      )}
    </div>
  )
}
