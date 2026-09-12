'use client'

import { useState } from 'react'
import { RotateCcw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import type { OrderStatus } from '@/features/orders/order.type'

interface OrderReversalDialogProps {
  open: boolean
  targetStatus?: OrderStatus
  isSubmitting: boolean
  onCancel: () => void
  onSubmit: (reversalReason: string) => void | Promise<void>
}

export default function OrderReversalDialog({
  open,
  targetStatus,
  isSubmitting,
  onCancel,
  onSubmit,
}: OrderReversalDialogProps) {
  const [reversalReason, setReversalReason] = useState('')
  const trimmedReason = reversalReason.trim()

  const closeDialog = (): void => {
    if (isSubmitting) return
    setReversalReason('')
    onCancel()
  }

  const submitReason = async (): Promise<void> => {
    if (!trimmedReason || trimmedReason.length > 500) return
    await onSubmit(trimmedReason)
    setReversalReason('')
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && closeDialog()}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[460px] gap-0 overflow-hidden rounded-[20px] border-0 bg-white p-0 shadow-[0_32px_70px_-28px_rgba(12,75,71,0.55)] dark:bg-[#12201f] sm:max-w-[460px] [&>button]:hidden">
        <div className="h-[3px] bg-gradient-to-r from-[#ffb018] to-[#e06b34]" />
        <header className="flex items-start gap-3 border-b border-[#edf1f0] px-[22px] py-5 dark:border-[#1e322f]">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#fff7e0] text-[#8a6100] dark:bg-[#493816] dark:text-[#ffd66b]">
            <RotateCcw className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-[17px] font-semibold tracking-[-0.02em]">Reverse completed sale</DialogTitle>
            <DialogDescription className="mt-1 text-[12.5px] leading-5 text-[#5f7273] dark:text-[#9fb3b0]">
              Moving this order to {targetStatus?.replace('_', ' ')} reverses its active Sale and restores stock when the transition requires it.
            </DialogDescription>
          </div>
          <Button type="button" variant="outline" size="icon-sm" disabled={isSubmitting} onClick={closeDialog} aria-label="Close reversal form" className="size-8 rounded-[10px] border-[#dce3e2] bg-white shadow-none dark:border-[#2b4340] dark:bg-[#12201f]"><X className="size-4" /></Button>
        </header>

        <div className="px-[22px] py-5">
          <label htmlFor="reversal-reason" className="text-[12px] font-semibold text-[#3f5254] dark:text-[#c3d4d1]">Reversal reason</label>
          <Textarea
            id="reversal-reason"
            autoFocus
            maxLength={500}
            value={reversalReason}
            onChange={(event) => setReversalReason(event.target.value)}
            placeholder="Explain why this completed sale is being reversed"
            className="mt-2 min-h-28 resize-none rounded-xl border-[#dce3e2] bg-[#f8fafa] text-[13px] shadow-none focus-visible:border-[#00beaa] focus-visible:ring-[#12cdbe]/20 dark:border-[#2b4340] dark:bg-[#16292b]"
          />
          <div className="mt-1.5 flex items-center justify-between text-[10.5px] text-[#93a5a5]">
            <span>A reason is required.</span>
            <span>{reversalReason.length}/500</span>
          </div>
        </div>

        <footer className="flex justify-end gap-2 border-t border-[#edf1f0] px-[22px] py-4 dark:border-[#1e322f]">
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={closeDialog} className="h-10 rounded-xl border-[#dce3e2] bg-white px-4 text-[13px] dark:border-[#2b4340] dark:bg-[#12201f]">Cancel</Button>
          <Button type="button" disabled={!trimmedReason || isSubmitting} onClick={submitReason} className="h-10 rounded-xl bg-[#0c4b47] px-4 text-[13px] font-semibold text-white hover:bg-[#007f78]">{isSubmitting ? 'Reversing...' : 'Confirm reversal'}</Button>
        </footer>
      </DialogContent>
    </Dialog>
  )
}
