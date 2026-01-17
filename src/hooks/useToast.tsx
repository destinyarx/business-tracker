'use client'

import { toast } from 'sonner'
import { CheckCircle, XCircle, Loader2, HelpCircle } from 'lucide-react'

type ToastOptions = {
  title: string
  description?: string
}

export function useToast() {
  function success({ title, description }: ToastOptions) {
    toast(
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-400" />
        <div>
          <p className="font-semibold">{title}</p>
          {description && (
            <p className="text-sm opacity-80">{description}</p>
          )}
        </div>
      </div>
    )
  }

  function error({ title, description }: ToastOptions) {
    toast(
      <div className="flex items-start gap-3">
        <XCircle className="h-5 w-5 text-red-400" />
        <div>
          <p className="font-semibold">{title}</p>
          {description && (
            <p className="text-sm opacity-80">{description}</p>
          )}
        </div>
      </div>
    )
  }

  function loading({ title, description }: ToastOptions) {
    return toast(
      <div className="flex items-start gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
        <div>
          <p className="font-semibold">{title}</p>
          {description && (
            <p className="text-sm opacity-80">{description}</p>
          )}
        </div>
      </div>,
      { duration: 0 }
    )
  }


  async function loadingPromise<T>(
    promise: Promise<T>,
    {
      loadingTitle,
      loadingDescription,
      successTitle,
      successDescription,
      errorTitle,
      errorDescription
    }: {
      loadingTitle: string
      loadingDescription?: string
      successTitle: string
      successDescription?: string
      errorTitle: string
      errorDescription?: string
    }
  ): Promise<T> {
    const id = loading({
      title: loadingTitle,
      description: loadingDescription
    })

    try {
      const result = await promise
      toast.dismiss(id)

      success({
        title: successTitle,
        description: successDescription
      })

      return result
    } catch (err) {
      toast.dismiss(id)

      error({
        title: errorTitle,
        description: errorDescription
      })

      throw err
    }
  }

  function confirmation({ title, description }: ToastOptions): Promise<boolean> {
    return new Promise((resolve) => {
      const id = toast(
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-semibold">{title}</p>
              {description && (
                <p className="text-sm opacity-80">{description}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => {
                toast.dismiss(id)
                resolve(false)
              }}
              className="rounded-md border px-3 py-1 text-xs hover:bg-muted"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                toast.dismiss(id)
                resolve(true)
              }}
              className="rounded-md bg-foreground px-3 py-1 text-xs font-medium text-background hover:bg-foreground/90"
            >
              Confirm
            </button>
          </div>
        </div>,
        { duration: Infinity }
      )
    })
  }

  return { success, error, loading, loadingPromise, confirmation }
}
