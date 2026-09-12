'use client'

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ConfirmationDialog } from '@/components/organisms/ConfirmationDialog'

export type ConfirmOptions = {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
}

export type ConfirmExtras = Omit<ConfirmOptions, 'title' | 'description'>

export type ConfirmFn = (
  title: string,
  description?: string,
  opts?: ConfirmExtras
) => Promise<boolean>

const ConfirmationContext = createContext<ConfirmFn | undefined>(undefined)

const DEFAULTS: Required<
  Pick<ConfirmOptions, 'confirmText' | 'cancelText' | 'destructive'>
> = {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  destructive: false,
}

export function ConfirmationProvider({ children }: { children: ReactNode }) {
  const resolverRef = useRef<((value: boolean) => void) | null>(null)
  const [open, setOpen] = useState<boolean>(false)
  const [options, setOptions] = useState<ConfirmOptions>({
    title: '',
    description: '',
    ...DEFAULTS,
  })

  const close = useCallback((result: boolean) => {
    setOpen(false)
    const resolve = resolverRef.current
    resolverRef.current = null
    resolve?.(result)
  }, [])

  const confirm = useCallback<ConfirmFn>(
    (title, description, more) => {
      if (resolverRef.current) {
        resolverRef.current(false)
        resolverRef.current = null
      }

      setOptions({
        title,
        description,
        confirmText: more?.confirmText ?? DEFAULTS.confirmText,
        cancelText: more?.cancelText ?? DEFAULTS.cancelText,
        destructive: more?.destructive ?? DEFAULTS.destructive,
      })
      setOpen(true)

      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve
      })
  }, [])

  return (
    <ConfirmationContext.Provider value={confirm}>
      {children}

      <ConfirmationDialog
        open={open}
        title={options.title}
        description={options.description}
        confirmText={options.confirmText ?? DEFAULTS.confirmText}
        cancelText={options.cancelText ?? DEFAULTS.cancelText}
        destructive={options.destructive ?? DEFAULTS.destructive}
        onCancel={() => close(false)}
        onConfirm={() => close(true)}
      />
    </ConfirmationContext.Provider>
  )
}

export function useConfirmation(): ConfirmFn {
  const confirmation = useContext(ConfirmationContext)
  if (!confirmation) {
    throw new Error('useConfirmation must be used within ConfirmationProvider.')
  }
  return confirmation
}
