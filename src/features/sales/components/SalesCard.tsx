'use client'

import { format } from 'date-fns'
import { Check, Loader2, TriangleAlert, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { useSaleQuery } from '@/features/sales/hooks/useSalesQuery'
import type { SaleRecord } from '@/features/sales/sales.type'
import {
  formatSalesCurrency,
  getSaleProfit,
  getSaleTotal,
  getSaleUnits,
} from '@/features/sales/sales.utils'

interface SalesCardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale?: SaleRecord
}

export default function SalesCard({ open, onOpenChange, sale }: SalesCardProps) {
  const { saleQuery } = useSaleQuery(open ? sale?.id : undefined)
  const displayedSale = saleQuery.data ?? sale

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2.5rem)] w-[calc(100%-2rem)] max-w-[520px] gap-0 overflow-hidden rounded-[20px] border-0 bg-white p-0 shadow-[0_40px_80px_-30px_rgba(12,75,71,0.55)] dark:bg-[#12201f] sm:max-w-[520px] [&>button]:hidden">
        <div className="h-[3px] bg-gradient-to-r from-[#a8d97c] to-[#12cdbe]" />
        <header className="flex items-start gap-3 border-b border-[#edf1f0] px-[22px] pb-4 pt-5 dark:border-[#1e322f]">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[11px] text-[#93a5a5]">{displayedSale ? `Sale #${displayedSale.id} · Order #${displayedSale.orderId}` : 'No reference'}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e7f7ec] px-2.5 py-1 text-[10.5px] font-semibold text-[#166534] dark:bg-[#173824] dark:text-[#75db92]"><Check className="size-3" />Recognized</span>
            </div>
            <DialogTitle className="mt-1 text-[17px] font-semibold tracking-[-0.02em] text-[#16292b] dark:text-[#eaf3f1]">{displayedSale?.orderName?.trim() || 'Untitled order'}</DialogTitle>
            <DialogDescription className="mt-1 text-[12.5px] text-[#5f7273] dark:text-[#9fb3b0]">
              {displayedSale?.customerName?.trim() || 'Guest customer'}
              {displayedSale && ` · ${format(new Date(displayedSale.recognizedAt), 'MMM. dd, yyyy · hh:mm a')}`}
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button type="button" variant="outline" size="icon-sm" aria-label="Close sale details" className="size-8 shrink-0 rounded-[10px] border-[#dce3e2] bg-white shadow-none dark:border-[#2b4340] dark:bg-[#12201f]"><X className="size-4" /></Button>
          </DialogClose>
        </header>

        {saleQuery.isLoading && (
          <div className="flex min-h-48 items-center justify-center text-[#7c8e8e]">
            <Loader2 className="size-5 animate-spin" />
          </div>
        )}

        {!saleQuery.isLoading && saleQuery.isError && (
          <div className="min-h-48 px-6 py-12 text-center text-sm text-red-700 dark:text-red-300">
            {saleQuery.error.message}
          </div>
        )}

        {!saleQuery.isLoading && !saleQuery.isError && (
          <>
            <section className="max-h-[46vh] min-h-0 overflow-y-auto px-[22px] py-4" aria-label="Product items">
              <h3 className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#93a5a5]">Product items</h3>
              <div className="flex flex-col gap-2">
                {displayedSale?.orderItems.map((orderItem, index) => (
                  <div key={orderItem.id || `${orderItem.productId ?? 'product'}-${index}`} className="flex items-center gap-3 rounded-xl border border-[#edf1f0] bg-[#fbfcfc] px-3 py-2.5 dark:border-[#1e322f] dark:bg-[#16292b]">
                    <span className="min-w-[34px] font-mono text-xs font-semibold text-[#007f78] dark:text-[#55ddd0]">{orderItem.quantity}×</span>
                    <span className="min-w-0 flex-1 text-[13px] text-[#16292b] dark:text-[#eaf3f1]">{orderItem.product?.title || 'Product unavailable'}</span>
                    <span className="whitespace-nowrap font-mono text-[11.5px] text-[#93a5a5]">{formatSalesCurrency(Number(orderItem.priceAtPurchase) || 0)} ea</span>
                    <span className="whitespace-nowrap font-mono text-[12.5px] font-medium">{formatSalesCurrency(Number(orderItem.subtotal) || 0)}</span>
                  </div>
                ))}
                {!displayedSale?.orderItems.length && <p className="py-8 text-center text-xs text-[#93a5a5]">No product items are available for this sale.</p>}
              </div>
              {displayedSale?.notes?.trim() && <div className="mt-4 rounded-xl bg-[#f8fafa] px-3 py-2.5 text-xs leading-5 text-[#5f7273] dark:bg-[#16292b] dark:text-[#9fb3b0]"><span className="font-semibold text-[#3f5254] dark:text-[#c3d4d1]">Notes: </span>{displayedSale.notes}</div>}
              {displayedSale?.profitInaccurate && <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#fff7e0] px-3 py-2.5 text-[11.5px] leading-5 text-[#8a6100] dark:bg-[#493816] dark:text-[#ffd66b]"><TriangleAlert className="mt-0.5 size-3.5 shrink-0" />Profit may be inaccurate because one or more products have no recorded profit.</div>}
            </section>

            <footer className="flex flex-wrap items-center gap-3 border-t border-[#edf1f0] px-[22px] pb-[18px] pt-3.5 dark:border-[#1e322f]">
              <div>
                <p className="text-[11px] text-[#93a5a5]">{displayedSale ? getSaleUnits(displayedSale) : 0} units · Profit {formatSalesCurrency(displayedSale ? getSaleProfit(displayedSale) : 0)}</p>
                <p className="mt-0.5 text-xl font-semibold tracking-[-0.02em] text-[#16292b] dark:text-[#eaf3f1]">{formatSalesCurrency(displayedSale ? getSaleTotal(displayedSale) : 0)}</p>
              </div>
              <DialogClose asChild><Button type="button" className="ml-auto h-10 rounded-xl bg-[#0c4b47] px-5 text-[13px] font-semibold text-white hover:bg-[#007f78]">Close details</Button></DialogClose>
            </footer>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
