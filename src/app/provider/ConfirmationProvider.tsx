'use client'

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
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
  const [opts, setOpts] = useState<ConfirmOptions>({
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

      setOpts({
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
  },[])

  return (
    <ConfirmationContext.Provider value={confirm}>
      {children}

      <AlertDialog open={open} onOpenChange={(v) => !v && close(false)}>
        <AlertDialogContent className='sm:max-w-[420px] rounded-2xl'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-base'>
              {opts.title}
            </AlertDialogTitle>
            {opts.description ? (
              <AlertDialogDescription className='text-sm'>
                {opts.description}
              </AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => close(false)}
              className='rounded-xl text-white bg-rose-600 hover:bg-rose-400'
            >
              {opts.cancelText}
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => close(true)}
              className={
                opts.destructive
                  ? 'rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : 'rounded-xl text-white bg-green-500 hover:bg-green-300'
              }
            >
              {opts.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmationContext.Provider>
  )
}

export function useConfirmation() {
  const ctx = useContext(ConfirmationContext)
  if (!ctx) {
    throw new Error('Unexpected error occured.')
  }
  return ctx
}
