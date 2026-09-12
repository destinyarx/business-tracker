'use client'

import { format } from 'date-fns'
import { ArrowLeft, ArrowRight, Loader2, TriangleAlert } from 'lucide-react'
import NoItemFound from '@/components/organisms/NoItemFound'
import { Button } from '@/components/ui/button'
import type { SaleRecord } from '@/features/sales/sales.type'
import {
  formatSalesCurrency,
  getSaleProfit,
  getSaleTotal,
} from '@/features/sales/sales.utils'

interface SalesTableProps {
  sales: SaleRecord[]
  currentPage: number
  totalRecords: number
  totalPages: number
  hasNext: boolean
  isLoading: boolean
  isError: boolean
  errorMessage?: string
  periodLabel: string
  onPageChange: (page: number) => void
  onViewSale: (sale: SaleRecord) => void
}

export function SalesTable({
  sales,
  currentPage,
  totalRecords,
  totalPages,
  hasNext,
  isLoading,
  isError,
  errorMessage,
  periodLabel,
  onPageChange,
  onViewSale,
}: SalesTableProps) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[940px] border-collapse">
          <thead className="bg-[#f8fafa] dark:bg-[#16292b]">
            <tr>
              <th className="border-b border-[#edf1f0] px-[18px] py-[11px] text-left text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5] dark:border-[#1e322f]">Sale</th>
              <th className="border-b border-[#edf1f0] px-3.5 py-[11px] text-left text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5] dark:border-[#1e322f]">Sale date</th>
              <th className="border-b border-[#edf1f0] px-3.5 py-[11px] text-left text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5] dark:border-[#1e322f]">Customer</th>
              <th className="border-b border-[#edf1f0] px-3.5 py-[11px] text-left text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5] dark:border-[#1e322f]">Product items</th>
              <th className="border-b border-[#edf1f0] px-3.5 py-[11px] text-right text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5] dark:border-[#1e322f]">Profit</th>
              <th className="border-b border-[#edf1f0] px-[18px] py-[11px] text-right text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5] dark:border-[#1e322f]">Sale total</th>
            </tr>
          </thead>
          <tbody>
            {isError && (
              <tr>
                <td colSpan={6} className="h-44 px-6 text-center text-sm text-red-700 dark:text-red-300">
                  {errorMessage || 'We could not load the sales records.'}
                </td>
              </tr>
            )}
            {isLoading && !isError && (
              <tr>
                <td colSpan={6} className="h-44">
                  <div className="flex flex-col items-center justify-center gap-2 text-[#7c8e8e]">
                    <Loader2 className="size-5 animate-spin" />
                    <span className="text-xs">Loading sales...</span>
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && !isError && sales.length === 0 && (
              <tr>
                <td colSpan={6} className="h-56">
                  <NoItemFound
                    title="No sales match your filters"
                    description={`Recognized sales for ${periodLabel.toLowerCase()} will appear here.`}
                  />
                </td>
              </tr>
            )}
            {!isLoading && !isError && sales.map((sale) => {
              const previewItems = sale.orderItems.slice(0, 2)
              const additionalItems = sale.orderItems.length - previewItems.length

              return (
                <tr
                  key={sale.id}
                  tabIndex={0}
                  role="button"
                  onClick={() => onViewSale(sale)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onViewSale(sale)
                    }
                  }}
                  className="cursor-pointer border-b border-[#f1f4f3] transition-colors last:border-b-0 hover:bg-[#f8fafa] focus-visible:bg-[#f3fbf8] focus-visible:outline-none dark:border-[#1e322f] dark:hover:bg-[#16292b] dark:focus-visible:bg-[#18302e]"
                  aria-label={`View details for ${sale.orderName || `sale ${sale.id}`}`}
                >
                  <td className="px-[18px] py-3">
                    <p className="text-[13px] font-medium text-[#16292b] dark:text-[#eaf3f1]">{sale.orderName?.trim() || 'Untitled order'}</p>
                    <p className="mt-0.5 font-mono text-[10.5px] text-[#93a5a5]">Sale #{sale.id} · Order #{sale.orderId}</p>
                  </td>
                  <td className="whitespace-nowrap px-3.5 py-3 text-[12.5px] text-[#5f7273] dark:text-[#9fb3b0]">{format(new Date(sale.recognizedAt), 'MMM. dd, yyyy · hh:mm a')}</td>
                  <td className="px-3.5 py-3 text-[12.5px] text-[#16292b] dark:text-[#eaf3f1]">{sale.customerName?.trim() || 'Guest customer'}</td>
                  <td className="px-3.5 py-3">
                    <div className="flex flex-col gap-0.5">
                      {previewItems.map((orderItem, index) => (
                        <span key={orderItem.id || `${orderItem.productId ?? 'product'}-${index}`} className="text-[12.5px] text-[#5f7273] dark:text-[#9fb3b0]">
                          {orderItem.quantity}× {orderItem.product?.title || 'Product unavailable'}
                        </span>
                      ))}
                      {additionalItems > 0 && <span className="text-[11px] font-medium text-[#007f78] dark:text-[#55ddd0]">+{additionalItems} more {additionalItems === 1 ? 'product' : 'products'}</span>}
                    </div>
                  </td>
                  <td className="px-3.5 py-3 text-right font-mono text-[12.5px] font-medium tabular-nums text-[#166534] dark:text-[#75db92]">
                    <span className="inline-flex items-center justify-end gap-1.5">
                      {formatSalesCurrency(getSaleProfit(sale))}
                      {sale.profitInaccurate && <TriangleAlert className="size-3.5 text-[#b77a00]" aria-label="Profit may be inaccurate" />}
                    </span>
                  </td>
                  <td className="px-[18px] py-3 text-right font-mono text-[13px] font-medium tabular-nums text-[#16292b] dark:text-[#eaf3f1]">{formatSalesCurrency(getSaleTotal(sale))}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <footer className="flex flex-wrap items-center gap-3 border-t border-[#edf1f0] px-[18px] py-3 dark:border-[#1e322f]">
        <span className="text-xs text-[#7c8e8e]">
          {totalRecords === 0
            ? '0 records'
            : `Showing ${(currentPage - 1) * 5 + 1}–${Math.min(currentPage * 5, totalRecords)} of ${totalRecords} records`}
        </span>
        <nav className="ml-auto flex items-center gap-1.5" aria-label="Sales pages">
          <Button type="button" variant="outline" size="sm" disabled={currentPage === 1 || isLoading} onClick={() => onPageChange(currentPage - 1)} className="h-8 rounded-[9px] border-[#dce3e2] bg-white px-3 text-xs shadow-none dark:border-[#2b4340] dark:bg-[#12201f]"><ArrowLeft className="size-3.5" />Previous</Button>
          {Array.from({ length: totalPages }, (_, pageIndex) => pageIndex + 1).map((page) => (
            <Button
              key={page}
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Go to sales page ${page}`}
              className={page === currentPage
                ? 'size-8 rounded-[9px] border-[#16292b] bg-[#16292b] text-xs font-semibold text-white hover:bg-[#16292b] dark:border-[#eaf3f1] dark:bg-[#eaf3f1] dark:text-[#12201f]'
                : 'size-8 rounded-[9px] border-[#dce3e2] bg-white text-xs shadow-none dark:border-[#2b4340] dark:bg-[#12201f]'}
            >
              {page}
            </Button>
          ))}
          <Button type="button" variant="outline" size="sm" disabled={!hasNext || isLoading} onClick={() => onPageChange(currentPage + 1)} className="h-8 rounded-[9px] border-[#dce3e2] bg-white px-3 text-xs shadow-none dark:border-[#2b4340] dark:bg-[#12201f]">Next<ArrowRight className="size-3.5" /></Button>
        </nav>
      </footer>
    </>
  )
}
