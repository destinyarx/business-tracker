'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Minus, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  stockAdjustmentSchema,
  type StockAdjustmentValues,
} from '@/features/inventory/inventory.schema'
import type { Product } from '@/features/products/products.types'

interface StockAdjustmentDialogProps {
  product: Product | null
  currentStock: number
  onClose: () => void
  onSave: (stock: number) => void | Promise<void>
}

export function StockAdjustmentDialog({
  product,
  currentStock,
  onClose,
  onSave,
}: StockAdjustmentDialogProps) {
  const form = useForm<StockAdjustmentValues>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: { stock: currentStock },
  })
  const watchedStock = form.watch('stock')
  const stock = Number.isFinite(watchedStock) ? Math.max(0, watchedStock) : 0

  const setStock = (nextStock: number): void => {
    form.setValue('stock', Math.max(0, Math.floor(nextStock)), {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const submitStock = async (
    stockAdjustment: StockAdjustmentValues,
  ): Promise<void> => {
    await onSave(stockAdjustment.stock)
  }

  return (
    <Dialog open={Boolean(product)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[392px] max-w-[calc(100vw-2.5rem)] gap-0 overflow-hidden rounded-[20px] border-0 bg-white p-0 shadow-[0_40px_80px_-30px_rgba(12,75,71,0.55)] dark:bg-[#12201f]"
      >
        <div className="h-[3px] bg-gradient-to-r from-[#a8d97c] to-[#12cdbe]" />
        <div className="px-6 pb-5 pt-[22px]">
          <DialogHeader className="gap-0 text-left">
            <DialogTitle className="text-base font-semibold tracking-[-0.01em]">
              Update stock on hand
            </DialogTitle>
            <DialogDescription className="mb-[18px] mt-1.5 text-[13px] leading-normal text-[#5f7273] dark:text-[#9fb3b0]">
              {product?.title} · {product?.sku || 'No SKU'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(submitStock)}>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setStock(stock - 1)}
                aria-label="Decrease stock by one"
                className="grid size-[44px] shrink-0 place-items-center rounded-xl border border-[#dce3e2] bg-white text-[#3f5254] transition-colors hover:border-[#16292b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12cdbe] dark:border-[#2b4340] dark:bg-[#12201f] dark:text-[#c3d4d1]"
              >
                <Minus className="size-4" />
              </button>
              <Input
                type="number"
                min={0}
                step={1}
                aria-label="Stock quantity"
                className="h-11 min-w-0 flex-1 rounded-xl border-[#dce3e2] bg-[#f8fafa] text-center font-mono text-[17px] font-semibold shadow-none dark:border-[#2b4340] dark:bg-[#16292b]"
                {...form.register('stock', { valueAsNumber: true })}
              />
              <button
                type="button"
                onClick={() => setStock(stock + 1)}
                aria-label="Increase stock by one"
                className="grid size-[44px] shrink-0 place-items-center rounded-xl border border-[#dce3e2] bg-white text-[#3f5254] transition-colors hover:border-[#16292b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12cdbe] dark:border-[#2b4340] dark:bg-[#12201f] dark:text-[#c3d4d1]"
              >
                <Plus className="size-4" />
              </button>
            </div>
            {form.formState.errors.stock ? (
              <p className="mt-2 text-xs text-red-600">
                {form.formState.errors.stock.message}
              </p>
            ) : (
              <p className="mt-2.5 text-[11.5px] text-[#93a5a5]">
                Currently on hand: {currentStock} units
              </p>
            )}

            <div className="mt-4 rounded-[11px] border border-[#f1dba5] bg-[#fffaf0] px-3 py-2.5 text-[11.5px] leading-relaxed text-[#7a5a12] dark:border-[#5e4b20] dark:bg-[#332b19] dark:text-[#f4d681]">
              Temporary preview only. This value resets when you refresh or leave the page.
            </div>

            <div className="mt-5 flex gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-11 flex-1 rounded-xl border-[#dce3e2] bg-white text-[13px] font-medium dark:border-[#2b4340] dark:bg-[#12201f]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-11 flex-[1.35] rounded-xl bg-[#0c4b47] text-[13px] font-semibold text-white hover:bg-[#007f78]"
              >
                Preview stock
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
