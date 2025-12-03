'use client'

import { toast } from 'sonner'
import {
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react"

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

  return { success, error, loading, loadingPromise }
}
