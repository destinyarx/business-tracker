'use client'

import { CircleCheck, TriangleAlert } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type ConfirmationDialogProps = {
  open: boolean
  title: string
  description?: string
  confirmText: string
  cancelText: string
  destructive: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmText,
  cancelText,
  destructive,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  const Icon = destructive ? TriangleAlert : CircleCheck

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onCancel()
      }}
    >
      <AlertDialogContent
        overlayClassName="bg-[#0c4b47]/40 backdrop-blur-[3px]"
        className="gap-0 overflow-hidden rounded-[20px] border-0 bg-white p-0 text-[#16292b] shadow-[0_40px_80px_-30px_rgba(12,75,71,0.55)] dark:bg-[#12201f] dark:text-[#eaf3f1] sm:max-w-[408px]"
      >
        <div
          aria-hidden="true"
          className={
            destructive
              ? 'h-[3px] bg-[#dc2626]'
              : 'h-[3px] bg-gradient-to-r from-[#a8d97c] to-[#12cdbe]'
          }
        />

        <div className="px-6 pb-5 pt-[22px]">
          <AlertDialogHeader className="flex-row items-start gap-3.5 text-left">
            <span
              aria-hidden="true"
              className={
                destructive
                  ? 'grid size-10 shrink-0 place-items-center rounded-xl bg-[#fdecec] text-[#b01c1c] dark:bg-[#451b1b] dark:text-[#ffaaa5]'
                  : 'grid size-10 shrink-0 place-items-center rounded-xl bg-[#e4f7f4] text-[#00706a] dark:bg-[#123b37] dark:text-[#7fe0da]'
              }
            >
              <Icon className="size-[19px]" strokeWidth={1.8} />
            </span>

            <div className="min-w-0 flex-1">
              <AlertDialogTitle className="text-base font-semibold tracking-[-0.01em]">
                {title}
              </AlertDialogTitle>
              {description ? (
                <AlertDialogDescription className="mt-1.5 text-[13px] leading-[1.55] text-[#5f7273] [text-wrap:pretty] dark:text-[#9fb3b0]">
                  {description}
                </AlertDialogDescription>
              ) : null}
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-[22px] grid grid-cols-[1fr_1.35fr] gap-2.5">
            <AlertDialogCancel
              onClick={onCancel}
              className="h-auto rounded-xl border-[#e3e9e8] bg-white px-3 py-3 text-[13px] font-medium text-[#3f5254] shadow-none transition-colors hover:border-[#16292b] hover:bg-white hover:text-[#16292b] active:translate-y-px dark:border-[#2b4340] dark:bg-[#12201f] dark:text-[#c3d4d1] dark:hover:border-[#7fe0da] dark:hover:bg-[#12201f] dark:hover:text-[#eaf3f1]"
            >
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className={
                destructive
                  ? 'h-auto rounded-xl bg-[#b01c1c] px-3 py-3 text-[13px] font-semibold text-white shadow-none transition-colors hover:bg-[#941919] active:translate-y-px focus-visible:ring-[#dc2626]/35'
                  : 'h-auto rounded-xl bg-[#0c4b47] px-3 py-3 text-[13px] font-semibold text-white shadow-none transition-colors hover:bg-[#007f78] active:translate-y-px focus-visible:ring-[#12cdbe]/35'
              }
            >
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
